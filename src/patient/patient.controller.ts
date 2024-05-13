import {
    Body,
    Controller,
    Post,
    HttpException,
    UseGuards,
    Get,
    Query,
  } from "@nestjs/common";

import { PatientService } from "./patient.service";
  
interface FilterInterface {
    filter: string
   }

   interface ServiceAppointment {
    patient_id: string; 
    policlinic_id: string; 
    service_id: string; 
    id_time: string
   }

   interface DoctorAppointment {
    patient_id: string; 
    schedule_id: string; 
    problem_description: string
   }
  //параметры запроса
  
  @Controller("patient")
  export class PatientController {
    constructor(private patientService: PatientService) {}

    @Post("/createAppointmentService")
  async createAppointmentService(@Body() authCred: ServiceAppointment) {
    const {id_time, patient_id, policlinic_id, service_id} = authCred;
    const data = await this.patientService.createAppointmentService(patient_id, policlinic_id, service_id, id_time);
    console.log(data);
    return data;
  }

  @Post("/createAppointmentDoctor")
  async createAppointmentDoctor(@Body() authCred: DoctorAppointment) {
    const {patient_id, schedule_id, problem_description} = authCred;
    const data = await this.patientService.createAppointmentDoctor(patient_id, schedule_id, problem_description);
    console.log(data);
    return data;
  }
    // @Get("/")
    // async getService (@Query('filter') query)  {
    //   const filter = query;
    //   console.log(filter);
    //   const data = await this.serviceService.getService(filter)
    //   console.log(data);
    //   return data;
    // }

    // @Get("/getServiceById")
    // async getServiceById (@Query('id') query)  {
    //   const filter = query;
    //   console.log(filter);
    //   const data = await this.serviceService.getServiceById(filter)
    //   console.log(data);
    //   return data;
    // }
  }