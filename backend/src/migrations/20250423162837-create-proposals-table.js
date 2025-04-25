'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("proposals", {
      proposal_id: {
        type: Sequelize.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      sponsoree_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      sponsor_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      proposal_name: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      file_proposal: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      event_name: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      event_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      event_location: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      target_age_min: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      target_age_max: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      target_gender: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("proposals");
  },
};