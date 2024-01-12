import { db } from '../models/index.js';
import { categories, colors, materials, countryOfOrigin } from '../utils/constants.js';

class ProductController {
  async index(req, res) {
    const { userId } = req.context;
    const user = await db.oneOrNone('select * from "users" where id = $1', userId);

    // Query the database for all products
    const products = await db.any('select * from "products"');

    // TODO: Query all categories from the database instead of using the constants
    // TODO: Query all colors from the database instead of using the constants
    // TODO: Query all materials from the database instead of using the constants
    // TODO: Query all countryOfOrigin from the database instead of using the constants

    return res.render('products', {
      user,
      products,
      categories,
      colors,
      materials,
      countryOfOrigin,
    });
  }

  productDetailPage(req, res) {
    const { id } = req.params;
    // TODO: get product detail
    const temp = {
      name: 'Product name',
      description:
        "This stylish piece seamlessly blends sleek design with plush cushioning, creating a chic focal point for any room. Crafted for both aesthetic appeal and relaxation, this loveseat is more than furniture—it's a statement.",
      price: 50,
    };

    return res.render('product_detail', {
      product: temp,
    });
  }

  async getAllProducts(req, res) {
    try {
      const products = await db.any('SELECT * FROM products');
      return res.render('product_manager', { products });
    } catch (error) {
      return res.status(500).json(`Error getting products: ${error.message}`);
    }
  }

  async getProductById(req, res) {
    const { id } = req.params;
    try {
      const product = await db.one('SELECT * FROM products WHERE id = $1', id);
      return res.json(product);
    } catch (error) {
      return res.status(500).json(`Error getting product by ID: ${error.message}`);
    }
  }

  async createProduct(req, res) {
    const productData = req.body;
    try {
      const result = await db.one(
        'INSERT INTO products(name, price, description, image) VALUES($1, $2, $3, $4) RETURNING *',
        [productData.name, productData.price, productData.description, productData.image],
      );
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ error: `Error creating product: ${error.message}` });
    }
  }

  async updateProduct(req, res) {
    const { id } = req.params;
    const productData = req.body;
    try {
      const result = await db.one(
        'UPDATE products SET name = $1, price = $2, description = $3, image = $4 WHERE id = $5 RETURNING *',
        [productData.name, productData.price, productData.description, productData.image, id],
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: `Error updating product: ${error.message}` });
    }
  }

  async deleteProduct(req, res) {
    const { id } = req.params;
    try {
      await db.none('DELETE FROM products WHERE id = $1', id);
      return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: `Error deleting product: ${error.message}` });
    }
  }
}

export default new productController();
