import { Injectable, NotFoundException } from '@nestjs/common';
import pool from 'src/db';

@Injectable()
export class OrderService {
  async getOrders() {
    const orders = await pool.query(
      `SELECT orders.id_order, orders.user_id, orders.id_product, products.name, orders.order_number, orders.date,
       orders.is_completed FROM orders JOIN products ON orders.id_product=products.id_product`,
    );

    if (orders.rows.length === 0)
      throw new NotFoundException('Оборудование не найдено');

    return orders.rows;
  }
  async changeOrderCompletedStatus(orderId: number, isCompleted: boolean) {
    return await pool.query(
      `UPDATE orders SET is_completed='${isCompleted}' WHERE id_order=${orderId} RETURNING *`,
    );
  }
}
