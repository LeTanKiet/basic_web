import express from 'express';
import paymentController from '../controllers/payment.controller.js';
import addBalanceController from '../controllers/addBalance.controller.js';
import { checkPaymentAccount } from '../middlewares/checkPaymentAccount.js';

const paymentRoutes = () => {
  const router = express.Router();

  router.get('/', paymentController.index);

  router.post('/initiate', paymentController.initiatePayment);
  router.get('/:id', paymentController.paymentPage);
  router.post('/:id/send-pin', paymentController.sendPaymentPin);

  router.get('/:id/check', paymentController.paymentCheckPage);
  router.post('/:id/check', paymentController.processPaymentCheck);

  router.get('/:id/success', paymentController.paymentSuccess);
  return router;
};

export default paymentRoutes;
