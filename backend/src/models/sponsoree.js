import { Sequelize } from "sequelize";
import db from "../config/Database.js"

const Sponsoree = db.define("sponsoree", {
    sponsoree_id: {
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
    category: {
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

export default Sponsoree;