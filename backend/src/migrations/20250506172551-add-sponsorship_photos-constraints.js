'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("sponsorship_photos", {
      fields: ["username"],
      type: "foreign key",
      name: "photo_sponsorship_users",
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
      "photo_sponsorship_users"
    );
  },
};
