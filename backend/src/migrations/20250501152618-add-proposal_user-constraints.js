'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("proposals", {
      fields: ["sponsoree_id"],
      type: "foreign key",
      name: "sponsoree_proposals",
      references: {
        table: "sponsorees",
        field: "sponsoree_id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
    await queryInterface.addConstraint("proposals", {
      fields: ["sponsor_id"],
      type: "foreign key",
      name: "sponsor_proposals",
      references: {
        table: "sponsors",
        field: "sponsor_id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeConstraint(
      "sponsoree_proposals"
    );
    await queryInterface.removeConstraint(
      "sponsor_proposals"
    );
  },
};
