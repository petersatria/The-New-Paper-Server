const Controller = require("../controllers")

const router = require('express').Router()


router
  .post('/articles', Controller.createArticle)
  .get('/articles', Controller.articles)
  .get('/articles/:id', Controller.findArticle)
  .delete('/articles/:id', Controller.deleteArticle)
  .get('/categories', Controller.findCategories)

module.exports = router