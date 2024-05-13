import {
  Body,
  Controller,
  Post,
  HttpException,
  UseGuards,
  Get,
} from '@nestjs/common';
import { WhService } from './wh.service';

interface WH {
  name: string;
  address: string;
}

@Controller('wh')
export class WhController {
  constructor(private wh: WhService) {}

  @Get('/')
  async getWhs() {
    const data = await this.wh.getWhs();
    console.log(data);
    return data;
  }
  @Post('/addWh')
  async addWh(@Body() wh: WH) {
    const { name, address } = wh;
    const data = await this.wh.addWh(name, address);
    console.log(data);
    return data;
  }
}
