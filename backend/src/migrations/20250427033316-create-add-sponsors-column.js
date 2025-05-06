'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("sponsors", "status", {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: "approved"
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("sponsors", "status");
  },
};