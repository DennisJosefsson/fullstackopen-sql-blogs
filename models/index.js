const Blog = require('./Blog')
const User = require('./User')
const Readinglist = require('./ReadingList')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: Readinglist, as: 'readings' })
Blog.belongsToMany(User, { through: Readinglist, as: 'listed_readings' })

module.exports = { Blog, User, Readinglist }
