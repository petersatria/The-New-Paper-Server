const { comparePassword, signToken } = require("../helpers/helper")
const { Article, Category, User } = require('../models')
const { OAuth2Client } = require('google-auth-library');

class UserController {
  static async register(req, res, next) {
    try {
      const { username, email, password, phoneNumber, address } = req.body
      const data = await User.create({
        username, email, password, phoneNumber: phoneNumber || '', address: address || '', role: 'Admin'
      })
      res.status(201).json({
        message: 'Success registered user',
        data: { id: data.id, email: data.email, username: data.username }
      })
    } catch (err) {
      next(err)
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body
      if (!email || !password) throw { name: 'EmailPasswordEmpty' }

      const data = await User.findOne({ where: { email } })
      if (!data) throw { name: 'EmailPasswordInvalid' }

      const isValidPassword = comparePassword(password, data.password)
      if (!isValidPassword) throw { name: 'EmailPasswordInvalid' }

      const access_token = signToken({ id: data.id })
      res.status(200).json({
        message: 'Success to login', access_token, id: data.id,
        username: data.username, role: data.role
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

      let user = await User.findOne({ where: { email: payload.email } })
      if (!user) {
        const { email, name } = payload
        user = await User.create({
          username: name.split(' ').join('').toLowerCase(),
          email, phoneNumber: '', address: '', role: 'Staff',
          password: String(Math.random())
        })
      }
      const access_token = signToken({ id: user.id })
      res.status(200).json({
        message: 'Success to login', access_token, id: user.id,
        username: user.username, role: user.role
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = UserController