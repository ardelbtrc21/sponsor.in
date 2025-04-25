'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("sponsor_tags", {
      fields: ["sponsor_id"],
      type: "foreign key",
      name: "tags_sponsors",
      references: {
        table: "sponsors",
        field: "sponsor_id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
    await queryInterface.addConstraint("sponsor_tags", {
      fields: ["tag_id"],
      type: "foreign key",
      name: "tag_id_tags_sponsor",
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
      "tag_id_tags_sponsor"
    );
  },
};
