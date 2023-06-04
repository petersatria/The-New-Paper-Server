const CustomerController = require("../controllers/CustomerController")
const customerAuthentication = require("../middleware/customerAuthentication")
const router = require('express').Router()

router
  .get('/articles', CustomerController.articles)
  .get('/articles/:id', CustomerController.findArticle)
  .get('/bookmarks', customerAuthentication, CustomerController.bookmarks)
  .post('/bookmarks/:ArticleId', customerAuthentication, CustomerController.addBookmark)
  .post('/articles/:id', CustomerController.generateQR)
  .get('/categories', CustomerController.findCategories)

module.exports = router