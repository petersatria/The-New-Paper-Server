const { Article } = require('../models')

module.exports = async (req, res, next) => {
  try {
    const { id, role } = req.user
    const article = await Article.findByPk(req.params.id)
    if (!article) throw { name: 'NotFound' }
    if (role.toLowerCase() !== 'admin') {
      if (id !== article.authorId) throw { name: 'Forbidden' }
    }
    next()
  } catch (err) {
    next(err)
  }
}

