import { Sequelize } from "sequelize";
import db from "../../config/Database.js";

const Report = db.define("report", {
  report_id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  created_by: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  created_for: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  reason: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  status: {
    type: Sequelize.TEXT,
    allowNull: false,
    defaultValue: "submitted"
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("NOW()"),
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("NOW()"),
  },
}, {
  tableName: "reports",
});

export default Report;