'use strict';

const { formatedAge, formatedDate } = require('../helpers/formated')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserDetail.belongsTo(models.User)
    }

    get age() {
      return formatedAge(this.dateOfBirth)
    }

    get date() {
      return formatedDate(this.dateOfBirth)
    }

  }
  UserDetail.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    jobTitle: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    image: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    address: DataTypes.TEXT,
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "User can't be null"
        },
        notEmpty: {
          msg: "User can't be empty"
        },
      }
    },
  }, {
    sequelize,
    modelName: 'UserDetail',
  });
  return UserDetail;
};