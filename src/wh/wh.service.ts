import { Injectable } from '@nestjs/common';
import pool from 'src/db';

@Injectable()
export class WhService {
  async getWhs() {
    const whs = await pool.query('SELECT * FROM whs');
    return whs.rows;
  }
  async addWh(name, address) {
    const wh = await pool.query(
      `INSERT INTO whs(name,address) VALUES ('${name}', '${address}')`,
    );
    return wh;
  }
}
