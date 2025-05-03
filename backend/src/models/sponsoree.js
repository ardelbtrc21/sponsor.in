import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import { v4 as uuidv4 } from "uuid";
import Proposal from "./proposal.js";

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
    is_banned: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {});

Sponsoree.hasMany(Proposal, {
    foreignKey: "sponsoree_id",
    as: "sponsoree_proposals",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
Proposal.belongsTo(Sponsoree, {
    foreignKey: "sponsoree_id",
    as: "sponsoree_proposals"
});

export default Sponsoree;