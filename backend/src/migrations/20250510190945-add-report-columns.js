'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("reports", "updatedAt", {
        type: Sequelize.DATE,
        allowNull: false
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("reports", "updatedAt");
  },
};