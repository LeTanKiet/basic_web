import { db } from '../models/index.js';
import { categories } from '../utils/constants.js';

class HomeController {
  async index(req, res) {
    const { userId } = req.context;
    const user = await db.oneOrNone('select * from "users" where id = $1', userId);
    console.log('user', user);

    // Query top 4 products by sold
    const topProducts = await db.any('select * from "products" order by "sold" desc limit 4');

    // TODO: Query all categories from the database instead of using the constants
    const categories = await db.any('select * FROM "categories" ORDER BY "name" ASC LIMIT 6');
    console.log('categories', categories);

    return res.render('home', {
      user,
      topProducts,
      categories,
    });
  }

  getAll(req, res) {
    return res.render('home');
  }
}

export default new HomeController();
