import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import { v4 as uuidv4 } from 'uuid';

const SponsorTargetParticipant = db.define("sponsor_target_participant", {
    sponsor_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
    },
    target_participant_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
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

export default SponsorTargetParticipant;