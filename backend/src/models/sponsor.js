import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import { v4 as uuidv4 } from "uuid";
import Tag from "./tag.js";
import SponsorTag from "./sponsor_tag.js";
import TargetParticipant from "./target_participant.js";
import SponsorTargetParticipant from "./sponsor_target_participant.js";
import Proposal from "./proposal.js";

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
    is_available: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    category_provides: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    status: {
        type: Sequelize.TEXT,
        allowNull: false
    }
}, {});

Sponsor.belongsToMany(Tag, { 
    through: SponsorTag, 
    foreignKey: "sponsor_id", 
    as: "tags_sponsors", 
    onDelete: "CASCADE", 
    onUpdate: "CASCADE" 
});
Tag.belongsToMany(Sponsor, { 
    through: SponsorTag, 
    foreignKey: "tag_id", 
    as: "tag_id_tags_sponsor", 
    onDelete: "CASCADE", 
    onUpdate: "CASCADE" 
});
Sponsor.belongsToMany(TargetParticipant, { 
    through: SponsorTargetParticipant, 
    foreignKey: "sponsor_id", 
    as: "target_sponsors", 
    onDelete: "CASCADE", 
    onUpdate: "CASCADE" 
});
TargetParticipant.belongsToMany(Sponsor, { 
    through: SponsorTargetParticipant, 
    foreignKey: "target_participant_id", 
    as: "id_target_sponsors", 
    onDelete: "CASCADE", 
    onUpdate: "CASCADE" 
});
Sponsor.hasMany(Proposal, {
    foreignKey: "sponsor_id",
    as: "sponsor_proposals",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
Proposal.belongsTo(Sponsor, {
    foreignKey: "sponsor_id",
    as: "sponsor_proposals"
});
export default Sponsor;