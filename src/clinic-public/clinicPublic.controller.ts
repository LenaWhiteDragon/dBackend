import {
    Body,
    Controller,
    Post,
    HttpException,
    UseGuards,
    Get,
    Query,
    StreamableFile,
  } from "@nestjs/common";
import { ClinicPublicService } from "./clinicPublic.service";
  
interface FilterInterface {
    filter: string
   }
  //параметры запроса
  
  @Controller("clinicsPublic")
  export class ClinicPublicController {
    constructor(private clinicService: ClinicPublicService) {}

    @Get("/clinicImage")
    async getDoctorImage(@Query('id') query): Promise<StreamableFile>   {
      const filter = query;
      console.log(filter);
      const data = await this.clinicService.getClinicImage(filter)
      console.log(data);
      //const file = createReadStream(join(process.cwd(), 'package.json'));
      const buff = await data.arrayBuffer()
        let x = new Uint8Array(buff); // x is your uInt8Array
        // perform all required operations with x here.
      return new StreamableFile(x);
    }

    @Get("/")
    async getClinics(@Query('filter') query)  {
      const filter = query;
      console.log(filter);
      const data = await this.clinicService.getClinics(filter)
      console.log(data);
      return data;
    }

    @Get("/getClinicsByService")
    async getClinicsByService(@Query('filter') filter, @Query('id') id)  {
      console.log(filter);
      const data = await this.clinicService.getClinicsByService(id, filter)
      console.log(data);
      return data;
    }

    @Get("/getClinicById") 
    async getClinicById(@Query('id') query)  {
      const filter = query;
      console.log(filter);
      const data = await this.clinicService.getClinicById(filter)
      console.log(data);
      return data;
    }

    @Get("/getClinicByIdLanding") 
    async getClinicLanding(@Query('id') query)  {
      const filter = query;
      console.log(filter);
      const data = await this.clinicService.getClinicByIdLanding(filter)
      console.log(data);
      return data;
    }

    @Get("/getBlogs") 
    async getBlogs (@Query('id') query)  {
      const filter = query;
      console.log(filter);
      const data = await this.clinicService.getBlogs(filter)
      console.log(data);
      return data;
    }

    

  }