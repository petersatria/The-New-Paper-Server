const { Article, Category, User, History } = require('../models')

class Controller {
  static async createArticle(req, res, next) {
    try {
      const { title, content, imgUrl, categoryId } = req.body
      const authorId = req.user.id
      const data = await Article.create({ title, content, imgUrl, authorId, categoryId, status: 'Active' })
      const author = await User.findByPk(authorId)
      await History.create({
        name: data.title, description: `New article with id ${data.id} created`,
        updatedBy: author.email
      })
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
        }],
        order: [['updatedAt', 'DESC']]
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

  static async updateArticle(req, res, next) {
    try {
      const { id } = req.params
      const data = await Article.findByPk(id)
      if (!data) throw { name: 'NotFound' }

      const { title, content, imgUrl, categoryId } = req.body
      await Article.update(
        { title, content, imgUrl, categoryId },
        { where: { id } }
      )
      const author = await User.findByPk(req.user.id)
      let message = `Article with id ${data.id} updated`
      await History.create({ name: data.title, description: message, updatedBy: author.email })
      res.status(200).json({ message })
    } catch (err) {
      next(err)
    }
  }

  static async changeStatusArticle(req, res, next) {
    try {
      const { id } = req.params
      const data = await Article.findByPk(id)
      if (!data) throw { name: 'NotFound' }

      const { status } = req.body
      if (status !== 'Active' && status !== 'Inactive' && status !== 'Archived') throw { name: 'StatusInvalid' }

      await Article.update({ status }, { where: { id } })
      const author = await User.findByPk(req.user.id)
      let message = `Article with id ${id} has been updated from ${data.status} to ${status}`
      await History.create({ name: data.title, description: message, updatedBy: author.email })
      res.status(200).json({ message })
    } catch (err) {
      next(err)
    }
  }

  static async history(req, res, next) {
    try {
      const data = await History.findAll({ order: [['createdAt', 'DESC']] })
      res.status(200).json({ message: 'Success get data', data })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = Controller