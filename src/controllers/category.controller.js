// Import necessary modules and database connection
import { db } from '../models/index.js';

class CategoryController {
  // Display all categories
  async getAllCategories(req, res) {
    try {
      const categories = await db.any('SELECT * FROM categories');
      return res.render('category_manager', { categories });
    } catch (error) {
      return res.status(500).json({ error: `Error getting categories: ${error.message}` });
    }
  }

  // Get category by ID
  async getCategoryById(req, res) {
    const { id } = req.params;
    try {
      const category = await db.one('SELECT * FROM categories WHERE id = $1', id);
      return res.json(category);
    } catch (error) {
      return res.status(500).json({ error: `Error getting category by ID: ${error.message}` });
    }
  }

  // Create a new category
  async createCategory(req, res) {
    console.log(req.body);
    const categoryData = req.body;
    try {
      const result = await db.one(
        'INSERT INTO categories(name, description) VALUES($1, $2) RETURNING *',
        [categoryData.name, categoryData.description]
      );
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ error: `Error creating category: ${error.message}` });
    }
  }

  // Update category by ID
  async updateCategory(req, res) {
    const { id } = req.params;
    const categoryData = req.body;
    try {
      const result = await db.one(
        'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
        [categoryData.name, categoryData.description, id]
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: `Error updating category: ${error.message}` });
    }
  }

  // Delete category by ID
  async deleteCategory(req, res) {
    const { id } = req.params;
    try {
      await db.none('DELETE FROM categories WHERE id = $1', id);
      return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: `Error deleting category: ${error.message}` });
    }
  }
}

export default new CategoryController();
