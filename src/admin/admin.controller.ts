import {
  Body,
  Controller,
  Post,
  HttpException,
  UseGuards,
  Get,
  Query,
  Delete,
} from "@nestjs/common";
import { AdminService } from "./admin.service";

interface AuthInterface {
  email: string;
  password: string;
}

interface Clinic {
  email: string;
  password: string;
  name: string;
  address: string;
  phone: string;
} 

interface ClinicId {
  clinicId: string
} 



@Controller("admin")
export class AdminController {
  constructor(private auth: AdminService) {}

@Delete("/deleteClinic")
  async deleteClinic(@Body() authCred: ClinicId) {
    const { clinicId } = authCred;
    const data = await this.auth.deleteClinic(clinicId);
    console.log(data);
    return data;
  }


  @Post("/addAdmin")
  async addDoctor(@Body() authCred: AuthInterface) {
    const {email, password} = authCred;
    const data = await this.auth.addAdmin(email, password);
    console.log(data);
    return data;
  }

  @Post("/addClinic")
  async addClinic(@Body() authCred: Clinic) {
    const {email, password, name, address, phone} = authCred;
    const data = await this.auth.addClinic( email, password, name, address, phone);
    console.log(data);
    return data;
  }
}