import { db } from '../models/index.js';

class HomeController {
  async index(req, res) {
    const { userId } = req.context;
    const user = await db.oneOrNone('select * from "users" where id = $1', userId);

    // Query top 4 products by sold
    const topProducts = await db.any('select * from "products" order by "sold" desc limit 4');

    // TODO: Query all categories from the database instead of using the constants
    const categories = await db.any('select * FROM "categories" ORDER BY "name" ASC LIMIT 6');

    // Query all categories from the database
    const categoriesObj = await db.any('select name from "categories"');

    // Query beds from the database
    const beds = await db.any(
      'SELECT products.* FROM "products" INNER JOIN "categories" ON products.id_category = categories.id WHERE categories.name = $1 LIMIT 4',
      ['Bed'],
    );

    return res.render('home', {
      user,
      topProducts,
      beds,
      categories,
    });
  }

  getAll(req, res) {
    return res.render('home');
  }
}

export default new HomeController();
