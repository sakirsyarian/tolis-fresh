'use strict';

const bycrypt = require('bcryptjs')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role)
      User.hasOne(models.UserDetail)
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Username can't be null"
        },
        notEmpty: {
          msg: "Username can't be empty"
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Email can't be null"
        },
        notEmpty: {
          msg: "Email can't be empty"
        },
        isEmail: {
          msg: "You must enter a valid email"
        },
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password can't be null"
        },
        notEmpty: {
          msg: "Password can't be empty"
        },
      }
    },
    RoleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((user, options) => {
    const salt = bycrypt.genSaltSync(10)
    const hash = bycrypt.hashSync(user.password, salt)
    user.password = hash
  })

  User.beforeUpdate((user, options) => {
    const salt = bycrypt.genSaltSync(10)
    const hash = bycrypt.hashSync(user.password, salt)
    user.password = hash
  })

  return User;
};