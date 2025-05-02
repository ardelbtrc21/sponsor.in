import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import { v4 as uuidv4 } from 'uuid';
import ProposalStatus from "./proposal_status.js";
import ProposalTag from "./proposal_tag.js";
import Tag from "./tag.js";
import ProposalTargetParticipant from "./proposal_target_participant.js";
import TargetParticipant from "./target_participant.js";
import Milestone from "./milestone.js";
// import Sponsor from "./sponsor.js";
// import Sponsoree from "./sponsoree.js";
// import User from "./user.js";

const Proposal = db.define("proposal", {
    proposal_id: {
        type: Sequelize.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    sponsoree_id: {
        type: Sequelize.UUID,
        allowNull: false
    },
    sponsor_id: {
        type: Sequelize.UUID,
        allowNull: false
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
    target_age_min: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    target_age_max: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    target_gender: {
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

Proposal.hasMany(ProposalStatus, {
    foreignKey: "proposal_id",
    as: "status_proposals",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
ProposalStatus.belongsTo(Proposal, {
    foreignKey: "proposal_id",
    as: "status_proposals"
});
Proposal.hasMany(Milestone, {
    foreignKey: "proposal_id",
    as: "milestone_proposals",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
Milestone.belongsTo(Proposal, {
    foreignKey: "proposal_id",
    as: "milestone_proposals"
});
Proposal.belongsToMany(Tag, { 
    through: ProposalTag, 
    foreignKey: "proposal_id", 
    as: "tags_proposals", 
    onDelete: "CASCADE", 
    onUpdate: "CASCADE" 
});
Tag.belongsToMany(Proposal, { 
    through: ProposalTag, 
    foreignKey: "tag_id", 
    as: "tag_id_tags", 
    onDelete: "CASCADE", 
    onUpdate: "CASCADE" 
});
Proposal.belongsToMany(TargetParticipant, { 
    through: ProposalTargetParticipant, 
    foreignKey: "proposal_id", 
    as: "target_proposals", 
    onDelete: "CASCADE", 
    onUpdate: "CASCADE" 
});
TargetParticipant.belongsToMany(Proposal, { 
    through: ProposalTargetParticipant, 
    foreignKey: "target_participant_id", 
    as: "id_target_proposals", 
    onDelete: "CASCADE", 
    onUpdate: "CASCADE" 
});

// Proposal.belongsTo(Sponsor, { 
//     foreignKey: "sponsor_id", as: "sponsor" 
// });

// Proposal.belongsTo(Sponsoree, { 
//     foreignKey: "sponsoree_id", 
//     as: "sponsoree" 
// });

// Sponsor.belongsTo(User, { 
//     foreignKey: "username",
//     as: "user_sponsor" 
// });

// Sponsoree.belongsTo(User, { 
//     foreignKey: "username", 
//     as: "user_sponsoree" 
// });

export default Proposal;