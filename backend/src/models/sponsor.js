import { Sequelize } from "sequelize";
import db from "../config/Database.js"

const Sponsor = db.define("sponsor", {
    sponsor_id: {
        type: Sequelize.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    username: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    nib: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    document: {
        type: Sequelize.TEXT,
        allowNull: false
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

export default Sponsor;