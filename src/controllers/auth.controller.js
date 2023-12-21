import bcrypt from 'bcrypt';
import { db } from '../models/index.js';
import { ROLE, SALT_ROUNDS } from '../utils/constants.js';
import { clearCookies, createToken, setCookies } from '../utils/common.js';

class AuthController {
  async signUpPage(req, res) {
    return res.render('signup');
  }

  async signUp(req, res) {
    try {
      const { name, email, password, confirmPassword, role = ROLE.user } = req.body;

      if (confirmPassword !== password) {
        return res.render('signup', {
          error: 'Confirm password not match',
          name,
          email,
          password,
          confirmPassword,
          role,
        });
      }

      const existedUser = await db.oneOrNone('select * from "users" where email = $1', email);
      if (existedUser) {
        return res.render('signup', {
          error: 'User existed',
          name,
          email,
          password,
          confirmPassword,
          role,
        });
      }

      const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
      const newUser = await db.oneOrNone(
        'INSERT INTO "users" (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, hashedPassword, role],
      );

      const tokens = createToken(newUser);
      setCookies(res, tokens);

      return res.redirect('/');
    } catch (error) {
      console.error('error: ', error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async loginPage(req, res) {
    return res.render('login');
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const existedUser = await db.oneOrNone('select * from "users" where email = $1', email);

      if (!existedUser) {
        return res.render('login', {
          error: 'User not found',
          email,
          password,
        });
      }

      if (!bcrypt.compareSync(password, existedUser.password)) {
        return res.render('login', {
          error: 'Password is incorrect!',
          email,
          password,
        });
      }

      const tokens = createToken(existedUser);
      setCookies(res, tokens);

      return res.redirect('/');
    } catch (error) {
      console.error('error: ', error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async logout(req, res) {
    clearCookies(res);
    return res.redirect('/');
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
