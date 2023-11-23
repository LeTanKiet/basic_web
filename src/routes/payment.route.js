import express from 'express';
import paymentController from '../controllers/payment.controller.js';

const paymentRoutes = () => {
  const router = express.Router();

  router.get('/', paymentController.index);

  router.get('/add', paymentController.addPaymentPage);
  router.post('/add', paymentController.addPayment);

  router.get('/payment', paymentController.paymentPage);
  router.post('/payment', paymentController.addTransaction);

  router.get('/payment/show', paymentController.paymentShowPage);
  return router;
};

export default paymentRoutes;
