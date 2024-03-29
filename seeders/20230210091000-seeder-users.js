'use strict';

const fs = require('fs')
const bycrypt = require('bcryptjs')

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

    const dataUsers = JSON.parse(fs.readFileSync('./data/user.json', 'utf-8'))
      .map(user => {
        user.createdAt = new Date()
        user.updatedAt = new Date()
        user.password = bycrypt.hashSync(user.password, bycrypt.genSaltSync(10))

        return user
      })

    await queryInterface.bulkInsert('Users', dataUsers, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Users', null, {});
  }
};
