import { db } from '../models/index.js';

export async function checkPaymentAccount(req, res, next) {
  const userId = 2;

  try {
    const paymentUser = await db.oneOrNone('SELECT * FROM payment_users WHERE user_id = $1', [userId]);

    if (!paymentUser) {
      req.session.returnTo = req.originalUrl;
      res.redirect('/auth/create-payment-account');
    } else {
      next();
    }
  } catch (error) {
    console.error('Error checking payment account:', error);
  }
}
