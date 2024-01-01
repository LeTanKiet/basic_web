import { db } from '../models/index.js';

class HomeController {
  async index(req, res) {
    const { userId } = req.context;
    const user = await db.oneOrNone('select * from "users" where id = $1', userId);
    const topProducts = [
      { id: 1, name: 'Loveseat Couch', price: 50 },
      { id: 2, name: 'Urn Vase', price: 45 },
      { id: 3, name: 'Loveseat Couch', price: 50 },
      { id: 4, name: 'Urn Vase', price: 45 },
    ];

    return res.render('home', {
      user,
      topProducts,
    });
  }

  getAll(req, res) {
    return res.render('home');
  }
}

export default new HomeController();
