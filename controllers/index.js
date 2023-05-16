const { Article, Category, User } = require('../models')

class Controller {
  static async createArticle(req, res, next) {
    try {
      const { title, content, imgUrl, categoryId } = req.body
      const data = await Article.create({ title, content, imgUrl, authorId: req.user.id, categoryId })
      res.status(201).json({ message: 'Success create article', data })
    } catch (err) {
      next(err)
    }
  }

  static async articles(req, res, next) {
    try {
      const data = await Article.findAll({
        include: [{
          model: Category,
          attributes: ['name']
        }, {
          model: User,
          attributes: ['username', 'email']
        }]
      })
      res.status(200).json({ message: 'Success get data', data })
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
  static async deleteArticle(req, res, next) {
    try {
      const { id } = req.params
      const article = await Article.findByPk(id)
      const data = await Article.destroy({ where: { id } })
      if (data === 0) throw { name: 'NotFound' }
      res.status(200).json({ message: 'Article sucess to delete', data: article })
    } catch (err) {
      next(err)
    }
  }
  static async findCategories(req, res, next) {
    try {
      const data = await Category.findAll()
      res.status(200).json({ message: 'Success get data', data })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = Controller