import {
  Body,
  Controller,
  HttpException,
  UseGuards,
  Get,
  Query,
  Param,
  Put,
} from '@nestjs/common';
import { OrderService } from './order.service';

export interface Order {
  id_order: number;
  id_user: number;
  id_product: number;
  number: number[];
  date: string;
  is_completed: boolean;
}
export type OrderStatus = Pick<Order, 'id_order' | 'is_completed'>;

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('/')
  async getOrder() {
    const data = await this.orderService.getOrders();
    console.log(data);
    return data;
  }

  @Put('/status')
  async changeOrderCompletedStatus(@Body() orderStatus: OrderStatus) {
    return await this.orderService.changeOrderCompletedStatus(
      orderStatus.id_order,
      orderStatus.is_completed,
    );
  }
}
