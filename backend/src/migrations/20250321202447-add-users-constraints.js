'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("sponsors", {
      fields: ["username"],
      type: "foreign key",
      name: "user_sponsors",
      references: {
        table: "users",
        field: "username"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
    await queryInterface.addConstraint("sponsorees", {
      fields: ["username"],
      type: "foreign key",
      name: "user_sponsorees",
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
      "user_sponsors",
      "user_sponsorees"
    );
  },
};
