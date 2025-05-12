'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("proposals", "support_needed", {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: "Fund"
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("proposals", "support_needed");
  },
};