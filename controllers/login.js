const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { User, Session } = require('../models')

const { JWT_SECRET } = require('../util/config')

router.post('/', async (req, res) => {
  const user = await User.findOne({ where: { userName: req.body.userName } })
  if (!user) {
    throw new Error('No such userName')
  }
  if (!user.authenticate(req.body.password)) {
    throw new Error('Wrong password')
  }
  if (user.disabled) {
    throw new Error('User is disabled, contact admin if you have questions.')
  }

  const userForToken = {
    userName: user.userName,
    id: user.id,
  }

  const token = jwt.sign(userForToken, JWT_SECRET)

  await Session.create({
    token,
    userId: user.id,
  })
  res.status(200).json({ token, userName: user.userName, name: user.name })
})

module.exports = router
