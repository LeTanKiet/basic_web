import express from 'express';
import transactionController from '../controllers/transaction.controller.js';

const transactionRoutes = () => {
  const router = express.Router();

  router.get('/', transactionController.getTransactionsByStatusAndType);

  return router;
};

export default transactionRoutes;
