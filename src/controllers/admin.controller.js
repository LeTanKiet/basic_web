import { db } from '../models/index.js';

class AdminController {
  async index(req, res) {
    const { userId } = req.context;
    const user = await db.oneOrNone('select * from "users" where id = $1', userId);

    const admin = user.role;
    const totalUsersResult = await db.one('SELECT COUNT(*) FROM "users"');
    const totalUsers = totalUsersResult.count;

    const totalProductsResult = await db.one('SELECT COUNT(*) FROM "products"');
    const totalProducts = totalProductsResult.count;

    return res.render('admin_dashboard', {
      user,
      admin,
      totalUsers,
      totalProducts,
    });
  }
}

export default new AdminController();
