const express = require('express');
const { requireAuth } = require('../auth');

const router = express.Router();

const {
  recipesRoute,
  recipesPostRoute,
  recipeRoute,
  recipePatchRoute,
} = require('./recipes');

const {
  usersRoute,
  userRoute,
  meRoute,
  mePatchRoute,
  meProfileRouteWithMulter,
} = require('./users');

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

function indexRoute(req, res) {
  return res.json({
    authentication: {
      register: '/register',
      login: '/login',
    },
    recipes: {
      recipes: '/recipes',
      recipe: '/recipe/{id}',
    },
    // categories: '/categories',
    users: {
      users: '/users',
      user: '/users/{id}',
      // read: '/users/{id}/read',
    },
    me: {
      me: '/users/me',
      profile: '/users/me/profile',
      // read: '/users/me/read',
    },
  });
}

router.get('/', indexRoute);

router.get('/users', requireAuth, catchErrors(usersRoute));
router.get('/users/me', requireAuth, catchErrors(meRoute));
router.get('/users/:id', requireAuth, catchErrors(userRoute));
router.patch('/users/me', requireAuth, catchErrors(mePatchRoute));
router.post('/users/me/profile', requireAuth, catchErrors(meProfileRouteWithMulter));
router.get('/recipes', catchErrors(recipesRoute));
router.post('/recipes', requireAuth, catchErrors(recipesPostRoute));
router.get('/recipes/:id', catchErrors(recipeRoute));
router.patch('/recipes/:id', requireAuth, catchErrors(recipePatchRoute));
// router.get('/users/me/posts', requireAuth, catchErrors(mePostsRoute));
// router.get('/users/:id/posts', requireAuth, catchErrors(userPostsRoute));

module.exports = router;
