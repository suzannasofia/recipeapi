# Recipe API

Recipe REST API for https://simple-recipe.herokuapp.com/ 

(https://github.com/suzannasofia/simplerecipe)

Runs on https://simplerecipe-api.herokuapp.com/

## Starting the application

* Clone repositiry from Git and run `npm install`
* Create database for project, e.g. `recipeapi`
* Set `DATABASE_URL` in `.env` file
* Run script to create schema, `node scripts/query schema.sql`
* Run script to import data, `node scripts/importData`
* Set other `.env` values:
  - `PORT`, port for server to run on
  - `HOST`, host for server to run on
  - `JWT_SECRET`, secret for token
  - `JWT_TOKEN_LIFETIME`, token's lifetime in seconds
  - `CLOUDINARY_URL`, configuration for cloudinary, retrieved from cloudinary console
  - `CLOUDINARY_CLOUD`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
* Run with `npm start`
