import express from 'express';
import paymentController from '../controllers/payment.controller.js';

const paymentRoutes = () => {
  const router = express.Router();

  router.get('/', paymentController.index);

  router.get('/add/:id', paymentController.addBalancePage);
  router.post('/add/:id', paymentController.processAddBalance);

  router.get('/payment/:id', paymentController.paymentPage);
  router.post('/payment/:id', paymentController.processPayment);

  router.get('/payment/:id/success', paymentController.paymentSuccess);
  return router;
};

export default paymentRoutes;
