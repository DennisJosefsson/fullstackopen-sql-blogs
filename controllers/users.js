const router = require('express').Router()

const { User, Blog } = require('../models')

router.post('/', async (req, res, next) => {
  const newUser = await User.create(req.body)
  res.json(newUser)
})

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  })
  res.json(users)
})

router.put('/:userName', async (req, res, next) => {
  const user = await User.findOne({ where: { userName: req.params.userName } })
  console.log(user)
  if (!user) {
    throw Error('User not found')
  } else {
    user.userName = req.body.userName
    await user.save()
    res.json(user)
  }
})

module.exports = router
