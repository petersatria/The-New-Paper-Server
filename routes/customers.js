const CustomerController = require("../controllers/CustomerController")
const router = require('express').Router()

router
  .get('/articles', CustomerController.articles)

module.exports = router