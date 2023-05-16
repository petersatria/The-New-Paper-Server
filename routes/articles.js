const Controller = require("../controllers")
const router = require('express').Router()

router
  .post('/', Controller.createArticle)
  .get('/', Controller.articles)
  .get('/:id', Controller.findArticle)
  .delete('/:id', Controller.deleteArticle)

module.exports = router