'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("submissions", {
            submission_id: {
                type: Sequelize.UUID,
                defaultValue: () => uuidv4(),
                primaryKey: true,
                allowNull: false,
                unique: true
            },
            proposal_name: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            file_proposal: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            event_name: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            event_date: {
                type: Sequelize.DATE,
                allowNull: false
            },
            event_location: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            target_age: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            target_gender: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            target_participant: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            tag_id: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable("submission");
    },
};