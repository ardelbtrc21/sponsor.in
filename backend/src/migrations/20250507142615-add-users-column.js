'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "background_photo", {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("users", "background_photo");
  },
};