const router = require('express').Router()
const { Op } = require('sequelize')
const { User, Blog } = require('../models')

router.post('/', async (req, res, next) => {
  const newUser = await User.create(req.body)
  res.json(newUser)
})

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['id', 'password'] },
    include: {
      model: Blog,
      attributes: ['title'],
    },
  })
  console.log(JSON.stringify(users, null, 2))
  res.json(users)
})

router.get('/:id', async (req, res) => {
  let where = {}

  if (req.query.read) {
    req.query.read === 'true' ? (where.read = true) : (where.read = false)
  }
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [''] },
    include: {
      model: Blog,
      as: 'readings',
      attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
      through: {
        attributes: ['id', 'read'],
        where,
      },
    },
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
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
