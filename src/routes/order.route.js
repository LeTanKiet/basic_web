import express from 'express';
import { authentication } from '../middlewares/auth.js';
import orderController from '../controllers/order.controller.js';

const orderRoutes = () => {
  const router = express.Router();

  router.post('/start-payment', authentication, orderController.startPayment);

  router.post('/update-completed-payment', orderController.updateCompletedPayment);

  return router;
};

export default orderRoutes;
