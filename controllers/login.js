const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { User } = require('../models')

const { JWT_SECRET } = require('../util/config')

router.post('/', async (req, res) => {
  const user = await User.findOne({ where: { userName: req.body.userName } })
  if (!user) {
    throw Error('No such userName')
  }
  if (!user.authenticate(req.body.password)) {
    throw Error('Wrong password')
  }

  const userForToken = {
    userName: user.userName,
    id: user.id,
  }

  const token = jwt.sign(userForToken, JWT_SECRET)

  res.status(200).json({ token, userName: user.userName, name: user.name })
})

module.exports = router
