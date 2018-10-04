const xss = require('xss');
const { paged, query, conditionalUpdate } = require('../db');
const { validateRecipe } = require('../validation');

async function recipesRoute(req, res) {
  const { offset = 0, limit = 20, search = '' } = req.query;

  let q = `
    SELECT *
    FROM recipes
    ORDER BY title ASC
    `;
    const values = [];

    if (typeof search === 'string' && search !== '') {
      q = `
        SELECT *
        FROM recipes
        WHERE
          to_tsvector('english', title) @@ plainto_tsquery('english', $1)
          OR
          to_tsvector('english', description) @@ plainto_tsquery('english', $1)
          ORDER BY title ASC
          `;
          values.push(search);
    }

    const recipes = await paged(q, { offset, limit, values });

    return res.json(recipes);
}

async function recipesPostRoute(req, res) {
  const validationMessage = await validateRecipe(req.body);

  if (validationMessage.length > 0) {
    return res.status(400).json({errors: validationMessage});
  }

  const q = `INSERT INTO recipes
    (title, description, ingredients, instructions, course, cuisine, type, image)
    values($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`;

    const data = [
    xss(req.body.title),
    xss(req.body.description),
    xss(req.body.ingredients),
    xss(req.body.instructions),
    xss(req.body.course),
    xss(req.body.cuisine),
    xss(req.body.type),
    xss(req.body.image),
  ];

  const result = await query(q, data);

  return res.status(201).json(result.rows[0]);
}

async function recipeRoute(req, res) {
  const { id } = req.params;

  if (!Number.isInteger(Number(id))) {
    return res.status(404).json({error: 'Recipe not found'});
  }

  const recipe = await query(`
    SELECT *
    FROM recipes
    WHERE id = $1
    `, [id]);

    if (recipe.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    return res.json(recipe.rows[0]);
}

async function recipePatchRoute(req, res) {
  const { id } = req.params;

  if (!Number.isInteger(Number(id))) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  const recipe = await query('SELECT * FROM recipe WHERE id = $1', [id]);

  if (recipe.rows.length === 0) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  const validationMessage = await validateRecipe(req.body, id, true);

  if (validationMessage.length > 0) {
    return res.status(400).json({ errors: validationMessage });
  }

  const isset = f => typeof f === 'string' || typeof f === 'number';

  const fields = [
    isset(req.body.title) ? 'title' : null,
    isset(req.body.description) ? 'description' : null,
    isset(req.body.ingredients) ? 'ingredients' : null,
    isset(req.body.instructions) ? 'instructions' : null,
    isset(req.body.course) ? 'course' : null,
    isset(req.body.cuisine) ? 'cuisine' : null,
    isset(req.body.type) ? 'type' : null,
    isset(req.body.image) ? 'image' : null,
  ];

  const values = [
    isset(req.body.title) ? xss(req.body.title) : null,
    isset(req.body.description) ? xss(req.body.description) : null,
    isset(req.body.ingredients) ? xss(req.body.ingredients) : null,
    isset(req.body.instructions) ? xss(req.body.instructions) : null,
    isset(req.body.course) ? xss(req.body.course) : null,
    isset(req.body.cuisine) ? xss(req.body.cuisine) : null,
    isset(req.body.type) ? xss(req.body.type) : null,
    isset(req.body.image) ? xss(req.body.image) : null,
  ];

  const result = await conditionalUpdate('recipes', id, fields, values);

  if (!result) {
    return res.status(400).json({ error: 'Nothing to patch' });
  }

  return res.status(201).json(result.rows[0]);
}

module.exports = {
  recipesRoute,
  recipesPostRoute,
  recipeRoute,
  recipePatchRoute,
};
