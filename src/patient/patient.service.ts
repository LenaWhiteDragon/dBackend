import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import pool from "src/db";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class PatientService {
  // constructor(private jwtService: JwtService) {}

  async createAppointmentService(patient_id, policlinic_id, service_id, id_time) {
    try {

      //найти пациент айди из юзер айди проверить существование
      const patient = await pool.query(
        "SELECT patient_id FROM patients WHERE user_id = $1",
        [patient_id]
      );

      if (patient.rows.length === 0) {
        return "пользователь не найден.";
      }

      const patientId = patient.rows[0].patient_id;

      //найти полсервис по сервис и клиник айди 
      const polservice = await pool.query(
        "SELECT id_polservices FROM policlinic_services WHERE policlinic_id = $1 and services_id = $2",
        [policlinic_id, service_id]
      );

      if (polservice.rows.length === 0) {
        return "Услуги не существует";
      }

      const polserviceId = polservice.rows[0].id_polservices;

      //добавить запись в таблицу 
      const appointmentAdd = await pool.query(
        "INSERT INTO appointments_services (patient_id, polservice_id, status, id_time) VALUES ($1, $2, $3, $4)",
        [patientId, polserviceId, true, id_time]
      );

      return { appointmentAdd: appointmentAdd.rows[0] };
    }
    catch (error) {
      console.log(error)
      throw new HttpException('Server error', 500);
    }

  }

  async createAppointmentDoctor(patient_id, schedule_id, problem_description) {
    try {

      //найти пациент айди из юзер айди проверить существование
      const patient = await pool.query(
        "SELECT patient_id FROM patients WHERE user_id = $1",
        [patient_id]
      );

      if (patient.rows.length === 0) {
        return "Пользователь не найден.";
      }

      const patientId = patient.rows[0].patient_id;

      // Создание записи на прием
      const result = await pool.query(
        "INSERT INTO appointments (patient_id, schedule_id, problem_description, status) VALUES ($1, $2, $3, $4) RETURNING *",
        [patientId, schedule_id, problem_description, false]
      );

      await pool.query(
        "UPDATE schedule SET is_booked = true WHERE schedule_id = $1",
        [schedule_id]
      );

      return { appointmentAdd: result.rows[0] };
    }
    catch (error) {
      console.log(error)
      throw new HttpException('Server error', 500);
    }

  }

  async getService(filter) {
    // return [{id: 1, name: "УЗИ"}, {id: 2, name: "нейропластика"}, {id: 3, name: "анализы крови"}]
    const services = await pool.query("SELECT * FROM services WHERE LOWER(title) LIKE LOWER('%" + filter +
      "%')")
    if (services.rows.length === 0)
      throw new NotFoundException("Врачи не найдены");
    //const token = jwtTokens(users.rows[0]);
    // return users.rows[0]; 
    // const token = jwtTokens(users.rows[0]);
    // console.log(token);
    const services_new = services.rows;
    return services_new
    //console.log(token);
    // return res.json({ token: `Bearer ${token}` });
  }


  async getServiceById(filter) {
    // return [{id: 1, name: "УЗИ"}, {id: 2, name: "нейропластика"}, {id: 3, name: "анализы крови"}]
    const services = await pool.query("SELECT * FROM services WHERE id_services= " + filter)
    if (services.rows.length === 0)
      throw new NotFoundException("Услуга не найдена");
    //const token = jwtTokens(users.rows[0]);
    // return users.rows[0]; 
    // const token = jwtTokens(users.rows[0]);
    // console.log(token);
    const services_new = services.rows[0];
    return services_new
    //console.log(token);
    // return res.json({ token: `Bearer ${token}` });
  }

  /*
    async createUser(email: string, password: string): Promise<Partial<users>> {
      const hashedPassword = bcrypt.hashSync(password, 12);
      return await this.userService.users.create({
        data: {
          uid: uuid4(),
          email: email,
          password: hashedPassword,
        },
        select: {
          uid: true,
          email: true,
          nickname: true,
        },
      });
    }
    */
}