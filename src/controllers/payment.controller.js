import { db } from '../models/index.js';

class paymentController {
  index(req, res) {
    return res.render('home');
  }

  async addPaymentPage(req, res) {
    return res.render('add');
  }

  async addPayment(req, res) {
    const { username, money } = req.body;

    try {
      // Check if the user exists and has the role 'USER'
      const user = await db.oneOrNone('SELECT id FROM "user" WHERE userName = $1 AND role = $2', [username, 'USER']);

      if (!user) {
        return res.render('add', { error: 'Invalid user or user role.' });
      }

      // Check if there is a payment record for the user
      const existingPayment = await db.oneOrNone('SELECT id, balance FROM "payment" WHERE user_id = $1', [user.id]);

      if (existingPayment) {
        // If a payment record exists, update the balance
        const updatedBalance = parseFloat(existingPayment.balance) + parseFloat(money);
        await db.none('UPDATE "payment" SET balance = $1 WHERE id = $2', [updatedBalance, existingPayment.id]);
      } else {
        // If no payment record exists, create a new one
        await db.none('INSERT INTO "payment" (user_id, balance) VALUES ($1, $2)', [user.id, money]);
      }

      return res.redirect('/'); // Redirect to the homepage or any other page as needed
    } catch (error) {
      console.error('Error adding payment:', error);
      return res.render('add', { error: 'An error occurred while adding the payment.' });
    }
  }

  async paymentPage(req, res) {
    return res.render('payment');
  }

  async addTransaction(req, res) {
    const { username, totalMoney } = req.body;

    try {
      // Check if the user exists and has the role 'USER'
      const user = await db.oneOrNone('SELECT id FROM "user" WHERE userName = $1 AND role = $2', [username, 'USER']);

      if (!user) {
        return res.render('payment', { error: 'Invalid user or user role.' });
      }

      // Check if there is a payment record for the user
      const payment = await db.oneOrNone('SELECT id, balance FROM "payment" WHERE user_id = $1', [user.id]);

      if (!payment || payment.balance < parseFloat(totalMoney)) {
        // If no payment record exists or insufficient balance, throw an error
        return res.render('payment', { error: 'Insufficient balance.' });
      }

      // Deduct the totalMoney from the balance
      const updatedBalance = parseFloat(payment.balance) - parseFloat(totalMoney);
      await db.none('UPDATE "payment" SET balance = $1 WHERE id = $2', [updatedBalance, payment.id]);

      // Create a transaction record with a valid purchase value
      await db.none('INSERT INTO "transaction" (user_id, purchase) VALUES ($1, $2)', [user.id, parseFloat(totalMoney)]);

      return res.redirect('/payment/show'); // Redirect to the payment show page or any other page as needed
    } catch (error) {
      console.error('Error adding transaction:', error);
      return res.render('payment', { error: 'An error occurred while adding the transaction.' });
    }
  }

  async paymentShowPage(req, res) {
    try {
      // Fetch all users along with their payments and transactions
      const users = await db.any(
        'SELECT u.id, u.userName, p.balance, t.purchase FROM "user" u LEFT JOIN "payment" p ON u.id = p.user_id LEFT JOIN "transaction" t ON u.id = t.user_id',
      );

      return res.render('paymentShow', { users });
    } catch (error) {
      console.error('Error fetching payment information:', error);
      return res.render('paymentShow', { error: 'Error fetching payment information.' });
    }
  }
}

export default new paymentController();
