
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ClinicPublicService } from "./clinicPublic.service";
import { ClinicPublicController } from "./clinicPublic.controller";

@Module({
  imports: [ 
//     JwtModule.register({
//     global: true,
//     secret: "121212",
//     signOptions: { expiresIn: '60s' },
//   }),
  ],
  providers: [ClinicPublicService],
  controllers: [ClinicPublicController],
  exports: [],
})
export class ClinicPublicModule {} 