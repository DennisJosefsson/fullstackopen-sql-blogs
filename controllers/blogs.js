const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')
const { Blog, User } = require('../models')
const { Op } = require('sequelize')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${req.query.search}%` } },
        { author: { [Op.iLike]: `%${req.query.search}%` } },
      ],
    }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    order: [['likes', 'DESC']],
    where,
  })
  console.log(JSON.stringify(blogs, null, 2))
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  const newBlog = await Blog.create({
    ...req.body,
    userId: user.id,
  })
  return res.json(newBlog)
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res, next) => {
  if (req.blog.userId === req.decodedToken.id) {
    await req.blog.destroy()
    res.status(200).json({ message: 'Blog deleted' })
  } else {
    throw Error('Unauthorized user')
  }
})

router.put('/:id', blogFinder, async (req, res, next) => {
  req.blog.likes = req.body.likes
  await req.blog.save()
  res.json(req.blog)
})

module.exports = router
