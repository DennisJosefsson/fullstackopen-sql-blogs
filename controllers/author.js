const router = require('express').Router()

const { Blog } = require('../models')
const { sequelize } = require('../util/db')

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('author')), 'authorCount'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'sumLikes'],
    ],
    group: 'author',
    order: [['sumLikes', 'DESC']],
  })
  res.status(200).json(authors)
})

module.exports = router
