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

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('/')
  async getOrder() {
    const data = await this.orderService.getOrders();
    console.log(data);
    return data;
  }

  @Put('/')
  async changeOrderCompletedStatus(@Body() order: Order) {
    const data = await this.orderService.changeOrderCompletedStatus(order);
    console.log(data);
    return data;
  }
}
