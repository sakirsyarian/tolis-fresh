'use strict';
const fs = require('fs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const dataProducts = JSON.parse(fs.readFileSync('./data/product.json', 'utf-8'))
      .map(product => {
        product.createdAt = new Date()
        product.updatedAt = new Date()

        return product
      })

    await queryInterface.bulkInsert('Products', dataProducts, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Products', null, {});
  }
};
