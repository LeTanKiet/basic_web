import { db } from '../models/index.js';
import { categories } from '../utils/constants.js';

class HomeController {
  async index(req, res) {
    const { userId } = req.context;
    const user = await db.oneOrNone('select * from "users" where id = $1', userId);

    // Query top 4 products by sold
    const topProducts = await db.any('select * from "products" order by "sold" desc limit 4');

    // TODO: Query all categories from the database instead of using the constants

    return res.render('home', {
      user,
      topProducts,
      categories,
    });
  }

  async profilePage(req, res) {
    const { userId } = req.context;
    const user = await db.oneOrNone('select * from "users" where id = $1', userId);

    return res.render('update_profile', {
      ...user,
    });
  }

  async updateProfile(req, res) {
    const {
      body: { name, email },
      context: { userId },
    } = req;

    const result = await db.one('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [
      name,
      email,
      userId,
    ]);

    return res.render('update_profile', {
      ...result,
    });
  }

  getAll(req, res) {
    return res.render('home');
  }
}

export default new HomeController();
