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
  export class DoctorsService {
    // constructor(private jwtService: JwtService) {}
  
    async getSchedule(req, res) {
      try {
        // Предполагается, что doctorId получен после аутентификации и хранится в req.user
        const userId = req.user.user_id;
        const doctorIdQueryResult = await pool.query(
          "SELECT doctor_id FROM doctors WHERE user_id =$1",
          [userId]
        );
  
        const doctorId = doctorIdQueryResult.rows[0].doctor_id;
  
        const query = `
              SELECT 
                s.schedule_id, 
                s.start_time, 
                s.end_time, 
                a.problem_description,
                p.patient_id,
                p.name AS patient_name,
                p.phone AS patient_phone
              FROM Schedule s 
              LEFT JOIN Appointments a ON s.schedule_id = a.schedule_id
              LEFT JOIN Patients p ON a.patient_id = p.patient_id
              WHERE s.doctor_id = $1 AND s.is_booked = TRUE
              ORDER BY s.start_time;
            `;
  
        const result = await pool.query(query, [doctorId]);
        if (result.rows.length === 0) {
          return res.status(404).json({
            message: "Расписание не найдено или нет запланированных приемов.",
          });
        }
  
        res.json(result.rows);
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ error: "Ошибка сервера при получении расписания." });
      }
    }
  
  async getMedcard(patientId) {
    try {
      const query = `
      SELECT 
      m.medcard_id,
      m.patient_id,
      p.name AS patient_name,
      m.history,
      m.blood_type,
      m.allergies,
      m.chronic_diseases,
      m.current_medications,
      m.surgical_history,
      m.family_history,
      m.lifestyle,
      m.diagnoses,
      m.vaccinations,
      m.contact_info,
      m.created_at,
      m.updated_at
    FROM Medcards m
    JOIN Patients p ON m.patient_id = p.patient_id
    WHERE m.patient_id = $1;
      `;

      const result = await pool.query(query, [patientId]);
      if (result.rows.length === 0) {
        return "Медицинская карта не найдена.";
      }
      return result.rows[0]; 
    } catch (error) {
      console.error(error);
    }
  }
  
     async getDoctors(filter) {
        //return [{id: 1, name: "Mikhail"}, {id: 2, name: "nicolai"}, {id: 3, name: "ffff"}]
        const doctors = await pool.query("SELECT * FROM doctors WHERE LOWER(name) LIKE LOWER('%" + filter + 
        "%') OR LOWER(specialty) LIKE LOWER('%" + filter + "%')")
        if (doctors.rows.length === 0)
          throw new NotFoundException("Врачи не найдены"); 
        //const token = jwtTokens(users.rows[0]);
        // return users.rows[0]; 
        // const token = jwtTokens(users.rows[0]);
        // console.log(token);
        const doctors_new = doctors.rows;
        return doctors_new
        //console.log(token);
       // return res.json({ token: `Bearer ${token}` });
    }

    async getDoctorImage(filter) {
      //return [{id: 1, name: "Mikhail"}, {id: 2, name: "nicolai"}, {id: 3, name: "ffff"}]
      const doctors = await pool.query("SELECT photo FROM doctors WHERE doctor_id =" + filter)
      if (doctors.rows.length === 0)
        throw new NotFoundException("не найдено"); 
      //const token = jwtTokens(users.rows[0]);
      // return users.rows[0]; 
      // const token = jwtTokens(users.rows[0]);
      // console.log(token);
      const doctor_photo: ArrayBufferLike = doctors.rows[0].photo; 
      //console.log(doctor_photo)

      const file = new File([doctor_photo], "photo.jpg")
      return file

      //console.log(token);
     // return res.json({ token: `Bearer ${token}` });
  }

  

async getDoctorByClinic(id, filter) {
  //return [{id: 1, name: "Mikhail"}, {id: 2, name: "nicolai"}, {id: 3, name: "ffff"}]
  const doctor = await pool.query("SELECT * FROM doctors WHERE LOWER(name) LIKE LOWER('%" + filter + 
    "%') AND id_policlinic = " + id + " OR LOWER(specialty) LIKE LOWER('%" + filter + "%') AND id_policlinic = " + id)

 // const clinics = await pool.query("Select * From policlinics Where id_policlinics in (select policlinic_id from policlinic_services where services_id =" + filter + ")")
  if (doctor.rows.length === 0)
    throw new NotFoundException("Врачи не найдены."); 
  //const token = jwtTokens(users.rows[0]);
  // return users.rows[0]; 
  // const token = jwtTokens(users.rows[0]);
  // console.log(token);
  const doctor_new = doctor.rows;
  return doctor_new
  //console.log(token);
 // return res.json({ token: `Bearer ${token}` });
}



async getShedules(is_booked: boolean, id: string) {
  //return [{id: 1, name: "Mikhail"}, {id: 2, name: "nicolai"}, {id: 3, name: "ffff"}]
  const schedule = await pool.query("SELECT schedule_id, TO_CHAR(date, 'DD.MM.YYYY') as date, TO_CHAR(start_time, 'HH24:MI') as start_time, TO_CHAR(end_time, 'HH24:MI') as end_time FROM schedule WHERE is_booked =" + is_booked + " and doctor_id =" + id + " ORDER BY date")
 // const clinics = await pool.query("Select * From policlinics Where id_policlinics in (select policlinic_id from policlinic_services where services_id =" + filter + ")")
  if (schedule.rows.length === 0)
    throw new NotFoundException("Расписание не найдено."); 
  //const token = jwtTokens(users.rows[0]);
  // return users.rows[0]; 
  // const token = jwtTokens(users.rows[0]);
  // console.log(token);
  const schedule_new = schedule.rows;
  return schedule_new
  //console.log(token);
 // return res.json({ token: `Bearer ${token}` });
}



async getShedulesByUser(is_booked: boolean, userid: string) {

  const doctor = await pool.query(
    "SELECT doctor_id FROM doctors WHERE user_id = $1",
    [userid]
  );

  if (doctor.rows.length === 0) {
    return "Поликлиника к которой привязывается врач не найдена.";
  }

  const doctorId = doctor.rows[0].doctor_id;
  //return [{id: 1, name: "Mikhail"}, {id: 2, name: "nicolai"}, {id: 3, name: "ffff"}]
  //console.log("doctorId" + doctorId)
  const schedule = await pool.query(`SELECT s.schedule_id, TO_CHAR(s.date, 'DD.MM.YYYY') as date, TO_CHAR(s.start_time, 'HH24:MI') 
  as start_time, TO_CHAR(s.end_time, 'HH24:MI') as end_time, a.problem_description, p.patient_id, p.name AS patient_name, p.phone AS patient_phone
FROM Schedule s
LEFT JOIN Appointments a ON s.schedule_id = a.schedule_id
LEFT JOIN Patients p ON a.patient_id = p.patient_id
WHERE is_booked = true and doctor_id = ${doctorId} 
ORDER BY date`)
 // const clinics = await pool.query("Select * From policlinics Where id_policlinics in (select policlinic_id from policlinic_services where services_id =" + filter + ")")
  if (schedule.rows.length === 0)
    throw new NotFoundException("Расписание не найдено."); 
  //const token = jwtTokens(users.rows[0]);
  // return users.rows[0]; 
  // const token = jwtTokens(users.rows[0]);
  // console.log(token);
  const schedule_new = schedule.rows;
  return schedule_new
  //console.log(token);
 // return res.json({ token: `Bearer ${token}` });
}
  
async getDoctorById(doctorId) {
  try {
    const query = `
          SELECT Doctors.doctor_id, Doctors.name, Doctors.specialty, Users.email 
          FROM Doctors 
          INNER JOIN Users ON Doctors.user_id = Users.user_id 
          WHERE Doctors.doctor_id = $1
      `;

    const result = await pool.query(query, [doctorId]);

    if (result.rows.length === 0) {
      throw new HttpException('User not found', 404);
      //throw new NotFoundException("Ошибка");
    }

const doctor = result.rows;

    return doctor
  } catch (error) {
    throw new UnauthorizedException("Ошибка");
  }
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