const Controller = require("../controllers")
const authorization = require("../middleware/authorization")
const authorizationStatus = require("../middleware/authorizationStatus")
const router = require('express').Router()

router
  .post('/', Controller.createArticle)
  .get('/', Controller.articles)
  .get('/:id', Controller.findArticle)
  .delete('/:id', authorization, Controller.deleteArticle)
  .put('/:id', authorization, Controller.updateArticle)
  .patch('/:id', authorizationStatus, Controller.changeStatusArticle)


module.exports = router