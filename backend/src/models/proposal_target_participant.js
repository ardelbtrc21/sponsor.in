import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import { v4 as uuidv4 } from 'uuid';

const ProposalTargetParticipant = db.define("proposal_target_participant", {
    proposal_id: {
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

export default ProposalTargetParticipant;