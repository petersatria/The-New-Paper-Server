'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require('../data/articles.json')
    data.forEach(e => {
      e.createdAt = e.updatedAt = new Date()
      e.status = 'Active'
    })
    await queryInterface.bulkInsert('Articles', data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Articles');
  }
};
