import express from 'express';
import { authentication } from '../middlewares/auth.js';
import orderController from '../controllers/order.controller.js';

const orderRoutes = () => {
  const router = express.Router();

  router.post('/checkout', authentication, orderController.createOrder);
  router.get('/:orderId', authentication, orderController.displayOrder);
  router.post('/start-payment', authentication, orderController.startPayment);

  return router;
};

export default orderRoutes;
