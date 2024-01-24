import { db } from '../models/index.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import https from 'https';

class OrderController {
  async createOrder(req, res) {
    try {
      const { userId } = req.context;
      const cartItems = req.body.cart;

      const newOrder = await db.tx(async (transaction) => {
        const totalPrice = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

        const order = await transaction.one('INSERT INTO orders (user_id, price) VALUES ($1, $2) RETURNING id', [
          userId,
          totalPrice,
        ]);
        const orderItemsPromises = cartItems.map((item) => {
          return transaction.none(
            'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
            [order.id, item.id, 1, item.price],
          );
        });

        await Promise.all(orderItemsPromises);

        return order;
      });

      res.json({ orderId: newOrder.id });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).send('Error creating order');
    }
  }
  async displayOrder(req, res) {
    try {
      const orderId = req.params.orderId;
      console.log('orderId:', orderId);
      const order = await db.one('SELECT * FROM orders WHERE id = $1', [orderId]);
      const orderItems = await db.any('SELECT * FROM order_items WHERE order_id = $1', [orderId]);

      res.render('order', { order, orderItems });
    } catch (error) {
      console.error('Error displaying order:', error);
      res.status(500).send('Error displaying order');
    }
  }

  async startPayment(req, res) {
    try {
      const { orderId } = req.body;

      const order = await db.one('SELECT * FROM orders WHERE id = $1', [orderId]);

      const agent = new https.Agent({
        rejectUnauthorized: false,
        maxVersion: 'TLSv1.2',
        minVersion: 'TLSv1.2',
      });

      const token = jwt.sign({ order }, process.env.PAYMENT_SECRET, { expiresIn: '1h' });

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
}

export default new OrderController();
