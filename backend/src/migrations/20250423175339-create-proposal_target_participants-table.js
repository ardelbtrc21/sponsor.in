'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("proposal_target_participants", {
      proposal_id: {
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
    await queryInterface.dropTable("proposal_target_participants");
  },
};