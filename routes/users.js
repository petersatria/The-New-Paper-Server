const UserController = require("../controllers/UserController")
const router = require('express').Router()

router
  .post('/register', UserController.register)
  .post('/login', UserController.login)
  .post('/google-sign-in', UserController.googleLogin)

module.exports = router