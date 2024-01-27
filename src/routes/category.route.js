import express from 'express';
import CategoryController from '../controllers/category.controller.js';
import { authentication } from '../middlewares/auth.js';

const categoryRoutes = () => {
  const router = express.Router();

  router.get('/', authentication, CategoryController.getPaginatedCategories);
  router.get('/:id', authentication, CategoryController.getCategoryById);
  router.post('/', authentication, CategoryController.createCategory);
  router.put('/:id', authentication, CategoryController.updateCategory);
  router.delete('/:id', authentication, CategoryController.deleteCategory);
  return router;
};

export default categoryRoutes;
