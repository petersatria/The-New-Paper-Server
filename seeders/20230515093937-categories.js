'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require('../data/categories.json')
    data.forEach(e => {
      e.createdAt = e.updatedAt = new Date()
    })
    await queryInterface.bulkInsert('Categories', data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories');
  }
};
