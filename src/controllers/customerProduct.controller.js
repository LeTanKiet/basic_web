import { db } from '../models/index.js';

class CustomerProductController {
  async index(req, res) {
    const { userId } = req.context;
    const user = await db.oneOrNone('select * from "users" where id = $1', userId);

    // Query all categories, colors, materials, countryOfOrigin from the database instead of using the constants
    const _categories = await db.any('select * from "categories"');
    const _colors = await db.any('select * from "colors"');
    const _materials = await db.any('select * from "materials"');
    const _countryOfOrigin = await db.any('select * from "countryoforigin"');

    const categories = _categories.map((category) => category.name);
    const colors = _colors.map((category) => category.name);
    const materials = _materials.map((category) => category.name);
    const countryOfOrigin = _countryOfOrigin.map((category) => category.name);

    // Pagination

    // Get the current page number from the query parameters, or default to 1
    let currentPage = parseInt(req.query.page) || 1;
    // Ensure currentPage is a number, if it's not, set it to 1
    if (typeof currentPage !== 'number' || currentPage <= 0) {
      currentPage = 1;
    }

    // Define the number of products per page
    const productsPerPage = 12;

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
    const products = await db.any(
      'SELECT products.*, categories.name AS category FROM "products" INNER JOIN "categories" ON products.id_category = categories.id ORDER BY products.id LIMIT $1 OFFSET $2',
      [productsPerPage, offset],
    );

    products.forEach((product) => {
      product.categories = _categories.find((category) => category.id === product.id_category).name;
      product.colors = _colors.find((color) => color.id === product.id_color).name;
      product.materials = _materials.find((material) => material.id === product.id_material).name;
      product.countryOfOrigin = _countryOfOrigin.find((country) => country.id === product.id_countryoforigin).name;
    });

    // An array representing all pages: [1, 2, ..., totalPages]
    let pageNumbersArray = [];

    // Limit the number of pages shown to 7
    if (totalPages <= 7) {
      // If total pages is less than or equal to 7, show all pages
      pageNumbersArray = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // If total pages is more than 7
      if (currentPage <= 4) {
        // If current page is less than or equal to 4, show the first 7 pages
        pageNumbersArray = Array.from({ length: 7 }, (_, i) => i + 1);

        pageNumbersArray.push('...');
      } else if (currentPage > totalPages - 4) {
        // If current page is in the last 4 pages, show last 7 pages
        pageNumbersArray = Array.from({ length: 7 }, (_, i) => totalPages - 7 + i + 1);

        pageNumbersArray.unshift('...');
      } else {
        // If current page is in the middle, show 3 pages on either side of the current page
        pageNumbersArray = Array.from({ length: 7 }, (_, i) => currentPage - 4 + i + 1);

        pageNumbersArray.unshift('...');
        pageNumbersArray.push('...');
      }
    }

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

  async productDetailPage(req, res) {
    const { userId } = req.context;
    const user = await db.oneOrNone('select * from "users" where id = $1', userId);

    // Query all categories from the database
    const categoriesObj = await db.any('select name from "categories"');
    const categories = categoriesObj.map((category) => category.name);

    const { id } = req.params;

    // Query product detail from database
    const product = await db.one(
      `
        SELECT 
          products.name, 
          products.description, 
          products.price, 
          products.image, 
          products.sold, 
          products.id_category,
          categories.name AS category, 
          colors.name AS color, 
          materials.name AS material, 
          countryoforigin.name AS countryoforigin
        FROM 
          products
        INNER JOIN categories ON products.id_category = categories.id
        INNER JOIN colors ON products.id_color = colors.id
        INNER JOIN materials ON products.id_material = materials.id
        INNER JOIN countryOfOrigin ON products.id_countryoforigin = countryoforigin.id
        WHERE 
          products.id = $1
      `,
      [id],
    );

    // Get products in the same category with the current product
    const relatedProducts = await db.any(
      `
        SELECT products.* 
        FROM products
        WHERE 
          products.id_category = $1 AND
          products.id <> $2
        LIMIT 5
      `,
      [product.id_category, id],
    );

    return res.render('product_detail', {
      user,
      product: product,
      relatedProducts: relatedProducts,
      categories,
    });
  }
}

export default new CustomerProductController();
