'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.changeColumn('reports', 'username', {
        type: Sequelize.TEXT,
        allowNull: false,
      }),
      queryInterface.changeColumn('reports', 'created_by', {
        type: Sequelize.TEXT,
        allowNull: false,
      }),
      queryInterface.changeColumn('reports', 'created_for', {
        type: Sequelize.TEXT,
        allowNull: false,
      }),
      queryInterface.changeColumn('reports', 'reason', {
        type: Sequelize.TEXT,
        allowNull: false,
      }),
      queryInterface.changeColumn('reports', 'status', {
        type: Sequelize.TEXT,
        allowNull: false,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.changeColumn('reports', 'username', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('reports', 'created_by', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('reports', 'created_for', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('reports', 'reason', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('reports', 'status', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
    ]);
  }
};
