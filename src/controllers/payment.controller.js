class paymentController {
  index(req, res) {
    return res.render('payment');
  }

  getAll(req, res) {
    return res.render('payment');
  }
}

export default new paymentController();
