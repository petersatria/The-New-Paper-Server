const { comparePassword, signToken } = require("../helpers/helper")
const { Customer, Article, Category, User } = require('../models')

class CustomerController {
  static async register(req, res, next) {
    try {
      const { email, password } = req.body

      const data = await Customer.create({
        email, password, role: 'Customer'
      })
      res.status(201).json({
        message: 'Success registered user',
        data: { id: data.id, email: data.email }
      })
    } catch (err) {
      next(err)
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body
      if (!email || !password) throw { name: 'EmailPasswordEmpty' }

      const data = await Customer.findOne({ where: { email } })
      if (!data) throw { name: 'EmailPasswordInvalid' }

      const isValidPassword = comparePassword(password, data.password)
      if (!isValidPassword) throw { name: 'EmailPasswordInvalid' }

      const access_token = signToken({ id: data.id })
      res.status(200).json({
        message: 'Success to login', access_token, id: data.id,
        role: data.role
      })
    } catch (err) {
      next(err)
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: req.headers.google_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      let user = await Customer.findOne({ where: { email: payload.email } })
      if (!user) {
        const { email } = payload
        user = await Customer.create({
          email, role: 'Customer',
          password: String(Math.random())
        })
      }
      const access_token = signToken({ id: user.id })
      res.status(200).json({
        message: 'Success to login', access_token, id: user.id,
        role: user.role
      })
    } catch (err) {
      next(err)
    }
  }

  static async articles(req, res, next) {
    try {
      const { page, filter } = req.query
      let limit = page?.size || 8
      let offset = page?.number || 1
      const options = {
        include: [{
          model: Category,
          attributes: ['name']
        }, {
          model: User,
          attributes: ['username', 'email']
        }],
        order: [['id', 'ASC']]
      }

      if (page) {
        if (page.size) {
          options.limit = limit
        }
        if (page.number) {
          options.offset = offset * limit - limit
        }
      } else {
        options.limit = limit
        options.offset = offset
      }

      if (filter) {
        options.include[0].where = { name: filter }

      }

      const data = await Article.findAndCountAll(options)
      res.status(200).json({
        message: 'Success get data', data,
        totalItems: data.count, totalPages: Math.ceil(data.count / limit),
        currentPage: page?.number || offset
      })
    } catch (err) {
      console.log(err);
      next(err)
    }
  }
}


module.exports = CustomerController