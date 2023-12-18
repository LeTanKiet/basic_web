import express from 'express';
import paymentController from '../controllers/payment.controller.js';

const paymentRoutes = () => {
  const router = express.Router();

  router.get('/', paymentController.index);

  router.get('/add/:id', paymentController.addBalancePage);
  router.post('/add/:id/send-pin', paymentController.sendPinWithEmail);

  router.get('/add/:id/check', paymentController.addBalanceCheckPage);
  router.post('/add/:id/check', paymentController.processAddBalanceCheck);
  router.get('/add/:id/success', paymentController.addBalanceSuccess);

  router.get('/payment/:id', paymentController.paymentPage);
  router.post('/payment/:id/send-pin', paymentController.sendPaymentPin);

  router.get('/payment/:id/check', paymentController.paymentCheckPage);
  router.post('/payment/:id/check', paymentController.processPaymentCheck);

  router.get('/payment/:id/success', paymentController.paymentSuccess);
  return router;
};

export default paymentRoutes;
