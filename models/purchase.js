'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Purchase.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Nama tidak boleh kosong"
        },
        notEmpty: {
          msg: "Nama harus dituliskan"
        },
      }
    },
    message: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Nomor whatsapp tidak boleh kosong"
        },
        notEmpty: {
          msg: "Nomor whatsapp harus dituliskan"
        },
      }
    },
    businessName: DataTypes.STRING,
    businessAddress: DataTypes.STRING,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Purchase',
  });
  return Purchase;
};