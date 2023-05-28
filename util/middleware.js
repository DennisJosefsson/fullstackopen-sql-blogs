const { JWT_SECRET } = require('./config')
const jwt = require('jsonwebtoken')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('Authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), JWT_SECRET)
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
  if (error.message.includes('earlier than 1991')) {
    return response.status(400).json({ error: error.message })
  }
  if (error.message.includes('future year')) {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = { errorHandler, tokenExtractor }
