'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Client.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Client can't be null"
        },
        notEmpty: {
          msg: "Client can't be empty"
        },
      }
    },
    image: DataTypes.STRING,
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Address can't be null"
        },
        notEmpty: {
          msg: "Address can't be empty"
        },
      }
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "District can't be null"
        },
        notEmpty: {
          msg: "District can't be empty"
        },
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "City can't be null"
        },
        notEmpty: {
          msg: "City can't be empty"
        },
      }
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Client can't be null"
        },
        notEmpty: {
          msg: "Client can't be empty"
        },
      }
    },
    zipCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Zip Code can't be null"
        },
        notEmpty: {
          msg: "Zip Code can't be empty"
        },
      }
    },
  }, {
    sequelize,
    modelName: 'Client',
  });
  return Client;
};