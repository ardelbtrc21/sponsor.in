import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import { v4 as uuidv4 } from 'uuid';

const TargetParticipant = db.define("target_participant", {
    target_participant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    target_participant_category: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
}, {});

export default TargetParticipant;