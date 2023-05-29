const { Model, DataTypes } = require('sequelize')
const useBcrypt = require('sequelize-bcrypt')

const { sequelize } = require('../util/db')

class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.TEXT, allowNull: false },
    userName: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: { type: DataTypes.STRING, allowNull: false },
    disabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'user',
  }
)

useBcrypt(User, { field: 'password', compare: 'authenticate' })

module.exports = User
