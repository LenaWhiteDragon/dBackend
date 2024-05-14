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
}
