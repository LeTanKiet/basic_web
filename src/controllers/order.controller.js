import { db } from '../models/index.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import https from 'https';

class OrderController {
  async startPayment(req, res) {
    try {
      const { formData, checkoutItems } = req.body;
      const { first_name, last_name, phone, email, street_address, city, note } = formData;

      const { userId } = req.context;

      const newOrder = await db.tx(async (transaction) => {
        const totalPrice = checkoutItems.reduce((acc, item) => acc + item.price * item.amount, 0);

        const order = await transaction.one(
          'INSERT INTO orders (user_id, first_name, last_name, phone, street_address, city, note, price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
          [userId, first_name, last_name, phone, street_address, city, note, totalPrice],
        );

        const orderItemsPromises = checkoutItems.map((item) => {
          return transaction.none(
            'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
            [order.id, item.id, item.amount, item.price],
          );
        });

        await Promise.all(orderItemsPromises);

        return order;
      });

      // Initiate payment
      const agent = new https.Agent({
        rejectUnauthorized: false,
        maxVersion: 'TLSv1.2',
        minVersion: 'TLSv1.2',
      });

      const token = jwt.sign({ order: newOrder }, process.env.PAYMENT_SECRET, { expiresIn: '1h' });

      const response = await axios.post(`https://localhost:3001/payment/initiate`, { token }, { httpsAgent: agent });

      if (response.status === 200) {
        res.json({ redirectUrl: response.data.redirectUrl });
      } else {
        res.status(response.status).send('Error initiating payment');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      res.status(500).send('Error initiating payment');
    }
  }

  async updateCompletedPayment(req, res) {
    try {
      const { token } = req.body;
      console.log('token: ', token);

      const decoded = jwt.verify(token, process.env.PAYMENT_SECRET);
      console.log ('decoded: ', decoded)
      const orderId = decoded.orderId;

      console.log('orderId: ', orderId);

      await db.none('UPDATE orders SET status = $1 WHERE id = $2', ['PAID', orderId]);

      res.sendStatus(200, 'update status completed');
    } catch (error) {
      console.error('Error updating completed payment:', error);
      res.status(500).send('Error updating completed payment');
    }
  }
}

export default new OrderController();
