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
export class AuthService {
  constructor(private jwtService: JwtService) {}


  async loginUser(email: string, password: string) {
    console.log(email, password);
      const users = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      if (users.rows.length === 0)
      throw new UnauthorizedException("Неверные данные");

      const validPassword = await bcrypt.compare(
        password,
        users.rows[0].password_hash
      );
      if (!validPassword)
      throw new UnauthorizedException("Неверные данные");
      const user =  users.rows[0]

      const payload = { sub: user.user_id, email: user.email };
      const access_token = await this.jwtService.signAsync(payload)
      //const token = jwtTokens(users.rows[0]);
      // return users.rows[0]; 
      // const token = jwtTokens(users.rows[0]);
      // console.log(token);
      return { token: access_token, user }
      //console.log(token);
     // return res.json({ token: `Bearer ${token}` });
  }


  async regUser(email: string, password: string, fam: string,
    name: string,otch: string, birth: string = "", phone: string = "",address: string = "", SNILS: string = "") {

    console.log(email, password);
    const fullName = `${fam} ${name} ${otch}`;

    const userAlreadExists = await pool.query(
      "SELECT * FROM users WHERE email= $1",
      [email]
    );

    if (userAlreadExists.rows.length > 0) {
      throw new UnauthorizedException("Пользователь уже существует");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (email, password_hash, role_id) VALUES ($1, $2, $3) RETURNING *",
      [email, hashedPassword, 1]
    );

    const newUserId = newUser.rows[0].user_id;
    const newPatient = await pool.query(
      "INSERT INTO Patients (user_id, name, birthday, phone, address, snils) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [newUserId, fullName, birth, phone, address, SNILS]
    );

      const user =  newPatient.rows[0]

      const payload = { sub: user.user_id, email: user.email };
      const access_token = await this.jwtService.signAsync(payload)
      //const token = jwtTokens(users.rows[0]);
      // return users.rows[0]; 
      // const token = jwtTokens(users.rows[0]);
      // console.log(token);
      return { token: access_token, user }
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