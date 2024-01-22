import { db } from '../models/index.js';

const product = {
  name: 'Bed',
  description: 'A 76inch x 80inch bed.',
  price: 559,
  image: 'image_url',
  sold: 14,
  category: 'Beds',
  color: 'Neutral',
  material: 'Wood',
  country: 'Italy',
};
const category = await db.one('SELECT id FROM categories WHERE name = $1', [product.category]);
console.log(category);

const color = await db.one('SELECT id FROM colors WHERE name = $1', [product.color]);
console.log(color);

const material = await db.one('SELECT id FROM materials WHERE name = $1', [product.material]);
console.log(material);

const country = await db.one('SELECT id FROM countryOfOrigin WHERE name = $1', [product.country]);
console.log(country);

await db.none(
  'INSERT INTO products (name, description, price, image, sold, id_category, id_color, id_material, id_countryoforigin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
  [
    product.name,
    product.description,
    product.price,
    product.image,
    product.sold,
    category.id,
    color.id,
    material.id,
    country.id,
  ],
);
console.log('Done!');

// import { db } from '../models/index.js';
// const productId = 66;
// const productFullInfo = await db.one(
//   `
//   SELECT 
//     products.name, 
//     products.description, 
//     products.price, 
//     products.image, 
//     products.sold, 
//     categories.name AS id_category, 
//     colors.name AS id_color, 
//     materials.name AS id_material, 
//     countryOfOrigin.name AS id_countryoforigin
//   FROM 
//     products
//   INNER JOIN categories ON products.id_category = categories.id
//   INNER JOIN colors ON products.id_color = colors.id
//   INNER JOIN materials ON products.id_material = materials.id
//   INNER JOIN countryOfOrigin ON products.id_countryoforigin = countryOfOrigin.id
//   WHERE 
//     products.id = $1
// `,
//   [productId],
// );
// console.log(productFullInfo);
