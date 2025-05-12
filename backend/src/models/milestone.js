import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import { v4 as uuidv4 } from 'uuid';
import MilestoneStatus from "./milestone_status.js";

const Milestone = db.define("milestone", {
    milestone_id: {
        type: Sequelize.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      proposal_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      milestone_name: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      milestone_description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      milestone_attachment: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      milestone_reply: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      milestone_reply_attachment: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      completed_date: {
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
}, {});

Milestone.hasMany(MilestoneStatus, {
  foreignKey: "milestone_id",
  as: "status_milestones",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

MilestoneStatus.belongsTo(Milestone, {
  foreignKey: "milestone_id",
  as: "status_milestones"
});

export default Milestone;