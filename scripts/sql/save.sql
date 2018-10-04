-- Tekur gögn úr books töflu og vistar sem CSV í /tmp/books.csv
COPY (
  SELECT
    title, description, ingredients, instructions, course, cuisine, type, image
  FROM
    recipes
  ORDER BY title
) TO '/tmp/updatedRecipes.txt';
