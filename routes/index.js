const Controller = require("../controllers")

const router = require('express').Router()

router
  .use('/', require('./users'))
  .use('/articles', require('./articles'))
  .get('/categories', Controller.findCategories)

module.exports = router