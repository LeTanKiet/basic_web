import { db } from '../models/index.js';

const getAllProducts = async () => {
  try {
    const products = await db.any('SELECT * FROM products');
    return products;
  } catch (error) {
    throw new Error(`Error getting products: ${error.message}`);
  }
};

const getProductById = async (id) => {
  try {
    const product = await db.one('SELECT * FROM products WHERE id = $1', id);
    return product;
  } catch (error) {
    throw new Error(`Error getting product by ID: ${error.message}`);
  }
};

const createProduct = async (productData) => {
  try {
    const result = await db.one('INSERT INTO products(name, price, description) VALUES($1, $2, $3) RETURNING *', [
      productData.name,
      productData.price,
      productData.description,
    ]);
    return result;
  } catch (error) {
    throw new Error(`Error creating product: ${error.message}`);
  }
};

const updateProduct = async (id, productData) => {
  try {
    const result = await db.one(
      'UPDATE products SET name = $1, price = $2, description = $3 WHERE id = $4 RETURNING *',
      [productData.name, productData.price, productData.description, id],
    );
    return result;
  } catch (error) {
    throw new Error(`Error updating product: ${error.message}`);
  }
};

const deleteProduct = async (id) => {
  try {
    await db.none('DELETE FROM products WHERE id = $1', id);
    return { message: 'Product deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting product: ${error.message}`);
  }
};

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
