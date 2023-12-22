import express from 'express';
import productController from '../controllers/product.controller.js';

const productRoutes = () => {
  const router = express.Router();

  router.get('/', productController.getAllProducts);
  router.get('/:id', productController.getProductById);
  router.post('/', productController.createProduct);
  router.put('/:id', productController.updateProduct);
  router.delete('/:id', productController.deleteProduct);
  return router;
};

export default productRoutes;
