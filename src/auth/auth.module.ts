
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [ 
    JwtModule.register({
    global: true,
    secret: "121212",
    signOptions: { expiresIn: '60s' },
  }),
  ], 
  providers: [AuthService],
  controllers: [AuthController], 
  exports: [AuthService],
})
export class AuthModule {} 