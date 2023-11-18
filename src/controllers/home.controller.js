class HomeController {
  index(req, res) {
    return res.render('home');
  }

  getAll(req, res) {
    return res.render('home');
  }
}

export default new HomeController();
