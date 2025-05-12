'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("milestones", "milestone_reply", {
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn("milestones", "milestone_reply_attachment", {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("milestones", "milestone_reply");
    await queryInterface.removeColumn("milestones", "milestone_reply_attachment");
  },
};