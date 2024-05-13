
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { DoctorsService } from "./doctors.service";
import { DoctorsController } from "./doctors.controller";

@Module({
  imports: [ 
//     JwtModule.register({
//     global: true,
//     secret: "121212",
//     signOptions: { expiresIn: '60s' },
//   }),
  ],
  providers: [DoctorsService],
  controllers: [DoctorsController],
  exports: [],
})
export class DoctorsModule {} 