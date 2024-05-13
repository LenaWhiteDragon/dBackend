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
import { DoctorsService } from "./doctors.service";
import { createReadStream } from "fs";
  
interface FilterInterface {
    filter: string
   }
  //параметры запроса
  
  @Controller("doctors")
  export class DoctorsController {
    constructor(private doctorsService: DoctorsService) {}
  
    @Get("/")
    async getDoctors (@Query('filter') query)  {
      const filter = query;
      console.log(filter);
      const data = await this.doctorsService.getDoctors(filter)
      console.log(data);
      return data;
    }

    @Get("/doctorImage")
    async getDoctorImage(@Query('id') query): Promise<StreamableFile>   {
      const filter = query;
      console.log(filter);
      const data = await this.doctorsService.getDoctorImage(filter)
      console.log(data);
      //const file = createReadStream(join(process.cwd(), 'package.json'));
      const buff = await data.arrayBuffer()
        let x = new Uint8Array(buff); // x is your uInt8Array
        // perform all required operations with x here.
      return new StreamableFile(x);
    }

  
    @Get("/getDoctorByClinic")
    async getDoctorByClinic(@Query('filter') filter, @Query('id') id)  {
      console.log(filter);
      const data = await this.doctorsService.getDoctorByClinic(id, filter)
      console.log(data);
      return data;
    }

    
    @Get("/getSchedules")
    async getSchedules(@Query('id') id, @Query('isBooked') isBooked)  {
      console.log(id);
      const data = await this.doctorsService.getShedules(isBooked, id)
      console.log(data);
      return data;
    }

        
    @Get("/getSchedulesByUser")
    async getSchedulesByUser(@Query('id') userid, @Query('isBooked') isBooked)  {
      console.log(userid);
      const data = await this.doctorsService.getShedulesByUser(isBooked, userid)
      console.log(data);
      return data;
    }
    

    @Get("/getDoctorById") 
    async getDoctorById (@Query('id') query)  {
      const filter = query;
      console.log(filter);
      const data = await this.doctorsService.getDoctorById(filter)
      console.log(data);
      return data;
    }

    @Get("/getMedcard") 
    async getMedcard (@Query('id') query)  {
      const filter = query;
      console.log(filter);
      const data = await this.doctorsService.getMedcard(filter)
      console.log(data);
      return data;
    }

     
  }