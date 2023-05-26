const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      validate: {
        min: { args: [1991], msg: "Year can't be earlier than 1991" },
        max: {
          args: [Number(`{new Date.getFullYear()}`)],
          msg: "Year can't be future year",
        },
      },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'year')
  },
}
