
import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [ 
    JwtModule.register({
    global: true,
    secret: "121212",
    signOptions: { expiresIn: '60s' },
  }),
  ], 
  providers: [AdminService],
  controllers: [AdminController], 
  exports: [AdminService],
})
export class AdminModule {} 