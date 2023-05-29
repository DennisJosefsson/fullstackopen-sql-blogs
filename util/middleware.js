const { JWT_SECRET } = require('./config')
const { Session, User } = require('../models')
const jwt = require('jsonwebtoken')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('Authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), JWT_SECRET)
      const user = await User.findByPk(req.decodedToken.id)
      if (user.disabled) {
        return res.status(401).json({
          error: 'User is disabled, contact admin if you have questions.',
        })
      }
      const session = await Session.findOne({
        where: { token: authorization.substring(7) },
      })
      console.log(session)
      if (!session) {
        return res.status(401).json({ error: 'Token expired, log in again' })
      }
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const errorHandler = (error, request, response, next) => {
  // console.log('error message: ', error.message)
  // console.log('error name: ', error.name)
  // console.log('errors: ', error.errors)
  if (error.message.includes('properties of null')) {
    return response.status(400).json({ error: error.message })
  }
  if (error.message.includes('cannot be null')) {
    return response.status(400).json({ error: error.message })
  }
  if (error.message.includes('Validation isEmail on userName failed')) {
    return response
      .status(400)
      .json({ error: 'userName must be a valid email address' })
  }
  if (error.message === 'Wrong password') {
    return response.status(400).json({ error: error.message })
  }
  if (
    error.message === 'No such userName' ||
    error.message === 'User not found'
  ) {
    return response.status(400).json({ error: error.message })
  }
  if (error.message.includes('Unauthorized')) {
    return response.status(401).json({ error: error.message })
  }
  if (error.message.includes('disabled')) {
    return response.status(401).json({ error: error.message })
  }
  if (error.message.includes('earlier than 1991')) {
    return response.status(400).json({ error: error.message })
  }
  if (error.message.includes('expired')) {
    return response.status(400).json({ error: error.message })
  }
  if (error.message.includes('future year')) {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = { errorHandler, tokenExtractor }
