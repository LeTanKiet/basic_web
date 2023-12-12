import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const productRoutes = () => {
  const productRoutes = express.Router();

  productRoutes.get('/', async (req, res) => {
    try {
      const products = await getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  productRoutes.get('/:id', async (req, res) => {
    try {
      const product = await getProductById(req.params.id);
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  productRoutes.post('/', async (req, res) => {
    try {
      const product = await createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  productRoutes.put('/:id', async (req, res) => {
    try {
      const updatedProduct = await updateProduct(req.params.id, req.body);
      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  productRoutes.delete('/:id', async (req, res) => {
    try {
      await deleteProduct(req.params.id);
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  return productRoutes;
};

export default productRoutes;
