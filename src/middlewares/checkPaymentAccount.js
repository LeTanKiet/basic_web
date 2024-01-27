import { db } from '../models/index.js';
import jwt from 'jsonwebtoken';

export async function checkPaymentAccount(req, res, next) {
  const { token } = req.body;
  console.log('token', token)

  const decoded = jwt.verify(token, process.env.PAYMENT_SECRET);
  const order = decoded.order;
  const paymentUser = await db.oneOrNone('SELECT * FROM payment_users WHERE user_id = $1', [order.userId]);
  
  try {
    if (!paymentUser) {
      req.session.userIdForPaymentAccountCreation = order.userId;
      req.session.returnTo = req.originalUrl;
      res.redirect('/auth/create-payment-account');
    } else {
      next();
    }
  } catch (error) {
    console.error('Error checking payment account:', error);
  }
}
