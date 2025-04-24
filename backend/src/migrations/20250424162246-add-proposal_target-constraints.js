'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("proposal_target_participants", {
      fields: ["proposal_id"],
      type: "foreign key",
      name: "target_proposals",
      references: {
        table: "proposals",
        field: "proposal_id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
    await queryInterface.addConstraint("proposal_target_participants", {
      fields: ["target_participant_id"],
      type: "foreign key",
      name: "id_target_proposals",
      references: {
        table: "target_participants",
        field: "target_participant_id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeConstraint(
      "target_proposals"
    );
    await queryInterface.removeConstraint(
      "id_target_proposals"
    );
  },
};
