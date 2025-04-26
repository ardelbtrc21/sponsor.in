'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("sponsor_target_participants", {
      sponsor_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      target_participant_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("sponsor_target_participants");
  },
};