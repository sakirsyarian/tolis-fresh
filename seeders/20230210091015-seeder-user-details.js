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

    const dataUserDetails = JSON.parse(fs.readFileSync('./data/userDetail.json', 'utf-8'))
      .map(userDetail => {
        userDetail.createdAt = new Date()
        userDetail.updatedAt = new Date()

        return userDetail
      })

    await queryInterface.bulkInsert('UserDetails', dataUserDetails, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('UserDetails', null, {});
  }
};
