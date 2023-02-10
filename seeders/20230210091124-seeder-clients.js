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

    const dataClients = JSON.parse(fs.readFileSync('./data/client.json', 'utf-8'))
      .map(client => {
        client.createdAt = new Date()
        client.updatedAt = new Date()

        return client
      })

    await queryInterface.bulkInsert('Clients', dataClients, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Clients', null, {});
  }
};
