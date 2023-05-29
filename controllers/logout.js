const router = require('express').Router()
const { Session } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.delete('/', tokenExtractor, async (req, res, next) => {
  if (req.decodedToken.id) {
    await Session.destroy({ where: { userId: req.decodedToken.id } })
    res.status(200).json({ message: 'User logged out' })
  } else {
    throw new Error('User not logged in.')
  }
})

module.exports = router
