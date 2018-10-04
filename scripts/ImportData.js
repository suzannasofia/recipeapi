require('dotenv').config();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var fs = require("fs");

const { query } = require('../db');

async function importRecipe(data) {
  const q = `
    INSERT INTO
      recipes
      (title, description, ingredients, instructions, course, cuisine, type, image)
    VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8)`;

  const values = [
    data.title,
    data.description,
    data.ingredients,
    data.instructions,
    data.course,
    data.cuisine,
    data.type,
    data.image
  ];

  return query(q, values);

}

async function importData() {
  console.info('Starting import');

  var content = fs.readFileSync("data/recipes.txt", "utf8");

  data = JSON.parse(content);

  for (let i = 0; i < data.recipes.length; i += 1) {
    await importRecipe(data.recipes[i]);
    // console.info(`Imported ${data.recipes[i].title}`);
  }

  console.log('Finished!');

}

importData().catch((err) => {
  console.error('Error importing', err);
});
// importData();
