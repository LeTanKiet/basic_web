import { db } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

class AuthPaymentController {
  createPaymentPage(req, res) {
    res.render('createPaymentAccount');
  }

  async createPaymentAccount(req, res) {
    const userId = 2;
    const paymentId = uuidv4();

    await db.none('INSERT INTO payment_users (payment_id, payment_method, balance, user_id) VALUES ($1, $2, $3, $4)', [
      paymentId,
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
