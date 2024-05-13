
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PatientController } from "./patient.controller";
import { PatientService } from "./patient.service";

@Module({
  imports: [ 
//     JwtModule.register({
//     global: true,
//     secret: "121212",
//     signOptions: { expiresIn: '60s' },
//   }),
  ],
  providers: [PatientService],
  controllers: [PatientController],
  exports: [],
})
export class PatientModule {} 