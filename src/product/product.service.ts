import { Injectable, NotFoundException } from '@nestjs/common';
import pool from 'src/db';
import { Product } from './product.controller';

@Injectable()
export class ProductService {
  // constructor(private jwtService: JwtService) {}

  async getProduct(filter) {
    // return [{id: 1, name: "комп леново"}, {id: 2, name: "мышка элджи"}, {id: 3, name: "монитор асер"}]
    const products = await pool.query(
      "SELECT * FROM products WHERE LOWER(name) LIKE LOWER('%" + filter + "%')",
    );
    if (products.rows.length === 0)
      throw new NotFoundException('Оборудование не найдено');
    //const token = jwtTokens(users.rows[0]);
    // return users.rows[0];
    // const token = jwtTokens(users.rows[0]);
    // console.log(token);
    const products_new = products.rows;
    return products_new;
    //console.log(token);
    // return res.json({ token: `Bearer ${token}` });
  }

  async getProductById(id) {
    // return [{id: 1, name: "комп леново"}, {id: 2, name: "мышка элджи"}, {id: 3, name: "монитор асер"}]
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

  async getProductSearch(filter) {
    //убрано number[] для оптимизации
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
        WHERE products.name ILIKE $1
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

    console.log(productsArray);
    return productsArray;
  }

  async getProductByCategories(id, filter) {
    //return [{id: 1, name: "Mikhail"}, {id: 2, name: "nicolai"}, {id: 3, name: "ffff"}]
    const products = await pool.query(
      "SELECT * FROM products WHERE LOWER(name) LIKE LOWER('%" +
        filter +
        "%') AND id_category =" +
        id +
        ')',
    );

    // const clinics = await pool.query("Select * From policlinics Where id_policlinics in (select policlinic_id from policlinic_products where products_id =" + filter + ")")
    if (products.rows.length === 0)
      throw new NotFoundException('Оборудование не найдено.');
    const products_new = products.rows;
    return products_new;
    //console.log(token);
    // return res.json({ token: `Bearer ${token}` });
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
}

/*
    async createUser(email: string, password: string): Promise<Partial<users>> {
      const hashedPassword = bcrypt.hashSync(password, 12);
      return await this.userService.users.create({
        data: {
          uid: uuid4(),
          email: email,
          password: hashedPassword,
        },
        select: {
          uid: true,
          email: true,
          nickname: true,
        },
      });
    }
    */
