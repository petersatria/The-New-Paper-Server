const CustomerController = require("../controllers/CustomerController")
const UserController = require("../controllers/UserController")
const router = require('express').Router()

router
  .post('/register', UserController.register)
  .post('/login', UserController.login)
  .post('/google-sign-in', UserController.googleLogin)
  .post('/api/register', CustomerController.register)
  .post('/api/login', CustomerController.login)
  .post('/api/google-sign-in', CustomerController.googleLogin)


module.exports = router