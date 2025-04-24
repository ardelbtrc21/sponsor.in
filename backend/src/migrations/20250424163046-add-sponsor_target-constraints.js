'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("sponsor_target_participants", {
      fields: ["sponsor_id"],
      type: "foreign key",
      name: "target_sponsors",
      references: {
        table: "sponsors",
        field: "sponsor_id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
    await queryInterface.addConstraint("sponsor_target_participants", {
      fields: ["target_participant_id"],
      type: "foreign key",
      name: "id_target_sponsors",
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
      "target_sponsors"
    );
    await queryInterface.removeConstraint(
      "id_target_sponsors"
    );
  },
};
