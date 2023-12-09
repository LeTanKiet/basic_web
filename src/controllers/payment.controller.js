import { db } from '../models/index.js';

class paymentController {
  index(req, res) {
    return res.render('home');
  }

  async addBalancePage(req, res) {
    const userId = req.params.id;

    try {
      // Fetch the user details based on user_id
      const user = await db.oneOrNone('SELECT id, balance FROM "users" WHERE id = $1', [userId]);

      if (!user) {
        return res.render('add', { error: 'User not found.' });
      }

      return res.redirect(`/add/${userId}`);
    } catch (error) {
      console.error('Error fetching user balance:', error);
      return res.render('add', { error: 'Error fetching user balance.' });
    }
  }

  async processAddBalance(req, res) {
    const userId = req.params.id;
    const { amount } = req.body;

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

      const updatedBalance = parseFloat(user.balance) + parseFloat(amount);
      await db.none('UPDATE "users" SET balance = $1 WHERE id = $2', [updatedBalance, userId]);

      return res.render('add', { userBalance: user.balance, userId, orderId: orderId.highest_order_id });
    } catch (error) {
      console.error('Error adding balance:', error);
      return res.render('add', { error: 'An error occurred while adding balance.' });
    }
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

  async processPayment(req, res) {
    const orderId = req.params.id;
    try {
      // Fetch the order details, including price and user_id
      const order = await db.oneOrNone('SELECT price, user_id FROM "orders" WHERE id = $1', [orderId]);

      console.log(order);

      if (!order) {
        return res.render('error', { error: 'Order not found.' });
      }

      // Fetch the user details based on user_id from the order
      const user = await db.oneOrNone('SELECT id, balance FROM "users" WHERE id = $1', [order.user_id]);

      if (!user) {
        return res.render('payment', {
          orderId,
          totalPayment: order.price,
          userBalance: user.balance,
          error: 'Invalid user.',
        });
      }

      // Check if the user has sufficient balance
      if (user.balance < parseFloat(order.price)) {
        return res.render('payment', {
          orderId,
          totalPayment: order.price,
          userBalance: user.balance,
          error: 'Insufficient balance.',
        });
      }

      const updatedBalance = parseFloat(user.balance) - parseFloat(order.price);
      await db.none('UPDATE "users" SET balance = $1 WHERE id = $2', [updatedBalance, user.id]);

      const adminId = 1;
      const admin = await db.one('SELECT id, balance FROM "users" WHERE id = $1', [adminId]);
      const adminUpdatedBalance = parseFloat(admin.balance) + parseFloat(order.price);
      await db.none('UPDATE "users" SET balance = $1 WHERE id = $2', [adminUpdatedBalance, adminId]);

      await db.none('INSERT INTO "transactions" (user_id, purchase) VALUES ($1, $2)', [user.id, order.price]);

      return res.redirect(`/payment/${orderId}/success`);
    } catch (error) {
      console.error('Error processing payment:', error);
      return res.render('payment', {
        orderId,
        totalPayment: order.price,
        userBalance: user.balance,
        error: 'An error occurred while processing the payment.',
      });
    }
  }

  async paymentSuccess(req, res) {
    return res.render('paymentSuccess');
  }
  
}

export default new paymentController();
