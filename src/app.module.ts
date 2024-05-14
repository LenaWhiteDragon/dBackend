import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DoctorsModule } from './doctors/doctors.module';
import { ProductModule } from './product/product.module';
import { AdminModule } from './admin/admin.module';
import { WhmanModule } from './whman/whman.module';
import { ClinicPublicModule } from './clinic-public/clinicPublic.module';
import { PatientModule } from './patient/patient.module';
import { WhModule } from './wh/wh.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    AdminModule,
    PatientModule,
    ClinicPublicModule,
    WhmanModule,
    AuthModule,
    DoctorsModule,
    ProductModule,
    WhModule,
    CategoryModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
