import express from 'express';
import CustomerProductController from '../controllers/customerProduct.controller.js';
import { authentication } from '../middlewares/auth.js';

const customerProductRoutes = () => {
  const router = express.Router();

  router.get('/', authentication, CustomerProductController.index);
  router.get('/:id', authentication, CustomerProductController.productDetailPage);

  return router;
};

export default customerProductRoutes;
