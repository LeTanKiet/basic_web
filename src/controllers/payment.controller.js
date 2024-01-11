import { db } from '../models/index.js';
import SendPinEmail from '../models/sendPinEmail.js';

class paymentController {
  index(req, res) {
    return res.render('home');
  }

  constructor() {
    this.sendPaymentPin = this.sendPaymentPin.bind(this);
    this.processPaymentCheck = this.processPaymentCheck.bind(this);
  }

  async paymentPage(req, res) {
    const orderId = req.params.id;

    try {
      const order = await db.oneOrNone('SELECT price, user_id FROM "orders" WHERE id = $1', [orderId]);

      if (!order) {
        return res.render('error', { error: 'Order not found.' });
      }

      const payment_user = await db.oneOrNone('SELECT id, balance FROM "payment_users" WHERE user_id = $1', [
        order.user_id,
      ]);

      if (!payment_user) {
        return res.render('error', { error: 'Payment User not found.' });
      }

      req.session.orderId = orderId;

      const totalPayment = order.price;

      return res.render('payment', {
        orderId,
        totalPayment,
        userBalance: payment_user.balance,
        paymentId: payment_user.id,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching payment detail:', error);
      return res.render('error', { error: 'Error fetching payment detail.' });
    }
  }

  async sendPaymentPin(req, res) {
    const orderId = req.params.id;

    const order = await db.oneOrNone('SELECT user_id FROM "orders" WHERE id = $1', [orderId]);

    if (!order) {
      return res.render('error', { error: 'Order not found.' });
    }

    try {
      await SendPinEmail.sendPinEmail(order.user_id);

      res.redirect(`/payment/${orderId}/check`);
    } catch (error) {
      console.error('Error sending PIN email:', error);
      return res.render('payment', { error: 'An error occurred while sending the PIN.' });
    }
  }

  async paymentCheckPage(req, res) {
    const orderId = req.params.id;

    try {
      res.render('paymentCheck', { orderId });
    } catch (error) {
      console.error('Error in paymentCheckPage:', error);
      res.render('error', { error: 'An error occurred.' });
    }
  }

  async processPaymentCheck(req, res) {
    const orderId = req.params.id;
    const { pin } = req.body;

    try {
      const order = await db.oneOrNone('SELECT price, user_id FROM "orders" WHERE id = $1', [orderId]);

      if (!order) {
        return res.render('error', { error: 'Order not found.' });
      }

      const pinRecord = await db.oneOrNone('SELECT pin FROM pins WHERE user_id = $1', [order.user_id]);

      if (!pinRecord || pinRecord.pin !== pin) {
        return res.render('paymentCheck', { error: 'Invalid PIN.', orderId });
      }

      await this.processPayment(orderId);

      return res.redirect(`/payment/${orderId}/success`);
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return res.render('paymentCheck', { error: 'An error occurred while verifying the PIN.', orderId });
    }
  }

  async processPayment(orderId) {
    try {
      const order = await db.oneOrNone('SELECT price, user_id FROM "orders" WHERE id = $1', [orderId]);
      if (!order) throw new Error('Order not found');

      const payment_user = await db.oneOrNone('SELECT id, balance FROM "payment_users" WHERE user_id = $1', [
        order.user_id,
      ]);

      if (!payment_user) throw new Error('Payment User not found');

      if (parseFloat(payment_user.balance) < parseFloat(order.price)) {
        throw new Error('Insufficient balance');
      }

      const updatedBalance = parseFloat(payment_user.balance) - parseFloat(order.price);

      await db.none('UPDATE "payment_users" SET balance = $1 WHERE id = $2', [updatedBalance, payment_user.id]);

      const adminId = 'admin_id';

      const admin = await db.one('SELECT balance FROM "payment_users" WHERE id = $1', [adminId]);

      const adminUpdatedBalance = parseFloat(admin.balance) + parseFloat(order.price);

      await db.none('UPDATE "payment_users" SET balance = $1 WHERE id = $2', [adminUpdatedBalance, adminId]);

      await db.none('INSERT INTO "transactions" (payment_id, amount, type, order_id) VALUES ($1, $2, $3, $4)', [
        payment_user.id,
        order.price,
        'payment',
        orderId,
      ]);

      await db.none('DELETE FROM pins WHERE user_id = $1', [order.user_id]);
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
