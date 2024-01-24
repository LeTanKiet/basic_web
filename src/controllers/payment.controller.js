import { db } from '../models/index.js';
import SendPinEmail from '../models/sendPinEmail.js';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

class paymentController {
  index(req, res) {
    return res.render('home');
  }

  constructor() {
    this.sendPaymentPin = this.sendPaymentPin.bind(this);
    this.processPaymentCheck = this.processPaymentCheck.bind(this);
  }

  async initiatePayment(req, res) {
    const { token } = req.body;

    const decoded = jwt.verify(token, process.env.PAYMENT_SECRET);
    const order = decoded.order;

    try {
      let paymentUserId;
      const payment_user = await db.oneOrNone('SELECT id FROM "payment_users" WHERE user_id = $1', [order.user_id]);

      if (payment_user) {
        paymentUserId = payment_user.id;
      } else {
        paymentUserId = uuidv4();
        await db.none('INSERT INTO "payment_users" (id, payment_method, balance, user_id) VALUES ($1, $2, $3, $4)', [
          paymentUserId,
          'defaultMethod',
          0,
          order.user_id,
        ]);
      }

      const transaction = await db.one(
        'INSERT INTO "transactions" (payment_id, amount, type, order_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [paymentUserId, order.price, 'payment', order.id, 'TO_PAY'],
      );

      return res.json({ redirectUrl: `https://localhost:3001/payment/${transaction.id}` });
    } catch (error) {
      console.error('Error initiating payment:', error);
      return res.json({ success: false, error: 'An error occurred while initiating the payment.' });
    }
  }

  async paymentPage(req, res) {
    const transactionId = req.params.id;

    try {
      const transaction = await db.oneOrNone(
        'SELECT id, order_id, amount, payment_id FROM "transactions" WHERE id = $1',
        [transactionId],
      );

      if (!transaction) {
        return res.render('error', { error: 'Transaction not found.' });
      }

      const payment_user = await db.oneOrNone('SELECT id, balance FROM "payment_users" WHERE id = $1', [
        transaction.payment_id,
      ]);

      if (!payment_user) {
        return res.render('error', { error: 'Payment User not found.' });
      }

      req.session.transactionId = transaction.id;

      return res.render('payment', {
        orderId: transaction.order_id,
        totalPayment: transaction.amount,
        userBalance: payment_user.balance,
        transactionId: transaction.id,
        paymentId: payment_user.id,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching payment detail:', error);
      return res.render('error', { error: 'Error fetching payment detail.' });
    }
  }

  async sendPaymentPin(req, res) {
    const transactionId = req.params.id;

    const transaction = await db.oneOrNone('SELECT payment_id FROM "transactions" WHERE id = $1', [transactionId]);

    const user = await db.oneOrNone('SELECT user_id FROM "payment_users" WHERE id = $1', [transaction.payment_id]);

    try {
      await SendPinEmail.sendPinEmail(user.user_id);

      res.redirect(`/payment/${transactionId}/check`);
    } catch (error) {
      console.error('Error sending PIN email:', error);
      return res.render('payment', { error: 'An error occurred while sending the PIN.' });
    }
  }

  async paymentCheckPage(req, res) {
    const transactionId = req.params.id;

    const transaction = await db.oneOrNone('SELECT order_id FROM "transactions" WHERE id = $1', [transactionId]);

    try {
      res.render('paymentCheck', { orderId: transaction.order_id, transactionId: transactionId, error: null });
    } catch (error) {
      console.error('Error in paymentCheckPage:', error);
      res.render('error', { error: 'An error occurred.' });
    }
  }

  async processPaymentCheck(req, res) {
    const transactionId = req.params.id;
    const { pin } = req.body;

    try {
      const transaction = await db.oneOrNone(
        'SELECT payment_id, amount, type, order_id FROM "transactions" WHERE id = $1',
        [transactionId],
      );

      if (!transaction) {
        return res.render('error', { error: 'Transaction not found.' });
      }

      const user_id = await db.oneOrNone('SELECT user_id FROM "payment_users" WHERE id = $1', [transaction.payment_id]);

      const pinRecord = await db.oneOrNone('SELECT pin FROM pins WHERE user_id = $1', [user_id.user_id]);

      if (!pinRecord || pinRecord.pin !== pin) {
        return res.render('paymentCheck', { error: 'Invalid PIN.', orderId: transaction.order_id });
      }

      await this.processPayment(transactionId);

      return res.redirect(`/payment/${transactionId}/success`);
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return res.render('paymentCheck', { error: 'An error occurred while verifying the PIN.', orderId });
    }
  }

  async processPayment(transactionId) {
    try {
      const transaction = await db.oneOrNone(
        'SELECT payment_id, amount, type, order_id FROM "transactions" WHERE id = $1',
        [transactionId],
      );
      if (!transaction) throw new Error('Transaction not found');

      const payment_user = await db.oneOrNone('SELECT id, balance, user_id FROM "payment_users" WHERE id = $1', [
        transaction.payment_id,
      ]);

      if (!payment_user) throw new Error('Payment User not found');

      if (parseFloat(payment_user.balance) < parseFloat(transaction.amount)) {
        throw new Error('Insufficient balance');
      }

      const updatedBalance = parseFloat(payment_user.balance) - parseFloat(transaction.amount);

      await db.none('UPDATE "payment_users" SET balance = $1 WHERE id = $2', [updatedBalance, payment_user.id]);

      const adminId = 'admin_id';

      const admin = await db.one('SELECT balance FROM "payment_users" WHERE id = $1', [adminId]);

      const adminUpdatedBalance = parseFloat(admin.balance) + parseFloat(transaction.amount);

      await db.none('UPDATE "payment_users" SET balance = $1 WHERE id = $2', [adminUpdatedBalance, adminId]);

      await db.none('UPDATE transactions SET status = $1, "completedAt" = NOW() WHERE id = $2', ['PAID', transactionId]);

      await db.none('DELETE FROM pins WHERE user_id = $1', [payment_user.user_id]);
    } catch (error) {
      console.error('Error processing payment:', error);
      return error.message || 'An error occurred while processing the payment.';
    }
  }

  async paymentSuccess(req, res) {
    return res.render('paymentSuccess');
  }
}

export default new paymentController();
