import { db } from '../models/index.js';
class productService {
  async getAllProducts() {
    const products = await db.any('SELECT * FROM products');
    return products;
  }

  async getProductById(id) {
    const product = await db.one('SELECT * FROM products WHERE id = $1', id);
    return product;
  }

  async createProduct(name, price, description, image) {
    const result = await db.one(
      'INSERT INTO products(name, price, description, image) VALUES($1, $2, $3, $4) RETURNING *',
      [name, price, description, image],
    );
    return result;
  }

  async updateProduct(id, productData) {
    const result = await db.one(
      'UPDATE products SET name = $1, price = $2, description = $3, image = $4 WHERE id = $5 RETURNING *',
      [productData.name, productData.price, productData.description, productData.image, id],
    );
    return result;
  }

  async deleteProduct(id) {
    const result = await db.none('DELETE FROM products WHERE id = $1', id);
    return result;
  }
}

export default new productService();
