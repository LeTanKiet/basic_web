import bcrypt from 'bcrypt';
import { db } from '../models/index.js';
import { ROLE, SALT_ROUNDS } from '../utils/constants.js';
import { clearCookies, createToken, setCookies } from '../utils/common.js';
import SendPinEmail from '../models/sendPinEmail.js';

class AuthController {
  async signUpPage(req, res) {
    return res.render('signup', {
      layout: 'no-header-footer-layout',
      title: 'Sign up',
    });
  }

  async signUp(req, res) {
    try {
      const { name, email, password, confirmPassword, role } = req.body;

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

      const pin = await SendPinEmail.sendPinEmailByEmail(email);

      req.session.user = req.body;
      req.session.pin = pin;

      return res.redirect('/auth/confirm');
    } catch (error) {
      console.error('error: ', error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async confirmEmailPage(req, res) {
    return res.render('confirm_email', {
      layout: 'no-header-footer-layout',
    });
  }

  async confirmEmail(req, res) {
    try {
      const { user, pin: sessionPin } = req.session;
      const { pin } = req.body;

      if (Number(pin) !== Number(sessionPin)) {
        return res.render('confirm_email', {
          layout: 'no-header-footer-layout',
          pin,
          error: 'Pin is incorrect!',
        });
      }

      const { name, email, password, role } = user;

      const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
      const newUser = await db.oneOrNone(
        'INSERT INTO "users" (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, hashedPassword, role],
      );

      const tokens = createToken(newUser);
      setCookies(res, tokens);

      if (newUser.role === ROLE.admin) {
        return res.redirect('/admin');
      }
      return res.redirect('/');
    } catch (error) {
      console.error('error: ', error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async loginPage(req, res) {
    return res.render('login', {
      layout: 'no-header-footer-layout',
      title: 'Login',
    });
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

      if (existedUser.role === ROLE.admin) {
        return res.redirect('/admin');
      }

      return res.redirect('/');
    } catch (error) {
      console.error('error: ', error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async loginWithGoogle(req, res) {
    try {
      const { profile } = req;
      const name = profile.displayName;
      const email = profile.emails[0].value;
      const role = ROLE.user;

      const existedUser = await db.oneOrNone('select * from "users" where email = $1', email);

      if (existedUser) {
        const tokens = createToken(existedUser);
        setCookies(res, tokens);
        return res.redirect('/');
      }

      const newUser = await db.oneOrNone(
        'INSERT INTO "users" (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, '', role],
      );

      const tokens = createToken(newUser);
      setCookies(res, tokens);

      return res.redirect('/');
    } catch (error) {
      console.error('error: ', error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async loginWithFacebook(req, res) {
    res.redirect('/');
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
