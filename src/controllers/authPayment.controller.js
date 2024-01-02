import { db } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

class AuthPaymentController {
  createPaymentPage(req, res) {
    res.render('createPaymentAccount');
  }

  async createPaymentAccount(req, res) {
    const userId = 2;
    const id = uuidv4();

    await db.none('INSERT INTO payment_users (id, payment_method, balance, user_id) VALUES ($1, $2, $3, $4)', [
      id,
      'defaultMethod',
      0,
      userId,
    ]);
    const redirectTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectTo);
  }
}

export default new AuthPaymentController();
