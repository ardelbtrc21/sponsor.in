'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("reports", {
      fields: ["created_by"],
      type: "foreign key",
      name: "created_by_report",
      references: {
        table: "users",
        field: "username"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
    await queryInterface.addConstraint("reports", {
      fields: ["created_for"],
      type: "foreign key",
      name: "created_for_report",
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
      "created_by_report"
    );
    await queryInterface.removeConstraint(
      "created_for_report"
    );
  },
};
