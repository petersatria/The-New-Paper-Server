'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Articles', 'status', Sequelize.STRING)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Articles', 'status')
  }
};
