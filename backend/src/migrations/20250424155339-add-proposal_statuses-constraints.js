'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("proposal_statuses", {
      fields: ["proposal_id"],
      type: "foreign key",
      name: "status_proposals",
      references: {
        table: "proposals",
        field: "proposal_id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeConstraint(
      "status_proposals"
    );
  },
};
