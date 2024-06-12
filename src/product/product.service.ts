import { Injectable, NotFoundException } from '@nestjs/common';
import pool from 'src/db';
import { CreateProductRequest, Product } from './product.controller';

@Injectable()
export class ProductService {
  async getProductById(id) {
    const products =
      await pool.query(`SELECT products.id_product, products.name, products.photo, products.number, 
       products.id_category,categories.name as c_name,atts.id_att, atts.name as a_name,atts.type,atts_of_products.var_integer,
       atts_of_products.var_boolean,atts_of_products.var_real FROM products JOIN atts_of_products 
       ON products.id_product = atts_of_products.id_product AND products.id_product =${id} 
       JOIN atts ON atts_of_products.id_att = atts.id_att JOIN categories ON products.id_category = categories.id_category`);
    if (products.rows.length === 0)
      throw new NotFoundException('Оборудование не найдено');
    const products_new = products.rows;
    const attributes = products.rows.map((attr) => ({
      id: attr.id_att,
      name: attr.a_name,
      type: attr.type,
      var_integer: attr.var_integer,
      var_boolean: attr.var_boolean,
      var_real: attr.var_real,
    }));
    const productObject = {
      id: products_new[0].id_product,
      name: products_new[0].name,
      photo: products_new[0].photo,
      number: products_new[0].number,
      category: {
        id: products_new[0].id_category,
        name: products_new[0].c_name,
      },
      atts: attributes,
    };
    console.log(productObject);
    return productObject;
  }

  async getProductSearch(
    filter: string,
    c_id: number,
    searchAttrs = {},
    ranges = [],
  ) {
    const categoryRequest = c_id ? ` AND categories.id_category = ${c_id}` : '';

    let searchAttrsRequest = '';
    if (Object.keys(searchAttrs).length > 0) {
      for (const [key, value] of Object.entries(searchAttrs)) {
        if (value !== null && value !== '') {
          const valueType =
            typeof value === 'number' ? 'var_integer' : 'var_boolean';
          searchAttrsRequest += ` AND atts_of_products.id_att = ${key} AND atts_of_products.${valueType} = ${value}`;
        }
      }
    }

    const rangeRequest = ranges
      ? ranges.reduce((accumulator, range, index) => {
          const { id_att, minValue, maxValue } = range;
          let condition = ` ${index === 0 ? 'AND' : 'OR'} atts_of_products.id_att = ${id_att}`;
          if (
            minValue !== null &&
            minValue !== undefined &&
            maxValue !== null &&
            maxValue !== undefined
          ) {
            condition += ` AND (atts_of_products.var_integer BETWEEN ${minValue} AND ${maxValue} OR atts_of_products.var_real BETWEEN ${minValue} AND ${maxValue})`;
          } else if (minValue !== null && minValue !== undefined) {
            condition += ` AND (atts_of_products.var_integer >= ${minValue} OR atts_of_products.var_real >= ${minValue})`;
          } else if (maxValue !== null && maxValue !== undefined) {
            condition += ` AND (atts_of_products.var_integer <= ${maxValue} OR atts_of_products.var_real <= ${maxValue})`;
          }
          accumulator += condition;
          return accumulator;
        }, '')
      : '';

    const productsData = await pool.query(
      `
      SELECT products.id_product, products.name, products.photo, 
             products.id_category, categories.name AS c_name,
             atts.id_att, atts.name AS a_name, atts.type,
             atts_of_products.var_integer, atts_of_products.var_boolean, atts_of_products.var_real
      FROM products
      JOIN atts_of_products ON products.id_product = atts_of_products.id_product
      JOIN atts ON atts_of_products.id_att = atts.id_att
      JOIN categories ON products.id_category = categories.id_category
      WHERE products.name ILIKE $1 ${categoryRequest} ${searchAttrsRequest} ${rangeRequest}
    `,
      [`%${filter}%`],
    );

    if (productsData.rows.length === 0) {
      throw new NotFoundException('Оборудование не найдено');
    }

    const productsMap = {};

    productsData.rows.forEach((row) => {
      if (!productsMap[row.id_product]) {
        productsMap[row.id_product] = {
          id: row.id_product,
          name: row.name,
          photo: row.photo,
          category: {
            id: row.id_category,
            name: row.c_name,
          },
          atts: [],
        };
      }

      productsMap[row.id_product].atts.push({
        id: row.id_att,
        name: row.a_name,
        type: row.type,
        var_integer: row.var_integer,
        var_boolean: row.var_boolean,
        var_real: row.var_real,
      });
    });

    const productsArray = Object.values(productsMap);
    const productFilteredByAtts = productsArray.filter((product) => {
      // @ts-ignore
      return ranges.length === 0 || product.atts.length === ranges.length;
    });

    return productFilteredByAtts;
  }

  async orderProduct(product: Product) {
    const { id_product, number, id_user } = product;
    const numberProduct = await pool.query(
      `SELECT number FROM products WHERE id_product=${id_product}`,
    );
    const countWhs = await pool.query(`SELECT COUNT(id_wh) FROM whs`);
    let newNumber = numberProduct.rows[0].number.map(
      (el, index) => el - number[index],
    );
    const newWhsAmount = countWhs.rows[0].count - newNumber.length; // if there are new whs then add zeros
    if (newWhsAmount > 0) {
      for (let i = 0; i <= newWhsAmount - 1; i++) newNumber.push(0);
    }
    const updateNumber = await pool.query(
      `UPDATE products SET number='{${newNumber}}' WHERE id_product=${id_product}`,
    );
    const responseProduct = await pool.query(
      `INSERT INTO orders(id_product, order_number, user_id, date) 
      VALUES ('${id_product}', '{${number}}', '${id_user}', to_timestamp(${Date.now()} / 1000.0))`,
    );
  }
  async setProduct(product: Product) {
    const { id_product, number } = product;
    const numberProduct = await pool.query(
      `SELECT number FROM products WHERE id_product=${id_product}`,
    );
    const countWhs = await pool.query(`SELECT COUNT(id_wh) FROM whs`);
    let newNumber = number;
    const newWhsAmount = countWhs.rows[0].count - newNumber.length; // if there are new whs then add zeros
    if (newWhsAmount > 0) {
      for (let i = 0; i <= newWhsAmount - 1; i++) newNumber.push(0);
    }
    const response = await pool.query(
      `UPDATE products SET number='{${number}}' WHERE id_product=${id_product} RETURNING number`,
    );
    return response.rows[0];
  }

  async createProduct({
    name,
    id_category,
    atts_of_products,
    photo,
  }: CreateProductRequest) {
    const responseProduct = await pool.query(
      `INSERT INTO products(name, id_category, number, photo)
        VALUES ('${name}', '${id_category}', '{}', '${photo}')
        RETURNING id_product
        `,
    );

    atts_of_products.forEach(async (att) => {
      const value = Object.values(att)[0];
      const key = Object.keys(att)[0];
      const idProduct = responseProduct.rows[0].id_product;

      const typeOfAttr = await pool.query(
        `SELECT type FROM atts WHERE id_att=${key}`,
      );

      if (typeof value === 'number' || typeof value === 'boolean') {
        await pool.query(
          `INSERT INTO atts_of_products(id_product, id_att, var_${typeOfAttr.rows[0].type})
        VALUES ('${idProduct}', '${key}', '${value}')
        RETURNING id_product
        `,
        );
      }
    });

    return responseProduct.rows;
  }
}
