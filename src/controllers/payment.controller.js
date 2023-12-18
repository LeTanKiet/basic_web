import { db } from '../models/index.js';
import nodemailer from 'nodemailer';

class paymentController {
  index(req, res) {
    return res.render('home');
  }

  constructor() {
    this.sendPinWithEmail = this.sendPinWithEmail.bind(this);
    this.processAddBalanceCheck = this.processAddBalanceCheck.bind(this);
    this.sendPaymentPin = this.sendPaymentPin.bind(this);
    this.processPaymentCheck = this.processPaymentCheck.bind(this);
  }

  async sendPinEmail(userId, amount) {
    const user = await db.oneOrNone('SELECT email FROM "users" WHERE id = $1', [userId]);
    if (!user) throw new Error('User not found');

    const pin = Math.floor(100000 + Math.random() * 900000);

    await db.none(
      `
    INSERT INTO pins (user_id, pin, amount)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id) 
    DO UPDATE SET pin = EXCLUDED.pin, amount = EXCLUDED.amount`,
      [userId, pin, amount],
    );
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"Your Service" <noreply@yourservice.com>',
      to: user.email,
      subject: 'Your PIN',
      text: `Your PIN is: ${pin}`,
    });
  }

  async addBalancePage(req, res) {
    const userId = req.params.id;

    try {
      // Fetch the user details based on user_id
      const user = await db.oneOrNone('SELECT id, balance FROM "users" WHERE id = $1', [userId]);

      if (!user) {
        return res.render('add', { error: 'User not found.' });
      }

      const orderId = await db.oneOrNone('SELECT MAX(id) AS highest_order_id FROM "orders" WHERE user_id = $1', [
        userId,
      ]);

      console.log(orderId);

      return res.render('add', { userBalance: user.balance, userId, orderId: orderId.highest_order_id });
    } catch (error) {
      console.error('Error fetching user balance:', error);
      return res.render('add', { error: 'Error fetching user balance.' });
    }
  }

  async sendPinWithEmail(req, res) {
    const userId = req.params.id;
    const { amount } = req.body;

    try {
      await this.sendPinEmail(userId, amount);
      res.redirect(`/add/${userId}/check`);
    } catch (error) {
      console.error('Error sending PIN email:', error);
      return res.render('add', { error: 'An error occurred while sending the PIN.' });
    }
  }

  async addBalanceToUser(userId, amount) {
    try {
      // Fetch the current balance of the user
      const user = await db.oneOrNone('SELECT balance FROM "users" WHERE id = $1', [userId]);
      if (!user) {
        throw new Error('User not found');
      }

      // Calculate the new balance
      const newBalance = parseFloat(user.balance) + parseFloat(amount);

      // Update the user's balance in the database
      await db.none('UPDATE "users" SET balance = $1 WHERE id = $2', [newBalance, userId]);

      await db.none('DELETE FROM pins WHERE user_id = $1', [userId]);

      // Optionally, you can add a record to a transaction log or history table if you have one
      // await db.none('INSERT INTO transaction_history (user_id, amount, transaction_type) VALUES ($1, $2, $3)', [userId, amount, 'balance_addition']);
    } catch (error) {
      console.error('Error in addBalanceToUser:', error);
      throw error; // Rethrow the error to handle it in the calling method
    }
  }

  async addBalanceCheckPage(req, res) {
    const userId = req.params.id;

    try {
      res.render('addBalanceCheck', { userId });
    } catch (error) {
      console.error('Error in addBalanceCheckPage:', error);
      res.render('error', { error: 'An error occurred.' }); // Render an error page or handle error appropriately
    }
  }

  async processAddBalanceCheck(req, res) {
    const userId = req.params.id;
    const { pin } = req.body;

    try {
      const pinRecord = await db.oneOrNone('SELECT pin, amount FROM pins WHERE user_id = $1', [userId]);
      if (!pinRecord || pinRecord.pin !== pin) {
        return res.render('addBalanceCheck', { error: 'Invalid PIN.', userId });
      }

      await this.addBalanceToUser(userId, pinRecord.amount);
      return res.redirect(`/add/${userId}/check/success`);
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return res.render('addBalanceCheck', { error: 'An error occurred while verifying the PIN.', userId });
    }
  }

  async addBalanceSuccess(req, res) {
    return res.render('addBalanceSuccess');
  }

  async paymentPage(req, res) {
    const orderId = req.params.id;

    try {
      // Fetch the order details, including price and user_id
      const order = await db.oneOrNone('SELECT price, user_id FROM "orders" WHERE id = $1', [orderId]);

      if (!order) {
        return res.render('error', { error: 'Order not found.' });
      }

      // Fetch the user details based on user_id from the order
      const user = await db.oneOrNone('SELECT id, username, balance FROM "users" WHERE id = $1', [order.user_id]);

      if (!user) {
        return res.render('error', { error: 'User not found.' });
      }

      const totalPayment = order.price;

      return res.render('payment', { orderId, totalPayment, userBalance: user.balance, userId: user.id, error: null });
    } catch (error) {
      console.error('Error fetching payment detail:', error);
      return res.render('error', { error: 'Error fetching payment detail.' });
    }
  }

  async sendPaymentPin(req, res) {
    const orderId = req.params.id;

    const order = await db.oneOrNone('SELECT price, user_id FROM "orders" WHERE id = $1', [orderId]);

    if (!order) {
      return res.render('error', { error: 'Order not found.' });
    }

    try {
      await this.sendPinEmail(order.user_id, order.price);
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

      const pinRecord = await db.oneOrNone('SELECT pin, amount FROM pins WHERE user_id = $1', [order.user_id]);
      if (!pinRecord || pinRecord.pin !== pin) {
        return res.render('paymentCheck', { error: 'Invalid PIN.', orderId });
      }

      await this.processPayment(orderId, pinRecord.amount);
      return res.redirect(`/payment/${orderId}/success`);
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return res.render('paymentCheck', { error: 'An error occurred while verifying the PIN.', orderId });
    }
  }

  async processPayment(orderId, amount) {
    try {
      const order = await db.oneOrNone('SELECT price, user_id FROM "orders" WHERE id = $1', [orderId]);
      if (!order) throw new Error('Order not found');

      const user = await db.oneOrNone('SELECT id, balance FROM "users" WHERE id = $1', [order.user_id]);
      if (!user) throw new Error('User not found');

      if (parseFloat(user.balance) < parseFloat(order.price)) {
        throw new Error('Insufficient balance');
      }

      const updatedBalance = parseFloat(user.balance) - parseFloat(order.price);
      await db.none('UPDATE "users" SET balance = $1 WHERE id = $2', [updatedBalance, user.id]);

      const adminId = 1;
      const admin = await db.one('SELECT id, balance FROM "users" WHERE id = $1', [adminId]);
      const adminUpdatedBalance = parseFloat(admin.balance) + parseFloat(order.price);
      await db.none('UPDATE "users" SET balance = $1 WHERE id = $2', [adminUpdatedBalance, adminId]);

      await db.none('INSERT INTO "transactions" (user_id, purchase) VALUES ($1, $2)', [user.id, order.price]);

      await db.none('DELETE FROM pins WHERE user_id = $1', [order.user_id]);

      return 'success';
    } catch (error) {
      console.error('Error processing payment:', error);
      return error.message || 'An error occurred while processing the payment.';
    }
  }

  // async processPayment(req, res) {
  //   const orderId = req.params.id;
  //   try {
  //     // Fetch the order details, including price and user_id
  //     const order = await db.oneOrNone('SELECT price, user_id FROM "orders" WHERE id = $1', [orderId]);

  //     console.log(order);

  //     if (!order) {
  //       return res.render('error', { error: 'Order not found.' });
  //     }

  //     // Fetch the user details based on user_id from the order
  //     const user = await db.oneOrNone('SELECT id, balance FROM "users" WHERE id = $1', [order.user_id]);

  //     if (!user) {
  //       return res.render('payment', {
  //         orderId,
  //         totalPayment: order.price,
  //         userBalance: user.balance,
  //         error: 'Invalid user.',
  //       });
  //     }

  //     // Check if the user has sufficient balance
  //     if (user.balance < parseFloat(order.price)) {
  //       return res.render('payment', {
  //         orderId,
  //         totalPayment: order.price,
  //         userBalance: user.balance,
  //         error: 'Insufficient balance.',
  //       });
  //     }

  //     const updatedBalance = parseFloat(user.balance) - parseFloat(order.price);
  //     await db.none('UPDATE "users" SET balance = $1 WHERE id = $2', [updatedBalance, user.id]);

  //     const adminId = 1;
  //     const admin = await db.one('SELECT id, balance FROM "users" WHERE id = $1', [adminId]);
  //     const adminUpdatedBalance = parseFloat(admin.balance) + parseFloat(order.price);
  //     await db.none('UPDATE "users" SET balance = $1 WHERE id = $2', [adminUpdatedBalance, adminId]);

  //     await db.none('INSERT INTO "transactions" (user_id, purchase) VALUES ($1, $2)', [user.id, order.price]);

  //     return res.redirect(`/payment/${orderId}/success`);
  //   } catch (error) {
  //     console.error('Error processing payment:', error);
  //     return res.render('payment', {
  //       orderId,
  //       totalPayment: order.price,
  //       userBalance: user.balance,
  //       error: 'An error occurred while processing the payment.',
  //     });
  //   }
  // }

  async paymentSuccess(req, res) {
    return res.render('paymentSuccess');
  }
}

export default new paymentController();
