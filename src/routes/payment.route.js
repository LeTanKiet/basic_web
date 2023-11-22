import express from 'express';
import paymentController from '../controllers/payment.controller.js';

const paymentRoutes = () => {
  const router = express.Router();

  router.get('/', paymentController.index);

  return router;
};

export default paymentRoutes;
