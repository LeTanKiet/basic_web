import { db } from '../models/index.js';

class HomeController {
  async index(req, res) {
    const { userId } = req.context;
    const user = await db.oneOrNone('select * from "users" where id = $1', userId);
    // Query top 4 products by sold
    const topProducts = await db.any('select * from "products" order by "sold" desc limit 4');
    // TODO: Query all categories from the database
    const categories = ['Desks', 'Dresser', 'Sofas', 'Armchairs', 'Beds', 'Nightstands', 'Bookcases'];

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
