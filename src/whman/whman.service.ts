import {
  Injectable,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import pool from 'src/db';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

export type ServiceAdd = {
  id_services: string;
};

@Injectable()
export class WhmanService {
  constructor(private jwtService: JwtService) {}

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
      }

      const Whboss = result.rows[0];

      return Whboss;
    } catch (error) {
      throw new UnauthorizedException('Ошибка');
    }
  }

  async getWhbossesByWh(id_wh) {
    const wh = await pool.query('SELECT id_wh FROM Whs WHERE user_id = $1', [
      id_wh,
    ]);

    if (wh.rows.length === 0) {
      return 'Склад к которой привязывается управляющий не найден.';
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
    }

    const Whboss = result.rows;

    return Whboss;
  }

  //Боссы Эксель
  async addWhbossesFromExcel(req, res) {
    try {
      const results = [];
      const data = [];

      for (const Whboss of data) {
        const { email, password } = Whboss;

        const userAlreadyExists = await pool.query(
          'SELECT * FROM users WHERE email= $1',
          [email],
        );

        if (userAlreadyExists.rows.length > 0) {
          results.push({ email, error: 'Такой email уже зарегистрирован' });
          continue;
        }

        // Хэшируем пароль
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Создаём пользователя
        const newUser = await pool.query(
          'INSERT INTO users (email, password_hash, role_id) VALUES ($1, $2, $3) RETURNING *',
          [email, hashedPassword, 2], // Предположим, что role_id для босса равен 2
        );

        const newUserId = newUser.rows[0].user_id;

        // Добавляем информацию о докторе
        const WhbossAdd = await pool.query(
          'INSERT INTO Whbosses (user_id) VALUES ($1) RETURNING *',
          [newUserId],
        );

        results.push({
          email,
          message: 'Управляющий успешно добавлен',
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
  async addWhboss(email: string, password: string, id_wh: string) {
    try {
      const whman = await pool.query(
        'SELECT id_wh FROM whmans WHERE user_id = $1',
        [id_wh],
      );

      if (whman.rows.length === 0) {
        return 'Склад к которой привязывается управляющий не найден.';
      }

      const whmanId = whman.rows[0].id_wh;

      const userAlreadExists = await pool.query(
        'SELECT * FROM users WHERE email= $1',
        [email],
      );

      if (userAlreadExists.rows.length > 0) {
        throw new HttpException('User already exists', 400);
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await pool.query(
        'INSERT INTO users (email, password_hash, role_id) VALUES ($1, $2, $3) RETURNING *',
        [email, hashedPassword, 2],
      );

      const newUserId = newUser.rows[0].user_id;

      const WhbossAdd = await pool.query(
        'INSERT INTO Whbosses (user_id, id_wh) VALUES ($1, $2)',
        [newUserId, whmanId],
      );

      return { user: newUser.rows[0], WhbossAdd: WhbossAdd.rows[0] };
    } catch (error) {
      console.log(error);
      throw new HttpException('Server error', 500);
    }
  }

  async deleteWhboss(WhbossId) {
    try {
      const Whboss = await pool.query(
        'SELECT user_id FROM Whbosses WHERE id_whboss = $1',
        [WhbossId],
      );

      if (Whboss.rows.length === 0) {
        return 'Управляющий не найден.';
      }

      // Удаляем упра из таблицы Whbosss
      await pool.query('DELETE FROM Whbosses WHERE id_whboss = $1', [WhbossId]);

      // Удаляем пользователя из таблицы users
      const userId = Whboss.rows[0].user_id;
      await pool.query('DELETE FROM users WHERE user_id = $1', [userId]);

      return 'Управляющий и связанный пользователь успешно удалены.';
    } catch (error) {
      throw new UnauthorizedException('Ошибка.');
    }
  }

  async editWhboss(WhbossId, email, password) {
    try {
      // Находим пользователя, связанного с упром
      const user = await pool.query(
        'SELECT * FROM users WHERE user_id = (SELECT user_id FROM Whbosses WHERE id_whboss = $1)',
        [WhbossId],
      );

      // Если пользователь не найден, возвращаем ошибку
      if (user.rows.length === 0) {
        throw new HttpException('User not found', 404);
      }

      // Возвращаем обновленные данные
      return { user: user.rows[0] };
    } catch (error) {
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
