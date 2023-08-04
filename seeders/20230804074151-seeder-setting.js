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

    const dataSetting = JSON.parse(fs.readFileSync('./data/setting.json', 'utf-8'))
      .map(setting => {
        setting.createdAt = new Date()
        setting.updatedAt = new Date()

        return setting
      })

    await queryInterface.bulkInsert('Settings', dataSetting, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Settings', null, {});
  }
};
