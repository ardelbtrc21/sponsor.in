import { Sequelize } from "sequelize";
import { v4 as uuidv4 } from 'uuid'; 
import db from "../../config/Database.js"
import Submission from "./submission.js";

const Status = db.define("status", {
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
}, {});

Status.belongsTo(Submission, {
    foreignKey: 'submission_id',
    as: 'submission_status'
  });
  
Submission.hasMany(Status, {
    foreignKey: 'submission_id',
    as: 'statuses'
});

export default Status;