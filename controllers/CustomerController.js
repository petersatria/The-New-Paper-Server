const { Op } = require("sequelize")
const { comparePassword, signToken } = require("../helpers/helper")
const { Customer, Article, Category, User, Bookmark } = require('../models')
const { default: axios } = require("axios")

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

      const access_token = signToken({ id: data.id }, true)
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
      const options = {
        include: [{
          model: Category,
          attributes: ['name']
        }, {
          model: User,
          attributes: ['username', 'email']
        }],
        order: [['updatedAt', 'DESC']]
      }

      if (page) {
        if (page.size) {
          options.limit = page.size
        }
        if (page.number) {
          options.offset = page.number * page.size - page.size
        }
      }

      if (filter) {
        const query = filter.category.split(',').map(e => ({ [Op.eq]: e }))
        options.where = { categoryId: { [Op.or]: query } }
      }

      const data = await Article.findAndCountAll(options)
      res.status(200).json({
        message: 'Success get data', data,
        totalItems: data.count, totalPages: Math.ceil(data.count / page?.size || 1),
        currentPage: +page?.number || 1
      })
    } catch (err) {
      next(err)
    }
  }

  static async findArticle(req, res, next) {
    const { id } = req.params
    try {
      const options = {
        include: [{
          model: Category,
          attributes: ['name']
        }, {
          model: User,
          attributes: ['username', 'email']
        }]
      }

      const data = await Article.findByPk(id, options)
      if (!data) throw { name: 'NotFound' }
      res.status(200).json({ message: 'Success get data', data })
    } catch (err) {
      next(err)
    }
  }

  static async bookmarks(req, res, next) {
    try {
      const { CustomerId } = req.user
      const data = await Bookmark.findAll({ include: ['Article'], where: { CustomerId } })
      res.status(200).json({ message: 'Success get data', data })
    } catch (err) {
      next(err)
    }
  }

  static async addBookmark(req, res, next) {
    try {
      const { CustomerId } = req.user
      const { ArticleId } = req.params

      const data = await Article.findByPk(ArticleId)
      if (!data) throw { name: 'NotFound' }

      const isAdded = await Bookmark.findOne({ where: { ArticleId } })
      if (isAdded) throw { name: 'BookmarkedArticle' }

      const bookmarks = await Bookmark.create({ CustomerId, ArticleId })
      res.status(201).json({
        message: 'Success added article to bookmarks',
        data: { id: bookmarks.id, CustomerId, ArticleId }
      })

    } catch (err) {
      next(err)
    }
  }

  static async generateQR(req, res, next) {
    try {
      const { id } = req.params
      const { data } = await axios({
        method: 'POST',
        url: `https://api.qr-code-generator.com/v1/create?access-token=${process.env.QR_TOKEN}`,
        data: {
          "frame_name": "no-frame",
          "qr_code_text": "http://localhost:8080/articles/" + id,
          "image_format": "SVG",
          "qr_code_logo": "scan-me-square"
        }
      })
      res.status(200).send(data)
    } catch (err) {
      next(err)
    }
  }

}


module.exports = CustomerController