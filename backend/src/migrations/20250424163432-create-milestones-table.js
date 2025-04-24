'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("milestones", {
      milestone_id: {
        type: Sequelize.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      status_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      milestone_name: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      milestone_description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      milestone_attachment: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      milestone_status: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      created_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      completed_date: {
        type: Sequelize.DATE,
        allowNull: true
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
    await queryInterface.dropTable("milestones");
  },
};