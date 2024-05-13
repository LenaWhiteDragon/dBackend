import {
  Body,
  Controller,
  Post,
  HttpException,
  UseGuards,
  Get,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

interface AuthInterface {
  email: string;
  password: string;
}

interface RegInterface {
  email: string;
  password: string;
  fam: string;
  name: string;
  otch: string;
  birth: string;
  phone: string;
  address: string;
  SNILS: string;

}

@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post("/login")
  async login(@Body() authCred: AuthInterface) {
    const { email, password } = authCred;
    const data = await this.auth.loginUser(email, password)
    console.log(data);
    return data;
  }

  @Post("/register")
  async register(@Body() authCred: RegInterface) {
    const { email, password, fam, name, otch, birth, address, phone, SNILS} = authCred;
    const data = await this.auth.regUser(email, password, fam, name, otch, birth, phone, address, SNILS)
    console.log(data);
    return data;
  }
}