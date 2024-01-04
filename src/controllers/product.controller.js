import { db } from '../models/index.js';

class ProductController {
  async index(req, res) {
    const { userId } = req.context;
    const user = await db.oneOrNone('select * from "users" where id = $1', userId);
    // Query the database for all products
    const products = await db.any('select * from "products"');
    // TODO: Query all categories from the database
    const categories = ['Desks', 'Dresser', 'Sofas', 'Armchairs', 'Beds', 'Nightstands', 'Bookcases'];
    // TODO: Query all colors from the database
    const colors = ['Cadmium Red', 'Antique Gold', 'Dark Academia', 'Deco Silver'];
    // TODO: Query all materials from the database
    const materials = ['Wood', 'Cotton', 'Leather', 'Glass'];
    // TODO: Query all countryOfOrigin from the database
    const countryOfOrigin = ['Poland', 'Germany', 'Italy', 'Viet Nam'];

    return res.render('products', {
      user,
      products,
      categories,
      colors,
      materials,
      countryOfOrigin,
    });
  }

  productDetailPage(req, res) {
    const { id } = req.params;
    console.log('🚀 ~ file: product.controller.js:8 ~ ProductController ~ productDetailPage ~ id:', id);

    // TODO: get product detail
    const temp = {
      name: 'Product name',
      description:
        "This stylish piece seamlessly blends sleek design with plush cushioning, creating a chic focal point for any room. Crafted for both aesthetic appeal and relaxation, this loveseat is more than furniture—it's a statement.",
      price: 50,
    };

    return res.render('product_detail', {
      product: temp,
    });
  }
}

export default new ProductController();
