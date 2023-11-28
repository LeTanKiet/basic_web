import Product from '../models/product.js';

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.findAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createProduct: async (req, res) => {
    try {
      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      await Product.update(req.body, { where: { id: req.params.id } });
      const updatedProduct = await Product.findByPk(req.params.id);
      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      await Product.destroy({ where: { id: req.params.id } });
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
export default productController;
