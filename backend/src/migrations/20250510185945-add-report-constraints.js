'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("reports", {
      fields: ["username"],
      type: "foreign key",
      name: "user_reports",
      references: {
        table: "users",
        field: "username"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeConstraint(
      "user_reports"
    );
  },
};
