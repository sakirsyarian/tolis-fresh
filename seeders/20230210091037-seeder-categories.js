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

    const dataCategories = JSON.parse(fs.readFileSync('./data/category.json', 'utf-8'))
      .map(category => {
        category.createdAt = new Date()
        category.updatedAt = new Date()

        return category
      })

    await queryInterface.bulkInsert('Categories', dataCategories, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Categories', null, {});
  }
};
