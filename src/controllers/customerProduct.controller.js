import { db } from '../models/index.js';
import { categories, colors, materials, countryOfOrigin } from '../utils/constants.js';

class CustomerProductController {
  async index(req, res) {
    const { userId } = req.context;
    const user = await db.oneOrNone('select * from "users" where id = $1', userId);

    // TODO: Query all categories from the database instead of using the constants
    // TODO: Query all colors from the database instead of using the constants
    // TODO: Query all materials from the database instead of using the constants
    // TODO: Query all countryOfOrigin from the database instead of using the constants

    // Pagination

    // Get the current page number from the query parameters, or default to 1
    let currentPage = parseInt(req.query.page) || 1;
    // Ensure currentPage is a number, if it's not, set it to 1
    if (typeof currentPage !== 'number' || currentPage <= 0) {
      currentPage = 1;
    }

    // Define the number of products per page
    const productsPerPage = 4;

    // Query the database for the total number of products
    const totalProducts = await db.one('select count(*) from "products"', [], (data) => Number(data.count));

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    // If currentPage is greater than totalPages, set it to totalPages
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    // Calculate the offset for the database query
    const offset = (currentPage - 1) * productsPerPage;

    // Query the database for the products on the current page
    const products = await db.any('select * from "products" order by id limit $1 offset $2', [productsPerPage, offset]);

    // Create an array representing all pages: [1, 2, ..., totalPages]
    const pageNumbersArray = Array.from({ length: totalPages }, (_, i) => i + 1);

    return res.render('products', {
      user,
      products,
      categories,
      colors,
      materials,
      countryOfOrigin,
      currentPage,
      totalPages,
      pageNumbersArray,
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

export default new CustomerProductController();
