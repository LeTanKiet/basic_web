import express from 'express';
import productController from '../controllers/product.controller.js';
import { authentication } from '../middlewares/auth.js';

const productRoutes = () => {
  const router = express.Router();

  router.get('/:id', authentication, productController.productDetailPage);

  return router;
};

export default productRoutes;
