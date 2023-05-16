const { verifyToken } = require("../helpers/helper")
const { User } = require('../models')

module.exports = async (req, res, next) => {
  try {
    const { access_token } = req.headers
    if (!access_token) throw { name: 'Unauthenticated' }
    const payload = verifyToken(access_token)
    const user = await User.findByPk(payload.id)
    if (!user) throw { name: 'Unauthenticated' }

    req.user = { id: user.id, role: user.role }
    next()
  } catch (err) {
    next(err)
  }
}

