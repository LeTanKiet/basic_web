import express from 'express';
import paymentController from '../controllers/payment.controller.js';
import addBalanceController from '../controllers/addBalance.controller.js';

const paymentRoutes = () => {
  const router = express.Router();

  router.get('/', paymentController.index);

  router.get('/add/:id', addBalanceController.addBalancePage);
  router.post('/add/:id/send-pin', addBalanceController.SendPin);

  router.get('/add/:id/check', addBalanceController.addBalanceCheckPage);
  router.post('/add/:id/check', addBalanceController.processAddBalanceCheck);

  router.get('/add/:id/success', addBalanceController.addBalanceSuccess);

  router.get('/payment/:id', paymentController.paymentPage);
  router.post('/payment/:id/send-pin', paymentController.sendPaymentPin);

  router.get('/payment/:id/check', paymentController.paymentCheckPage);
  router.post('/payment/:id/check', paymentController.processPaymentCheck);

  router.get('/payment/:id/success', paymentController.paymentSuccess);
  return router;
};

export default paymentRoutes;
