import express from 'express';
import productController from '../controllers/product.controller.js';

const productRoutes = () => {
  const router = express.Router();
  router.get('/', productController.index);
  router.get('/products', productController.getAllProducts);
  router.get('/products/:id', productController.getProductById);
  router.post('/products', productController.createProduct);
  router.put('/products/:id', productController.updateProduct);
  router.delete('/products/:id', productController.deleteProduct);
  return router;
};

export default productRoutes;
