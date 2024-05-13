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
import { retry } from "rxjs";


export type ServiceAdd = {
  id_services: string;
}

//добавлять типы стоит в сервисы потому что сна сервисы все ссылается и модет эскпортироватсья 
    // 200 - все ок 
    // 400 - неправильные параметры не переданы или обьект которого не существуетт
    // 500 - ошибка сервера 
@Injectable()
export class WhmanService {
  constructor(private jwtService: JwtService) {}
//получение врача 

async getWhbossById(WhbossId) {
  try {
    const query = `
          SELECT Whbosses.id_whboss, Users.email 
          FROM Whbosses 
          INNER JOIN Users ON Whbosses.user_id = Users.user_id 
          WHERE Whbosess.id_whboss = $1
      `;

    const result = await pool.query(query, [WhbossId]);

    if (result.rows.length === 0) {
      throw new HttpException('User not found', 404);
      //throw new NotFoundException("Ошибка");
    }

const Whboss = result.rows[0];

    return Whboss
  } catch (error) {
    throw new UnauthorizedException("Ошибка");
  }
}


async getWhbossesByWh(id_wh) {

    const wh = await pool.query(
    "SELECT id_wh FROM Whs WHERE user_id = $1",
    [id_wh]
  );

  if (wh.rows.length === 0) {
    return "Склад к которой привязывается управляющий не найден.";
  }

  const whId = wh.rows[0].id_wh;

    const query = `
          SELECT Whbosses.id_whboss
          FROM Whbosses 
          WHERE Whbosses.id_wh = $1
      `;

    const result = await pool.query(query, [id_wh]);

    if (result.rows.length === 0) {
      throw new HttpException('not found', 404);
      //throw new NotFoundException("Ошибка");
    }

const Whboss = result.rows;

    return Whboss
 
}
//SELECT s.id_services, s.title FROM services s WHERE s.id_services NOT IN (SELECT ps.services_id FROM poliwhman_services ps WHERE ps.poliwhman_id = 2);

   //Боссы Эксель
   async addWhbossesFromExcel(req, res) {
    try {
      // const file = xlsx.readFile(req.file.path);
      // const sheet = file.Sheets[file.SheetNames[0]];
      // const data = xlsx.utils.sheet_to_json(sheet);

      // Создайте массив для хранения результатов операций добавления
      const results = [];
      const data = [];

      for (const Whboss of data) {
        const {email, password } =
          Whboss;

        // Проверьте, существует ли уже пользователь с таким email
        const userAlreadyExists = await pool.query(
          "SELECT * FROM users WHERE email= $1",
          [email]
        );

        if (userAlreadyExists.rows.length > 0) {
          results.push({ email, error: "Такой email уже зарегистрирован" });
          continue; // Пропускаем итерацию и переходим к следующему ,боссу
        }

        // Хэшируем пароль
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Создаём пользователя
        const newUser = await pool.query(
          "INSERT INTO users (email, password_hash, role_id) VALUES ($1, $2, $3) RETURNING *",
          [email, hashedPassword, 2] // Предположим, что role_id для босса равен 2
        );

        const newUserId = newUser.rows[0].user_id;

        // Добавляем информацию о докторе
        const WhbossAdd = await pool.query(
          "INSERT INTO Whbosses (user_id) VALUES ($1) RETURNING *",
          [newUserId]
        );

        results.push({
          email,
          message: "Управляющий успешно добавлен",
          Whboss: WhbossAdd.rows[0],
        });
      }

      // Отправляем собранные результаты
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //добавление боссов
  async addWhboss(email: string, password: string,  
    id_wh: string) {
 // async addWhboss(email, password, lastName, firstName, middleName, specialty, id_wh: string) {
    try {

      const whman = await pool.query(
        "SELECT id_wh FROM whmans WHERE user_id = $1",
        [id_wh]
      );

      if (whman.rows.length === 0) {
        return "Склад к которой привязывается управляющий не найден.";
      }

      const whmanId = whman.rows[0].id_wh;

// throw new HttpException('User not found', 404);
      const userAlreadExists = await pool.query(
        "SELECT * FROM users WHERE email= $1",
        [email]
      );

      if (userAlreadExists.rows.length > 0) {
        throw new HttpException('User already exists', 400);
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

     // console.log(req.user.user_id);
      const newUser = await pool.query(
        "INSERT INTO users (email, password_hash, role_id) VALUES ($1, $2, $3) RETURNING *",
        [email, hashedPassword, 2]
      );

      const newUserId = newUser.rows[0].user_id;

      const WhbossAdd = await pool.query(
        "INSERT INTO Whbosses (user_id, id_wh) VALUES ($1, $2)",
        [newUserId, whmanId]
      );

      // const WhbossAdd = await pool.query(
      //   "INSERT INTO Whbosss (user_id, name,  specialty, id_wh) VALUES ($1, $2, $3, $4)",
      //   [newUserId, fullName, specialty, whmanId]
      // );

      return { user: newUser.rows[0], WhbossAdd: WhbossAdd.rows[0] };
    } catch (error) {
      console.log(error)
      throw new HttpException('Server error', 500);
    }
  }

  //Удаление босса
  async deleteWhboss(WhbossId) {
    try {

      const Whboss = await pool.query(
        "SELECT user_id FROM Whbosses WHERE id_whboss = $1",
        [WhbossId]
      );

      if (Whboss.rows.length === 0) {
        return "Управляющий не найден.";
      }

      // Удаляем упра из таблицы Whbosss
      await pool.query("DELETE FROM Whbosses WHERE id_whboss = $1", [WhbossId]);

      // Удаляем пользователя из таблицы users
      const userId = Whboss.rows[0].user_id;
      await pool.query("DELETE FROM users WHERE user_id = $1", [userId]);

      return "Управляющий и связанный пользователь успешно удалены.";
    } catch (error) {
      throw new UnauthorizedException("Ошибка.");
    }
  }
  //редактирование упра
  async editWhboss(WhbossId, email, password) {
    try {
      // Находим пользователя, связанного с упром
      const user = await pool.query(
        "SELECT * FROM users WHERE user_id = (SELECT user_id FROM Whbosses WHERE id_whboss = $1)",
        [WhbossId]
      );

      // Если пользователь не найден, возвращаем ошибку
      if (user.rows.length === 0) {
        throw new HttpException('User not found', 404);
      }

      // // Обновляем email пользователя, если он изменился
      // console.log(user.rows.email);
      // if (email != "") {
      //   await pool.query("UPDATE users SET email = $1 WHERE user_id = $2", [
      //     email,
      //     user.rows[0].user_id,
      //   ]);
      // }

      // Обновляем пароль пользователя, если он предоставлен

      // if (password && password != "") {
      //   const salt = await bcrypt.genSalt(10);
      //   const hashedPassword = await bcrypt.hash(password, salt);
      //   await pool.query(
      //     "UPDATE users SET password_hash = $1 WHERE user_id = $2",
      //     [hashedPassword, user.rows[0].user_id]
      //   );
      // }
      // Возвращаем обновленные данные
      return { user: user.rows[0] };
    } catch (error) {
      throw new HttpException('Internal Server Error', 500);
    }

    
  }
  

















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