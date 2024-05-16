import {
  Body,
  Controller,
  Post,
  HttpException,
  UseGuards,
  Get,
  Query,
  Param,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';

export interface Product {
  id_product: number;
  number: number[];
  id_user: number;
}
//параметры запроса

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/')
  async getProduct(@Query('filter') query) {
    const filter = query;
    console.log(filter);
    console.log('Test1');
    const data = await this.productService.getProduct(filter);
    console.log(data);
    return data;
  }

  @Get('/getProductById/:id')
  async getProductById(@Param('id') id) {
    console.log(id);
    console.log('Test2');
    const data = await this.productService.getProductById(id);
    console.log(data);
    return data;
  }

  @Get('/getProductByCategories')
  async getClinicsByService(@Query('filter') filter, @Query('id') id) {
    console.log(filter);
    const data = await this.productService.getProductByCategories(id, filter);
    console.log(data);
    return data;
  }

  @Put('/orderProduct')
  async orderProduct(@Body() product: Product) {
    console.log(product);
    const data = await this.productService.orderProduct(product);
    console.log(data);
    return data;
  }
}
