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

export type AttOfProduct = { [key: string]: number | boolean };

interface CreateProductBase {
  name: string;
  id_category: number;
}
export interface CreateProductBody extends CreateProductBase {
  atts_of_products: string;
}

export interface CreateProductRequest extends CreateProductBase {
  atts_of_products: AttOfProduct[];
}

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/')
  async getProductSearch(
    @Query('filter') filter: string,
    @Query('c_id') c_id: number,
    @Query('searchAttrs') searchAttrs: string,
    @Query('ranges') ranges: string,
  ) {
    const parsedSearchAttrs = JSON.parse(searchAttrs || '{}');
    const parsedRanges = JSON.parse(ranges || '[]');
    const data = await this.productService.getProductSearch(
      filter,
      c_id,
      parsedSearchAttrs,
      parsedRanges,
    );
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

  @Put('/orderProduct')
  async orderProduct(@Body() product: Product) {
    console.log(product);
    const data = await this.productService.orderProduct(product);
    console.log(data);
    return data;
  }

  @Post('/createProduct')
  async createProduct(@Body() product: CreateProductBody) {
    console.log(product);
    const data = await this.productService.createProduct({
      ...product,
      atts_of_products: JSON.parse(product.atts_of_products),
    });
    console.log(data);
    return data;
  }
}
