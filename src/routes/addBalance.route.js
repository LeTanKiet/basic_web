import express from 'express';
import paymentController from '../controllers/payment.controller.js';
import addBalanceController from '../controllers/addBalance.controller.js';

const addBalanceRoutes = () => {
  const router = express.Router();

  router.get('/:id', addBalanceController.addBalancePage);
  router.post('/:id/send-pin', addBalanceController.SendPin);

  router.get('/:id/check', addBalanceController.addBalanceCheckPage);
  router.post('/:id/check', addBalanceController.processAddBalanceCheck);

  router.get('/:id/success', addBalanceController.addBalanceSuccess);

  return router;
};

export default addBalanceRoutes;
