import express from 'express';
import authPaymentController from '../controllers/authPayment.controller.js';

const authPaymentRoutes = () => {
  const router = express.Router();

  router.get('/create-payment-account', authPaymentController.createPaymentPage);

  router.get('/register-payment-account', authPaymentController.createPaymentAccount);

  return router;
};

export default authPaymentRoutes;
