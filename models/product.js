'use strict';

const { formatedNumber, formatedDate } = require('../helpers/formated')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category)
      Product.belongsTo(models.Partner)
    }

    get currencyId() {
      return formatedNumber(this.price)
    }

    get dateOfExpired() {
      return formatedDate(this.expired)
    }

  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name can't be null"
        },
        notEmpty: {
          msg: "Name can't be empty"
        },
      }
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Price can't be null"
        },
        notEmpty: {
          msg: "Price can't be empty"
        },
        min: {
          args: 1,
          msg: "Price must be greater than one"
        }
      }
    },
    stock: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Stock can't be null"
        },
        notEmpty: {
          msg: "Stock can't be empty"
        },
        min: {
          args: 1,
          msg: "Stock must be greater than one"
        }
      }
    },
    expired: {
      type: DataTypes.DATE,
      validate: {
        dateValidation(value) {
          if (new Date(value) < new Date()) {
            throw new Error("Date must be greater than now");
          }
        }
      }
    },
    image: DataTypes.STRING,
    description: DataTypes.TEXT,
    CategoryId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Category can't be null"
        },
        notEmpty: {
          msg: "Category can't be empty"
        },
      }
    },
    PartnerId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Partner can't be null"
        },
        notEmpty: {
          msg: "Partner can't be empty"
        },
      }
    },
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};