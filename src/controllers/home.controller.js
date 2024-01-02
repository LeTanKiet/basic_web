import { db } from '../models/index.js';

class HomeController {
  async index(req, res) {
    const { userId } = req.context;
    const user = await db.oneOrNone('select * from "users" where id = $1', userId);

    return res.render('home', {
      user,
    });
  }

  getAll(req, res) {
    return res.render('home');
  }
}

export default new HomeController();
