import { Injectable, NotFoundException } from '@nestjs/common';
import pool from 'src/db';
import { Order } from './order.controller';

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
  async changeOrderCompletedStatus(order: Order) {
    const { id_order, is_completed } = order;

    const updateOrder = await pool.query(
      `UPDATE orders SET is_completed='{${is_completed}}' WHERE id_order=${id_order}`,
    );
  }
}
