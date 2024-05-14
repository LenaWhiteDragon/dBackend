import {
  Body,
  Controller,
  Post,
  HttpException,
  UseGuards,
  Get,
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
  @Post('/addCategory')
  async addCategory(@Body() category: Category) {
    const { name } = category;
    const data = await this.category.addCategory(name);
    console.log(data);
    return data;
  }
}
