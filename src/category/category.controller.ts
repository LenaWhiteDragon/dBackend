import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { CategoryService } from './category.service';

interface AddCategory {
  name: string;
  id_atts: string;
}

interface AddNewAtt {
  name: string;
  type: 'integer' | 'real' | 'boolean';
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

  @Get('/getAttsList')
  async getAttsList() {
    const data = await this.category.getAttsList();
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
  async addCategory(@Body() categoryInfo: AddCategory) {
    const { name, id_atts } = categoryInfo;
    const data = await this.category.addCategory(name, JSON.parse(id_atts));
    console.log(data);
    return data;
  }

  @Post('/addNewAtt')
  async addNewAtt(@Body() attInfo: AddNewAtt) {
    const { name, type } = attInfo;
    const data = await this.category.addNewAtt(name, type);
    console.log(data);
    return data;
  }
}
