const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env
function hashPassword(password) {
  return bcrypt.hashSync(password, 10)
}

function comparePassword(password, hashPassword) {
  return bcrypt.compareSync(password, hashPassword)
}

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET)
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET)
}

module.exports = { hashPassword, comparePassword, signToken, verifyToken }