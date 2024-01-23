import { db } from '../models/index.js';

class AdminController {
  async index(req, res) {
    const totalUsersResult = await db.one('SELECT COUNT(*) FROM "users"');
    const totalUsers = totalUsersResult.count;

    const totalProductsResult = await db.one('SELECT COUNT(*) FROM "products"');
    const totalProducts = totalProductsResult.count;

    return res.render('admin_dashboard', {
      totalUsers,
      totalProducts,
    });
  }
}

export default new AdminController();
