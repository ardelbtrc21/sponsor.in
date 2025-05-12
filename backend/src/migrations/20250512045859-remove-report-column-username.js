'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('reports', 'username');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('reports', 'username', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
