import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import { v4 as uuidv4 } from 'uuid';
import ProposalTag from "./proposal_tag.js";

const Tag = db.define("tag", {
    tag_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    tag_name: {
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

export default Tag;