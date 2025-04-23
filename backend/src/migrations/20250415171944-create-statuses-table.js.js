'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("statuses", {
            status_id: {
                type: Sequelize.UUID,
                defaultValue: () => uuidv4(),
                primaryKey: true,
                allowNull: false,
                unique: true
            },
            submission_id: {
                type: Sequelize.UUID,
                allowNull: false
            },
            status_name: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            createdAt: {
              type: Sequelize.DATE
            },
            updatedAt: {
              type: Sequelize.DATE
            },
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable("status");
    },
};