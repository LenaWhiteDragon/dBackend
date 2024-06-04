import { Injectable, NotFoundException } from '@nestjs/common';
import pool from 'src/db';

@Injectable()
export class CategoryService {
  async getCategories() {
    const categories = await pool.query('SELECT * FROM categories');
    return categories.rows;
  }

  async getAttsList() {
    const atts = await pool.query(
      'SELECT id_att as id, name, type FROM atts ORDER BY name',
    );
    return atts.rows;
  }
  async addNewAtt(name, type) {
    const att = await pool.query(
      `INSERT INTO atts(name, type) VALUES ('${name}', '${type}') RETURNING id_att as id, name, type`,
    );
    return att.rows;
  }

  async addCategory(name, id_atts) {
    if (name === undefined || name === '') {
      throw new NotFoundException('Название категории отсутствует');
    }

    const category = await pool.query(
      `INSERT INTO categories(name) VALUES ('${name}') RETURNING id_category`,
    );
    console.log(id_atts);
    console.log(id_atts.length);
    id_atts.forEach(async (attr) => {
      await pool.query(
        `INSERT INTO atts_of_categories(id_att,id_category) VALUES ('${attr}',${category.rows[0].id_category}) `,
      );
    });

    return category;
  }

  async getCategoriesAtts(id) {
    const categories =
      await pool.query(`SELECT atts_of_categories.id_att, atts.name as a_name, atts.type  
      FROM categories JOIN atts_of_categories ON  categories.id_category = atts_of_categories.id_category
      AND categories.id_category =${id} 
      JOIN atts ON atts_of_categories.id_att = atts.id_att`);

    const categories_new = categories.rows;
    const attributes = categories.rows.map((attr) => ({
      id: attr.id_att,
      name: attr.a_name,
      type: attr.type,
    }));
    const categoryObject = {
      atts: attributes,
    };
    console.log(categoryObject);
    return categoryObject;
  }
}
