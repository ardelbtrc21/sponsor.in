'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      username: {
        type: Sequelize.TEXT,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      email: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: true,
        validate: {
          isEmail: {
            msg: "Must be a valid email address"
          }
        }
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      role: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      profile_photo: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      last_login: {
        type: Sequelize.DATE,
        allowNull: true
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
  down: async (queryInterface) =>{
    await queryInterface.dropTable("users");
  },
};
