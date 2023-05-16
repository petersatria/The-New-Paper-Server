const { comparePassword, signToken } = require("../helpers/helper")
const { Article, Category, User } = require('../models')

class UserController {
  static async register(req, res) {
    try {
      const { email, password } = req.body
      const data = await User.create({ email, password, role: 'admin' })
      res.status(201).json({ message: 'Success registered user', data: { id: data.id, email: data.email } })
    } catch (err) {
      if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: err.errors[0].message })
      }
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body
      if (!email || !password) throw 'EMPTY'

      const data = await User.findOne({ where: { email } })
      if (!data) throw 'NOTFOUND'

      const isValidPassword = comparePassword(password, data.password)
      if (!isValidPassword) throw 'NOTVALID'

      const access_token = signToken({ email, role: data.role, username: data.username })

      res.status(200).json({ message: 'Success to login', access_token })

    } catch (err) {
      if (err === 'NOTFOUND') {
        return res.status(404).json({ message: 'Email is not registered yet' })
      }
      if (err === 'EMPTY') {
        return res.status(400).json({ message: 'Email / password is required' })
      }
      if (err === 'NOTVALID') {
        return res.status(401).json({ message: 'Email / password is not valid' })
      }
    }
  }
}

module.exports = UserController