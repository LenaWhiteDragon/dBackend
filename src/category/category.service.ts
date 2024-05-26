import { Injectable } from '@nestjs/common';
import pool from 'src/db';

@Injectable()
export class CategoryService {
  async getCategories() {
    const categories = await pool.query('SELECT * FROM categories');
    return categories.rows;
  }
  async addCategory(name) {
    const category = await pool.query(
      `INSERT INTO categories(name) VALUES ('${name}')`,
    );
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
