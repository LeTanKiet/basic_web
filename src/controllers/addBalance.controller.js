import { db } from '../models/index.js';
import SendPinEmail from '../models/sendPinEmail.js';

class AddBalanceController {
  constructor() {
    this.processAddBalanceCheck = this.processAddBalanceCheck.bind(this);
  }

  async addBalancePage(req, res) {
    const userId = req.params.id;

    try {
      const user = await db.oneOrNone('SELECT id, balance FROM "users" WHERE id = $1', [userId]);

      if (!user) {
        return res.render('add', { error: 'User not found.' });
      }

      const orderId = await db.oneOrNone('SELECT MAX(id) AS highest_order_id FROM "orders" WHERE user_id = $1', [
        userId,
      ]);

      return res.render('add', { userBalance: user.balance, userId, orderId: orderId.highest_order_id });
    } catch (error) {
      return res.render('add', { error: 'Error fetching user balance.' });
    }
  }

  async SendPin(req, res) {
    const userId = req.params.id;
    const { amount } = req.body;

    req.session.amount = amount;

    try {
      await SendPinEmail.sendPinEmail(userId);
      res.redirect(`/add/${userId}/check`);
    } catch (error) {
      return res.render('add', { error: 'An error occurred while sending the PIN.' });
    }
  }

  async addBalanceToUser(userId, amount) {
    try {
      const user = await db.oneOrNone('SELECT balance FROM "users" WHERE id = $1', [userId]);
      if (!user) {
        throw new Error('User not found');
      }

      const newBalance = parseFloat(user.balance) + parseFloat(amount);

      await db.none('UPDATE "users" SET balance = $1 WHERE id = $2', [newBalance, userId]);

      await db.none('DELETE FROM "pins" WHERE user_id = $1', [userId]);
    } catch (error) {
      throw error;
    }
  }

  async addBalanceCheckPage(req, res) {
    const userId = req.params.id;

    try {
      res.render('addBalanceCheck', { userId });
    } catch (error) {
      res.render('error', { error: 'An error occurred.' });
    }
  }

  async processAddBalanceCheck(req, res) {
    const userId = req.params.id;
    const { pin } = req.body;

    try {
      const pinRecord = await db.oneOrNone('SELECT pin FROM pins WHERE user_id = $1', [userId]);

      if (!pinRecord || pinRecord.pin !== pin) {
        console.error('No PIN record found for user:', userId);
        return res.render('addBalanceCheck', { error: 'Invalid PIN.', userId });
      }

      const amount = req.session.amount;

      if (!amount) {
        return res.render('addBalanceCheck', { error: 'Session expired or invalid.', userId });
      }

      await this.addBalanceToUser(userId, amount);
      return res.redirect(`/add/${userId}/success`);
    } catch (error) {
      return res.render('addBalanceCheck', { error: 'An error occurred while verifying the PIN.', userId });
    }
  }

  async addBalanceSuccess(req, res) {
    return res.render('addBalanceSuccess');
  }
}

export default new AddBalanceController();
