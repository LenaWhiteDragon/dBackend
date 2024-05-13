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
  export class ClinicPublicService {
    // constructor(private jwtService: JwtService) {}

  async getClinics(filter) {
    //return [{id: 1, name: "Mikhail"}, {id: 2, name: "nicolai"}, {id: 3, name: "ffff"}]
    const clinics = await pool.query("SELECT * FROM policlinics WHERE LOWER(title) LIKE LOWER('%" + filter + 
    "%') OR LOWER(address) LIKE LOWER('%" + filter + "%')")
    if (clinics.rows.length === 0)
      throw new NotFoundException("Поликлиники не найдены."); 
    //const token = jwtTokens(users.rows[0]);
    // return users.rows[0]; 
    // const token = jwtTokens(users.rows[0]);
    // console.log(token);
    const clinics_new = clinics.rows;
    return clinics_new
    //console.log(token);
   // return res.json({ token: `Bearer ${token}` });
}

async getClinicImage(filter) {
  //return [{id: 1, name: "Mikhail"}, {id: 2, name: "nicolai"}, {id: 3, name: "ffff"}]
  const clinics = await pool.query("SELECT photo FROM policlinics WHERE id_policlinics =" + filter)
  if (clinics.rows.length === 0)
    throw new NotFoundException("не найдено"); 
  //const token = jwtTokens(users.rows[0]);
  // return users.rows[0]; 
  // const token = jwtTokens(users.rows[0]);
  // console.log(token);
  const clinics_photo: ArrayBufferLike = clinics.rows[0].photo; 
  //console.log(doctor_photo)

  const file = new File([clinics_photo], "photo.jpg")
  return file

  //console.log(token);
 // return res.json({ token: `Bearer ${token}` });
}


async getClinicsByService(id, filter) {
  //return [{id: 1, name: "Mikhail"}, {id: 2, name: "nicolai"}, {id: 3, name: "ffff"}]
  const clinics = await pool.query("SELECT * FROM policlinics WHERE LOWER(title) LIKE LOWER('%" + filter + 
    "%') OR LOWER(address) LIKE LOWER('%" + filter + "%') AND id_policlinics in (select policlinic_id from policlinic_services where services_id =" + id + ")")

 // const clinics = await pool.query("Select * From policlinics Where id_policlinics in (select policlinic_id from policlinic_services where services_id =" + filter + ")")
  if (clinics.rows.length === 0)
    throw new NotFoundException("Поликлиники не найдены."); 
  //const token = jwtTokens(users.rows[0]);
  // return users.rows[0]; 
  // const token = jwtTokens(users.rows[0]);
  // console.log(token);
  const clinics_new = clinics.rows;
  return clinics_new
  //console.log(token);
 // return res.json({ token: `Bearer ${token}` });
}


async getClinicById(id_policlinics) {

  const clinic = await pool.query(
    "SELECT id_policlinics FROM policlinics WHERE user_id = $1",
    [id_policlinics]
  );

  if (clinic.rows.length === 0) {
    return "Поликлиника не найдена.";
  }

  const clinicId = clinic.rows[0].id_policlinics;

  try {
    const query = `
          SELECT policlinics.*, Users.email 
          FROM policlinics 
          INNER JOIN Users ON policlinics.user_id = Users.user_id 
          WHERE policlinics.id_policlinics = $1
      `;

    const result = await pool.query(query, [clinicId]);

    if (result.rows.length === 0) {
      throw new HttpException('User not found', 404);
      //throw new NotFoundException("Ошибка");
    }

const clinic = result.rows[0];

    return clinic
  } catch (error) {
    throw new UnauthorizedException("Ошибка");
  }
}



async getClinicByIdLanding(id_policlinics) {

  const clinicId = id_policlinics;

  try {
    const query = `
          SELECT policlinics.*, Users.email 
          FROM policlinics 
          INNER JOIN Users ON policlinics.user_id = Users.user_id 
          WHERE policlinics.id_policlinics = $1
      `;

    const result = await pool.query(query, [clinicId]);

    if (result.rows.length === 0) {
      throw new HttpException('User not found', 404);
      //throw new NotFoundException("Ошибка");
    }

const clinic = result.rows[0];

    return clinic
  } catch (error) {
    console.log(error)
    throw new UnauthorizedException("Ошибка");
  }
}


async getBlogs(clinicId) {
  try {
  //  const roleId = req.user.role_id;
    console.log(clinicId);

    const blogs = await pool.query(
      "SELECT header, text FROM blogs WHERE id_policlinic = $1",
      [clinicId]
    );

    if (blogs.rows.length === 0) {
      return "не найдено." ;
    }

    return  blogs.rows ;
  } catch (error) {
    throw new UnauthorizedException("Ошибка.");
  }
}
  
    
  }