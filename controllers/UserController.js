const { comparePassword, signToken } = require("../helpers/helper")
const { Article, Category, User } = require('../models')

class UserController {
  static async register(req, res, next) {
    try {
      const { username, email, password, phoneNumber, address } = req.body
      const data = await User.create({
        username, email, password, phoneNumber: phoneNumber || '', address: address || '', role: 'Admin'
      })
      res.status(201).json({
        message: 'Success registered user',
        data: { id: data.id, email: data.email, username: data.username }
      })
    } catch (err) {
      next(err)
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body
      if (!email || !password) throw { name: 'EmailPasswordEmpty' }

      const data = await User.findOne({ where: { email } })
      if (!data) throw { name: 'EmailPasswordInvalid' }

      const isValidPassword = comparePassword(password, data.password)
      if (!isValidPassword) throw { name: 'EmailPasswordInvalid' }

      const access_token = signToken({ id: data.id })
      res.status(200).json({ message: 'Success to login', access_token, username: data.username, role: data.role })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = UserController