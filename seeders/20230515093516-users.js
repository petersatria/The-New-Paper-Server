'use strict';

const { hashPassword } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require('../data/users.json')
    data.forEach(e => {
      e.createdAt = e.updatedAt = new Date()
      e.password = hashPassword(e.password)
    })
    await queryInterface.bulkInsert('Users', data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users');
  }
};


