import { db } from '../models/index.js';

import seedData from './data.json' assert { type: 'json' };

const seed = async () => {
  try {
    // Clear the tables
    await db.none('DELETE FROM categories');
    await db.none('DELETE FROM colors');
    await db.none('DELETE FROM materials');
    await db.none('DELETE FROM countryOfOrigin');

    console.log('Tables cleared!');

    // Insert seed data into the tables
    for (let category of seedData.categories) {
      await db.none('INSERT INTO categories (name, description) VALUES ($1, $2)', [category.name, category.description]);
    }
    for (let color of seedData.colors) {
      await db.none('INSERT INTO colors (name, description) VALUES ($1, $2)', [color.name, color.description]);
    }
    for (let material of seedData.materials) {
      await db.none('INSERT INTO materials (name, description) VALUES ($1, $2)', [material.name, material.description]);
    }
    for (let country of seedData.countryOfOrigin) {
      await db.none('INSERT INTO countryOfOrigin (name, description) VALUES ($1, $2)', [country.name, country.description]);
    }

    console.log('Database seeded!');
  } catch (err) {
    console.error(err);
  }
};

seed();
