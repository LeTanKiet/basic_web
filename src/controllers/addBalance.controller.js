import { db } from '../models/index.js';
import SendPinEmail from '../models/sendPinEmail.js';
import jwt from 'jsonwebtoken';

class AddBalanceController {
  constructor() {
    this.processAddBalanceCheck = this.processAddBalanceCheck.bind(this);
  }

  async addBalancePage(req, res) {
    const paymentId = req.params.id;

    try {
      const payment_user = await db.oneOrNone('SELECT balance FROM "payment_users" WHERE id = $1', [paymentId]);

      if (!payment_user) {
        return res.render('add', { error: 'User not found.' });
      }

      console.log(req.session.transactionId);

      return res.render('add', {
        userBalance: payment_user.balance,
        transactionId: req.session.transactionId ? req.session.transactionId : null,
        paymentId: paymentId,
      });
    } catch (error) {
      return res.render('add', { error: 'Error fetching user balance.' });
    }
  }

  async SendPin(req, res) {
    const paymentId = req.params.id;
    const { amount } = req.body;

    const { user_id } = await db.oneOrNone('SELECT user_id FROM "payment_users" WHERE id = $1', [paymentId]);
    req.session.amount = amount;

    try {
      await SendPinEmail.sendPinEmail(user_id);
      res.redirect(`/add/${paymentId}/check`);
    } catch (error) {
      return res.render('add', { error: 'An error occurred while sending the PIN.' });
    }
  }

  async addBalanceToUser(paymentId, user_id, amount) {
    try {
      const payment_user = await db.oneOrNone('SELECT balance FROM "payment_users" WHERE id = $1', [paymentId]);
      if (!payment_user) {
        throw new Error('User not found');
      }

      const newBalance = parseFloat(payment_user.balance) + parseFloat(amount);

      await db.none('UPDATE "payment_users" SET balance = $1 WHERE id = $2', [newBalance, paymentId]);

      await db.none('INSERT INTO "transactions" (payment_id, amount, type) VALUES ($1, $2, $3)', [
        paymentId,
        amount,
        'ADD',
      ]);

      await db.none('DELETE FROM "pins" WHERE user_id = $1', [user_id]);
    } catch (error) {
      throw error;
    }
  }

  async addBalanceCheckPage(req, res) {
    const paymentId = req.params.id;

    try {
      res.render('addBalanceCheck', { paymentId });
    } catch (error) {
      res.render('error', { error: 'An error occurred.' });
    }
  }

  async processAddBalanceCheck(req, res) {
    const paymentId = req.params.id;
    const { pin } = req.body;

    try {
      const { user_id } = await db.oneOrNone('SELECT user_id FROM "payment_users" WHERE id = $1', [paymentId]);

      if (!user_id) {
        return res.render('addBalanceCheck', { error: 'User not found.' });
      }

      const pinRecord = await db.oneOrNone('SELECT pin FROM pins WHERE user_id = $1', [user_id]);

      if (!pinRecord || pinRecord.pin !== pin) {
        console.error('No PIN record found for user:', user_id);
        return res.render('addBalanceCheck', { error: 'Invalid PIN.', user_id });
      }

      const amount = req.session.amount;

      if (!amount) {
        return res.render('addBalanceCheck', { error: 'Session expired or invalid.', user_id });
      }

      await this.addBalanceToUser(paymentId, user_id, amount);
      return res.redirect(`/add/${paymentId}`);
    } catch (error) {
      return res.render('addBalanceCheck', { error: 'An error occurred while verifying the PIN.', paymentId });
    }
  }

  async addBalanceSuccess(req, res) {
    return res.render('addBalanceSuccess');
  }
}

export default new AddBalanceController();
