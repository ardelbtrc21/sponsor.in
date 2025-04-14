'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("sponsors", {
      sponsoree_id: {
        type: Sequelize.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      username: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      nib: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      document: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("sponsors");
  },
};
