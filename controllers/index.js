const { Article, Category, User } = require('../models')

class Controller {
  static async createArticle(req, res) {
    try {
      const { title, content, imgUrl, authorId, categoryId } = req.body
      const data = await Article.create({ title, content, imgUrl, authorId, categoryId })
      res.status(201).json({ message: 'Success create article', data })
    } catch (err) {
      if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({ message: err.errors[0].message })
      }
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  static async articles(req, res) {
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
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  static async findArticle(req, res) {
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
      if (!data) {
        throw 'NOTFOUND'
      }
      res.status(200).json({ message: 'Success get data', data })
    } catch (err) {
      if (err === 'NOTFOUND') {
        return res.status(404).json({ message: 'Article is not found' })
      }
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
  static async deleteArticle(req, res) {
    const { id } = req.params
    try {
      const article = await Article.findByPk(id)
      const data = await Article.destroy({ where: { id } })
      if (data === 0) {
        throw 'NOTFOUND'
      }
      res.status(200).json({ message: 'Article sucess to delete', data: article })
    } catch (err) {
      if (err === 'NOTFOUND') {
        return res.status(404).json({ message: 'Article is not found' })
      }
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
  static async findCategories(req, res) {
    try {
      const data = await Category.findAll()
      res.status(200).json({ message: 'Success get data', data })
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}

module.exports = Controller