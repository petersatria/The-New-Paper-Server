const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env
const { JWT_SECRET_CUSTOMER } = process.env
function hashPassword(password) {
  return bcrypt.hashSync(password, 10)
}

function comparePassword(password, hashPassword) {
  return bcrypt.compareSync(password, hashPassword)
}

function signToken(payload, isCustomer) {
  if (isCustomer) {
    return jwt.sign(payload, JWT_SECRET_CUSTOMER)
  }
  return jwt.sign(payload, JWT_SECRET)
}

function verifyToken(token, isCustomer) {
  if (isCustomer) {
    return jwt.verify(token, JWT_SECRET_CUSTOMER)
  }
  return jwt.verify(token, JWT_SECRET)
}


module.exports = { hashPassword, comparePassword, signToken, verifyToken }