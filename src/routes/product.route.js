import express from 'express';
import productController from '../controllers/product.controller.js';
import { authentication } from '../middlewares/auth.js';

const productRoutes = () => {
  const router = express.Router();

  router.get('/', authentication, productController.getPaginatedProducts);
  router.get('/:id', authentication, productController.getProductById);
  router.post('/', authentication, productController.createProduct);
  router.put('/:id', authentication, productController.updateProduct);
  router.delete('/:id', authentication, productController.deleteProduct);
  return router;
};

export default productRoutes;
