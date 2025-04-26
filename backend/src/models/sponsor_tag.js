import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import { v4 as uuidv4 } from 'uuid';

const SponsorTag = db.define("sponsor_tag", {
    sponsor_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
    },
    tag_id: {
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

export default SponsorTag;