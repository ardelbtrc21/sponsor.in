import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import { v4 as uuidv4 } from 'uuid'; 

const Submission = db.define("submission", {
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
}, {});

export default Submission;