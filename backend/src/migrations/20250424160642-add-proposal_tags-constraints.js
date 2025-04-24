'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("proposal_tags", {
      fields: ["proposal_id"],
      type: "foreign key",
      name: "tags_proposals",
      references: {
        table: "proposals",
        field: "proposal_id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
    await queryInterface.addConstraint("proposal_tags", {
      fields: ["tag_id"],
      type: "foreign key",
      name: "tag_id_tags",
      references: {
        table: "tags",
        field: "tag_id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeConstraint(
      "tags_proposals"
    );
    await queryInterface.removeConstraint(
      "tag_id_tags"
    );
  },
};
