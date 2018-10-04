const users = require('./users');
const { query } = require('./db');

const invalidField = (s, maxlen) => {
  if (s !== undefined && typeof s !== 'string') {
    return true;
  }

  if (maxlen && s && s.length) {
    return s.length > maxlen;
  }

  return false;
};
const isEmpty = s => s != null && !s;

async function validateUser({ username, password, name }, patch = false) {
  const validationMessages = [];

  // can't patch username
  if (!patch) {
    const m = 'Username is required, must be at least three letters and no more than 32 characters';
    if (typeof username !== 'string' || username.length < 3 || username.length > 32) {
      validationMessages.push({ field: 'username', message: m });
    }

    const user = await users.findByUsername(username);

    if (user) {
      validationMessages.push({
        field: 'username',
        message: 'Username is already registered',
      });
    }
  }

  if (!patch || password || isEmpty(password)) {
    if (typeof password !== 'string' || password.length < 6) {
      validationMessages.push({
        field: 'password',
        message: 'Password must be at least six letters',
      });
    }
  }

  if (!patch || name || isEmpty(name)) {
    if (typeof name !== 'string' || name.length === 0 || name.length > 64) {
      validationMessages.push({
        field: 'name',
        message: 'Name is required, must not be empty or longar than 64 characters',
      });
    }
  }

  return validationMessages;
}

async function validateRecipe({
  title,
  description,
  ingredients,
  instructions,
  course,
  cuisine,
  type,
  image, //ath change this one later into image instead of url string
} = {}, id = null, patch = false) {
  const messages = [];

  if (!patch || title || isEmpty(title)) {
    if ((typeof title !== 'string' || title.length === 0 || title.length > 255)) {
      messages.push({
        field: 'title',
        message: 'Title is required and must not be empty and no longer than 255 characters',
      });
    }
  }

  if (!patch || title || isEmpty(title)) {
    const recipe = await query('SELECT * FROM recipes WHERE title = $1', [title]);

    // leyfum að uppfæra titil í sama titil
    if (recipe.rows.length > 0 && (Number(recipe.rows[0].id) !== Number(id))) {
      messages.push({ field: 'title', message: `Recipe "${title}" already exists` });
    }
  }

  if (invalidField(description)) {
    messages.push({ field: 'description', message: 'Description must be a string' });
  }

  if (invalidField(ingredients)) {
    messages.push({ field: 'ingredients', message: 'Ingredients must be a string' });
  }

  if (invalidField(instructions)) {
    messages.push({ field: 'instructions', message: 'Instructions must be a string' });
  }

  if (invalidField(course, 50)) {
  const message = 'Published must be a string, no more than 50 characters';
  messages.push({ field: 'published', message });
  }

  if (invalidField(cuisine, 30)) {
  const message = 'Published must be a string, no more than 30 characters';
  messages.push({ field: 'published', message });
  }

  if (invalidField(type, 30)) {
  const message = 'Published must be a string, no more than 30 characters';
  messages.push({ field: 'published', message });
  }

  if (invalidField(image)) { //ath change this one later into image
    messages.push({ field: 'image', message: 'image url must be a string' });
  }

  return messages;
}

module.exports = {
  validateRecipe,
  validateUser,
};
