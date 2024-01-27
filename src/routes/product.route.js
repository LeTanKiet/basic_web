import express from 'express';
import productController from '../controllers/product.controller.js';

const productRoutes = () => {
  const router = express.Router();

  // router.get('/', authentication, productController.index);
  // router.get('/:id', authentication, productController.productDetailPage);

  return router;
};

export default productRoutes;
