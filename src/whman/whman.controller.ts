import {
  Body,
  Controller,
  Post,
  HttpException,
  UseGuards,
  Get,
  Delete,
  Query,
  Put,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import {WhmanService, ServiceAdd} from "./whman.service";
import { FileInterceptor } from "@nestjs/platform-express";


interface AuthInterface {
  email: string;
  password: string;
}

interface BossId {
  whbossId: string;
}

interface Whboss {
  WhbossId: string,
  email: string,
  password: string,
  id_wh: string,
 // photo: File
}

interface Whman {
  id_whman: string,
  name: string,
  id_wh: string
} 


@Controller("Whman")
export class WhmanController {
  constructor(private auth: WhmanService) {}

  @Get("/getWhbosssByWhs") 
  async getWhbosssByWhs (@Query('id') query)  {
    const filter = query;
    console.log(filter);
    const data = await this.auth.getWhbossesByWh(filter)
    console.log(data);
    return data;
  }

  @Post('/addWhboss')
  async addWhboss(@Body() Whboss: Whboss) {
    console.log(Whboss);
    const {email, password, id_wh} = Whboss;
    const data = await this.auth.addWhboss(email, password, id_wh);
   // const data = await this.auth.addWhboss( email, password, file);
    console.log(data);
    return data;
  }

  // @Post("/addWhboss")
  // async addWhboss(@Body() authCred: Whboss) {
  //  // const {email, password, fam, name, otch, specialty, photo, id_whman} = authCred;
  //   const {email, password, fam, name, otch, specialty, id_whman} = authCred;
  //  // const data = await this.auth.addWhboss( email, password, fam, name, otch, specialty, photo, id_whman);
  //   const data = await this.auth.addWhboss( email, password, file);
  //   console.log(data);
  //   return data;
  // }

  @Delete("/deleteWhboss")
  async deleteWhboss(@Body() authCred: BossId) {
    const {whbossId } = authCred;
    const data = await this.auth.deleteWhboss(whbossId);
    console.log(data);
    return data;
  }

  @Get("/getWhbossById") 
    async getWhbosss (@Query('id') query)  {
      const filter = query;
      console.log(filter);
      const data = await this.auth.getWhbossById(filter)
      console.log(data);
      return data;
    }

    @Put("/editWhboss")
    async editWhboss(@Body() authCred: Whboss) {
      const {WhbossId, email, password} = authCred;
      const data = await this.auth.editWhboss( WhbossId, email, password);
      console.log(data);
      return data;
    }
}