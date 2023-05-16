const Controller = require("../controllers")
const authorization = require("../middleware/authorization")
const router = require('express').Router()

router
  .post('/', Controller.createArticle)
  .get('/', Controller.articles)
  .get('/:id', Controller.findArticle)
  .delete('/:id', authorization, Controller.deleteArticle)

module.exports = router