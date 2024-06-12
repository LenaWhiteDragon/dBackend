import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [],
})
export class OrderModule {}
