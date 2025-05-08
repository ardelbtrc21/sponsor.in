import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import Sponsor from "./sponsor.js";
import Sponsoree from "./sponsoree.js";

const User = db.define("user", {
    username: {
        type: Sequelize.TEXT,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    email: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: true,
        validate: {
            isEmail: {
                msg: "Must be a valid email address"
            }
        }
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    role: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    profile_photo: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    last_login: {
        type: Sequelize.DATE,
        allowNull: true
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
        defaultValue: false,
    }
}, {});

User.hasOne(Sponsor, {
    foreignKey: "username",
    as: "user_sponsors",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
Sponsor.belongsTo(User, {
    foreignKey: "username",
    as: "user_sponsors"
});
User.hasOne(Sponsoree, {
    foreignKey: "username",
    as: "user_sponsorees",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
Sponsoree.belongsTo(User, {
    foreignKey: "username",
    as: "user_sponsorees"
});

export default User;