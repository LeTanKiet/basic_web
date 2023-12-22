import bcrypt from 'bcrypt';
import { db } from '../models/index.js';
import { SALT_ROUNDS } from '../utils/constants.js';
import { clearCookies, createToken, setCookies } from '../utils/common.js';

class AuthController {
  async signUp(req, res) {
    try {
      const { username, password, role } = req.body;

      const existedUser = await db.oneOrNone('select * from "users" where username = $1', username);
      if (existedUser) {
        return res.status(400).send({ message: 'User existed' });
      }

      const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
      const newUser = await db.oneOrNone(
        'INSERT INTO "users" (username, password, role) VALUES ($1, $2, $3) RETURNING *',
        [username, hashedPassword, role],
      );

      const tokens = createToken(newUser);
      setCookies(res, tokens);

      return res.status(201).json(newUser);
    } catch (error) {
      console.error('error: ', error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;

      const existedUser = await db.oneOrNone('select * from "users" where username = $1', username);

      if (!existedUser) {
        return res.status(401).send({ message: 'User not found' });
      }

      if (!bcrypt.compareSync(password, existedUser.password)) {
        return res.status(401).send({ message: 'Password is incorrect!' });
      }

      const tokens = createToken(existedUser);
      setCookies(res, tokens);

      return res.status(200).json(existedUser);
    } catch (error) {
      console.error('error: ', error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async logout(req, res) {
    clearCookies(res);
    return res.status(200).send({ message: 'Success' });
  }

  async getMe(req, res) {
    try {
      const { userId } = req.context;
      const user = await db.oneOrNone('select * from "users" where id = $1', userId);
      return res.status(200).json(user);
    } catch (error) {
      console.error('error: ', error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async refresh(req, res) {
    try {
      const { userId } = req.context;

      const user = await db.oneOrNone('select * from "users" where id = $1', userId);
      const tokens = createToken(user);

      return res.status(200).json(tokens);
    } catch (error) {
      console.error('error: ', error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }
}

export default new AuthController();
