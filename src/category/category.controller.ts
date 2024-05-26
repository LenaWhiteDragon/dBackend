import {
  Body,
  Controller,
  Post,
  HttpException,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { CategoryService} from './category.service';

interface Category {
  name: string;
}

@Controller('category')
export class CategoryController {
  constructor(private category: CategoryService) {}

  @Get('/')
  async getCategories() {
    const data = await this.category.getCategories();
    console.log(data);
    return data;
  }
  @Get('/getCategoriesAtts/:id')
  async getCategoriesAtts(@Param('id') id) {
    console.log(id);
    console.log('Test2');
    const data = await this.category.getCategoriesAtts(id);
    console.log(data);
    return data;
  }
  @Post('/addCategory')
  async addCategory(@Body() category: Category) {
    const { name } = category;
    const data = await this.category.addCategory(name);
    console.log(data);
    return data;
  }
}
