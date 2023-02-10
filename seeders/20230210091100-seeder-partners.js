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

    const dataPartners = JSON.parse(fs.readFileSync('./data/partner.json', 'utf-8'))
      .map(partner => {
        partner.createdAt = new Date()
        partner.updatedAt = new Date()

        return partner
      })

    await queryInterface.bulkInsert('Partners', dataPartners, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Partners', null, {});
  }
};
