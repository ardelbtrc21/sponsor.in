'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("sponsors", "is_available", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn("sponsors", "category_provides", {
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn("sponsors", "description", {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("sponsors", "is_available");
    await queryInterface.removeColumn("sponsors", "category_provides");
    await queryInterface.removeColumn("sponsors", "description");
  },
};