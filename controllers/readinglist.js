const router = require('express').Router()
const { Readinglist } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res) => {
  const listItem = await Readinglist.create(req.body)
  res.json(listItem)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const listItem = await Readinglist.findByPk(req.params.id)
  if (listItem.userId === req.decodedToken.id) {
    listItem.read = req.body.read
    await listItem.save()
    res.json(listItem)
  } else {
    throw new Error('Unauthorized user')
  }
})

module.exports = router
