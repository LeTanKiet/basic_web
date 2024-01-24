import { db } from '../models/index.js';

class SearchController {
  async index(req, res) {
    const { userId } = req.context;
    const user = await db.oneOrNone('select * from "users" where id = $1', userId);

    // Query all categories from the database
    const categoriesObj = await db.any('select name from "categories"');
    const categories = categoriesObj.map((category) => category.name);

    // Get the search query from the URL
    const searchQuery = req.query.search_query;

    // If there is no search query, render the results page with an empty results array
    if (!searchQuery) {
      return res.render('results', {
        user,
        searchQuery,
        results: [],
      });
    }

    // If there is a search query, search in the database for products that match the query
    const results = await db.any('select * from "products" where name ilike $1', [`%${searchQuery}%`]);

    return res.render('results', {
      user,
      categories,
      searchQuery,
      results,
    });
  }
}

export default new SearchController();
