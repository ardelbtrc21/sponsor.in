import Proposal from "../models/proposal.js";
import ProposalStatus from "../models/proposal_status.js";
import ProposalTag from "../models/proposal_tag.js";
import ProposalTargetParticipant from "../models/proposal_target_participant.js";
import Sponsor from "../models/sponsor.js";
import Sponsoree from "../models/sponsoree.js";
import { v4 as uuidv4 } from 'uuid';
import path from "path";
import { fileURLToPath } from 'url';
import TargetParticipant from "../models/target_participant.js";
import Tag from "../models/tag.js";
import Milestone from "../models/milestone.js";
import sequelize, { Op } from "sequelize";
import User from "../models/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const doApprovalProposal = async (req, res) => {
  const { proposal_status_id } = req.params;

  try {
    const currentStatus = await ProposalStatus.findOne({
      where: {
        proposal_status_id: proposal_status_id,
        status_name: "Under Review",
        endAt: null
      },
    });

    if (!currentStatus) {
      return res.status(404).json({
        message: "No 'Under Review' status found for this proposal.",
      });
    }

    if (!currentStatus.proposal_id) {
      return res.status(400).json({
        message: "Invalid proposal_id associated with the current status.",
      });
    }

    const proposal = await Proposal.findOne({
      where: { proposal_id: currentStatus.proposal_id },
    });

    if (!proposal) {
      return res.status(404).json({
        message: "Proposal not found with the given proposal_id.",
      });
    }

    currentStatus.endAt = new Date();
    await currentStatus.save();

    const newStatus = await ProposalStatus.create({
      proposal_id: currentStatus.proposal_id, 
      status_name: "Accepted", 
    });

    return res.status(201).json({
      message: "Proposal status successfully updated to 'Accepted'.",
      data: newStatus,
    });

  } catch (err) {
    console.error("Error in doApprovalProposal:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};


export const doViewProposal = async (req, res) => {
  const { proposal_status_id } = req.params;
  console.log(req.params)

  try {
    const currentStatus = await ProposalStatus.findOne({
      where: {
        proposal_status_id: proposal_status_id,
        status_name: "Submitted",
        endAt: null
      },
    });
    console.log(currentStatus)
    if(!currentStatus){
      return res.status(204)
    }

    if (!currentStatus.proposal_id) {
      return res.status(400).json({
        message: "Invalid proposal_id associated with the current status.",
      });
    }

    const proposal = await Proposal.findOne({
      where: { proposal_id: currentStatus.proposal_id },
    });

    if (!proposal) {
      return res.status(404).json({
        message: "Proposal not found with the given proposal_id.",
      });
    }

    currentStatus.endAt = new Date();
    await currentStatus.save();

    const newStatus = await ProposalStatus.create({
      proposal_id: currentStatus.proposal_id, 
      status_name: "Under Review", 
    });

    return res.status(201).json({
      message: "Proposal status successfully updated to Under Review.",
      data: newStatus,
    });

  } catch (err) {
    console.error("Error to change status", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};


export const doRejectProposal = async (req, res) => {
  const { proposal_status_id } = req.params;

  try {
    const currentStatus = await ProposalStatus.findOne({
      where: {
        proposal_status_id: proposal_status_id,
        status_name: "Under Review",
      },
    });

    if (!currentStatus) {
      return res.status(404).json({
        message: "No 'Under Review' status found for this proposal.",
      });
    }

    if (!currentStatus.proposal_id) {
      return res.status(400).json({
        message: "Invalid proposal_id associated with the current status.",
      });
    }

    const proposal = await Proposal.findOne({
      where: { proposal_id: currentStatus.proposal_id },
    });

    if (!proposal) {
      return res.status(404).json({
        message: "Proposal not found with the given proposal_id.",
      });
    }

    const newStatus = await ProposalStatus.create({
      proposal_id: currentStatus.proposal_id, 
      status_name: "Rejected", 
    });

    return res.status(201).json({
      message: "Proposal status successfully updated to 'Rejected'.",
      data: newStatus,
    });

  } catch (err) {
    console.error("Error in doRejectProposal:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const getLatestProposalStatus = async (req, res) => {
  try {
    const { proposal_id } = req.params;

    const latestStatus = await ProposalStatus.findOne({
      where: { proposal_id: proposal_id },
      order: [['createdAt', 'DESC']],
    });

    if (!latestStatus) {
      return res.status(404).json({ message: 'No status found for this proposal' });
    }

    return res.status(200).json(latestStatus);
  } catch (error) {
    console.error("Error fetching latest status:", error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getAllProposals = async (req, res) => {
  try {
    const proposals = await Proposal.findAll({
      include: {
        model: ProposalStatus,
        as: 'status_proposals'
      },
      order: [["createdAt", "ASC"]], 
      raw: true
    });

    res.json(proposals);
  } catch (error) {
    console.error("Error fetching proposals:", error.message);
    res.status(500).json({
      message: "Failed to fetch proposals",
      error: error.message,
    });
  }
};

export const getProposalByStatus = async (req, res) => {
  const { username, status_name } = req.params;

  try {
    const proposals = await ProposalStatus.findAll({
      where: {
        status_name,
        '$status_proposals.sponsoree_proposals.username$': username,
        endAt: null
      },
      include: [
        {
          model: Proposal,
          as: 'status_proposals',
          include: [
            {
              model: Sponsoree,
              as: 'sponsoree_proposals',
              where: { username },
              attributes: []
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    if (!proposals || proposals.length === 0) {
      return res.status(404).json({ message: 'No proposals found' });
    }

    return res.json(proposals);
  } catch (error) {
    console.error('Error fetching proposals by status and username:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProposalStatusByProposalId = async (req, res) => {
  const { proposal_id } = req.params;
  try {
    const statuses = await ProposalStatus.findAll({
      where: {
        proposal_id: proposal_id,
      },
      order: [["createdAt", "ASC"]],
      raw: true
    });
    return res.status(200).json(statuses);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

export const getProposalByProposalId = async (req, res) => {
  let include = [
    {
      model: ProposalStatus,
      as: "status_proposals",
      required: true,
      attributes: ["proposal_status_id", "proposal_id", "status_name"],
      duplicating: false
    },
    {
      model: Milestone,
      as: "milestone_proposals",
      required: false,
      duplicating: false
    },
    {
      model: Tag,
      as: "tags_proposals",
      required: true,
      attributes: ["tag_name"],
      duplicating: false
    },
    {
      model: TargetParticipant,
      as: "target_proposals",
      required: true,
      attributes: ["target_participant_category"],
      duplicating: false
    },
    {
      model: Sponsor,
      as: "sponsor_proposals",
      required: true,
      attributes: ["username", "nib"],
      duplicating: false
    },
    {
      model: Sponsoree,
      as: "sponsoree_proposals",
      required: true,
      attributes: ["username", "category"],
      duplicating: false
    },
  ];
  try {
    let result = await Proposal.findOne({
      where: {
        proposal_id: req.params.id
      },
      include: include
    });
    if (result) {
      const sponsoreeUsername = result?.dataValues?.sponsoree_proposals?.dataValues?.username;

      if (sponsoreeUsername) {
        const user = await User.findOne({
          where: { username: sponsoreeUsername },
          attributes: { exclude: ['password'] }
        });
        result.dataValues.user = user;
      }
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

export const createProposal = async (req, res) => {
  let {
    sponsoree_id,
    sponsor_id,
    proposal_name,
    event_name,
    event_date,
    event_location,
    target_age_min,
    target_age_max,
    target_gender,
    support_needed
  } = req.body;
  const tags = JSON.parse(req.body.tags);
  const target_participants = JSON.parse(req.body.target_participants);
  target_age_min = parseInt(target_age_min)
  target_age_max = parseInt(target_age_max)
  const file_proposal = req.files?.file_proposal || null;
  try {
    let errors = {}
    if (!sponsoree_id || sponsoree_id == "") errors.sponsoree_id = "Sponsor seeker is invalid!";
    if (!errors.sponsoree_id) {
      const sponsoree = await Sponsoree.findOne({
        where: {
          sponsoree_id: sponsoree_id
        }
      })
      if (!sponsoree) {
        errors.sponsoree_id = "Sponsor seeker is invalid!"
      }
    }
    if (!sponsor_id || sponsor_id == "") errors.sponsor_id = "Sponsor is invalid!";
    if (!errors.sponsor_id) {
      const sponsor = await Sponsor.findOne({
        where: {
          sponsor_id: sponsor_id
        }
      })
      if (!sponsor) {
        errors.sponsor_id = "Sponsor is invalid!"
      }
    }
    if (!proposal_name || proposal_name == "") errors.proposal_name = "Proposal name must be filled in!";
    if (proposal_name && (proposal_name.length < 30 || proposal_name.length > 200)) errors.proposal_name = "Proposal name must be in range of 30-200 characters";
    if (!file_proposal || file_proposal == null) errors.file_proposal = "Proposal file must be uploaded!";
    let uploadPath = ""
    let fileName = ""
    if (file_proposal !== null) {
      const ext = path.extname(String(file_proposal.name)).toLowerCase();
      if (ext != ".pdf") {
        errors.file_proposal = `File of ${file_proposal.name} file must be in PDF extension.`;
      }
      const fileSize = file_proposal.data.length;
      if (fileSize > 20000000) {
        errors.files = `File of ${file_proposal.name} must be less than 20 MB.`;
      }
      let uniqueId = uuidv4();
      fileName = uniqueId + "_" + String(file_proposal.name);
      uploadPath = path.join(__dirname, "..", "..", "data", "proposal", fileName);
    }

    if (!event_name || event_name == "") errors.event_name = "Event name must be uploaded!";
    if (!event_date || event_date == "") errors.event_date = "Event date must be filled in!";

    const dateObj = new Date(event_date);
    const isValid = !isNaN(dateObj.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(event_date);
    const today = new Date();
    today.setHours(23, 59, 59, 59);
    const isFuture = dateObj.getTime() > today.getTime();

    if (!errors.event_date && !isValid) errors.event_date = "Event date is invalid!"
    if (!errors.event_date && !isFuture) errors.event_date = "Event date must be in the future!"

    if (!event_location || event_location == "") errors.event_location = "Event location must be filled in!";
    if (!target_age_min || target_age_min == "") errors.target_age = "Target age must be filled in!";
    if (!errors.target_age && target_age_min < 0) errors.target_age = "Target age invalid!"
    if (!target_age_max || target_age_max == "") errors.target_age = "Target age must be filled in!";
    if (!errors.target_age && (target_age_max < target_age_min)) errors.target_age = "Target age invalid!"
    if (!target_gender || target_gender == "") errors.target_gender = "Target gender must be filled in!";
    if (!support_needed || target_gender == "") errors.support_needed = "Support needed must be filled in!";
    if (!target_participants || target_participants.length <= 0) errors.target_participants = "Target participant must be filled in!";
    let targetID = []
    if (!errors.target_participants) {
      for (const target_participant of target_participants) {
        const response = await TargetParticipant.findOne({
          where: {
            target_participant_category: target_participant
          },
          attributes: ["target_participant_id"]
        })
        if (!response) {
          errors.target_participants = `Target participant "${target_participant}" is invalid!`
        }
        targetID.push(response.dataValues.target_participant_id)
      }
    }
    let tagID = []
    if (!tags || tags.length <= 0) errors.tags = "Tags must be filled in!";
    if (!errors.tags) {
      for (const tag of tags) {
        const response = await Tag.findOne({
          where: {
            tag_name: tag,
          },
          attributes: ["tag_id"]
        })
        if (!response) {
          errors.tags = `Tag "${tag}" is invalid!`
        }
        tagID.push(response.dataValues.tag_id)
      }
    }

    if (Object.keys(errors).length != 0) {
      return res.status(404).json(errors);
    }

    file_proposal.mv(uploadPath, async (err) => {
      if (err) {
        return res.status(500).json({ msg: "File upload failed", error: err });
      }
      try {
        const newProposal = await Proposal.create({
          sponsoree_id: sponsoree_id,
          sponsor_id: sponsor_id,
          proposal_name: proposal_name,
          file_proposal: fileName,
          event_name: event_name,
          event_date: event_date,
          event_location: event_location,
          target_age_min: target_age_min,
          target_age_max: target_age_max,
          target_gender: target_gender,
          support_needed: support_needed
        });
        await ProposalStatus.create({
          proposal_id: newProposal.proposal_id,
          status_name: "Submitted"
        });
        if (tagID && Array.isArray(tagID)) {
          for (const tag of tagID) {
            await ProposalTag.create({
              proposal_id: newProposal.proposal_id,
              tag_id: tag
            });
          }
        }
        if (targetID && Array.isArray(targetID)) {
          for (const target of targetID) {
            await ProposalTargetParticipant.create({
              proposal_id: newProposal.proposal_id,
              target_participant_id: target
            });
          }
        }
      } catch (error) {
        console.log(error)
        res.status(400).json({ msg: error.message });
      }
    });

    res.status(201).json({ msg: "Proposal successfully created" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const statusChangeProposal = async (req, res) => {
  const { proposal_id, status } = req.body
  console.log(req.body)
  try {
    const proposal_status = await ProposalStatus.findAll({
      where: {
        proposal_id: proposal_id
      }
    })
    for(const item of proposal_status){
      
    }
  } catch (error) {
    console.log(error)
  }
}

export const getCompletedAgreements = async (req, res) => {
  const { username, role } = req.query;

  if (!username || !role) {
    return res.status(400).json({ message: "Username and role are required" });
  }

  try {
    const baseIncludes = [
      {
        model: ProposalStatus,
        as: "status_proposals",
        where: { status_name: "completed" },
        required: true
      }
    ];

    if (role.toLowerCase() === "sponsor") {
      baseIncludes.push({
        model: Sponsor,
        as: "sponsor_proposals",
        required: true,
        include: [
          {
            model: User,
            as: "user_sponsors",
            where: { username },
            attributes: ["username"]
          }
        ]
      });

      baseIncludes.push({
        model: Sponsoree,
        as: "sponsoree_proposals",
        include: [
          {
            model: User,
            as: "user_sponsorees",
            attributes: ["username"]
          }
        ]
      });

    } else if (role.toLowerCase() === "sponsoree") {
      baseIncludes.push({
        model: Sponsoree,
        as: "sponsoree_proposals",
        required: true,
        include: [
          {
            model: User,
            as: "user_sponsorees",
            where: { username },
            attributes: ["username"]
          }
        ]
      });

      baseIncludes.push({
        model: Sponsor,
        as: "sponsor_proposals",
        include: [
          {
            model: User,
            as: "user_sponsors",
            attributes: ["username"]
          }
        ]
      });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    const proposals = await Proposal.findAll({
      include: baseIncludes,
      order: [["createdAt", "DESC"]]
    });

    const formatted = proposals.map((proposal) => ({
      event_name: proposal.event_name,
      event_date: proposal.event_date,
      sponsor_username: proposal.sponsor_proposals?.user_sponsors?.username || null,
      sponsoree_username: proposal.sponsoree_proposals?.user_sponsorees?.username || null
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Error fetching completed agreements:", err);
    res.status(500).json({ message: "Error retrieving completed agreements." });
  }
};

export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({
      where: { username },
      attributes: ["username", "role"]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProposals = async (req, res) => {
  try {
    // const sortBy = "proposal_name";
    // const order = "ASC";
    // const keyword = "";
    const sortBy = req?.body?.sortBy || "proposal_name";
    const order = req?.body?.order || "ASC";
    const keyword = req?.body?.keyword || "";
    const username = req?.body?.username

    // pagination
    const page = parseInt(req?.body?.page) || 0;
    const limit = parseInt(req?.body?.limit) || 10;

    //filter
    const filterEventDate = req?.body?.filter?.eventDate || [];
    const filterEventLocation = req?.body?.filter?.eventLocation || [];
    const filterTargetAgeMin = req?.body?.filter?.targetAgeMin || [];
    const filterTargetAgeMax = req?.body?.filter?.targetAgeMax || [];
    const filterTargetGender = req?.body?.filter?.targetGender || [];
    const filterTagRelated = req?.body?.filter?.tagRelated || [];
    const filterTargetParticipant = req?.body?.filter?.targetParticipant || [];
    const filterStatus = req?.body?.filter?.status || [];
    const startDate = req?.body?.filter?.startDate || [];
    const endDate = req?.body?.filter?.endDate || [];

    console.log(filterTagRelated)

    let where = {
      [Op.or]: [
        {
          proposal_name: {
            [Op.iLike]: "%" + keyword + "%"
          }
        }, {
          event_name: {
            [Op.iLike]: "%" + keyword + "%"
          }
        }
      ]
    };

    if (startDate.length > 0 && endDate.length > 0) {
      where.event_date = {
        [Op.between]: [startDate, endDate]
      };
    }
    console.log(startDate)
    console.log(endDate)

    let sort = "";

    if (sortBy === "proposal_name") {
      sort = "[`proposal_name`, `${order}`]";
    } else if (sortBy === "event_name") {
      sort = "[`event_name`, `${order}`]";
    } else if (sortBy === "event_date") {
      sort = "[`event_date`, `${order}`]";
    }

    let include = [
      {
        model: ProposalStatus,
        as: "status_proposals",
        required: true,
        attributes: ["proposal_id", "status_name"],
        duplicating: false,
        where: {endAt: null}
      },
      {
        model: Milestone,
        as: "milestone_proposals",
        required: false,
        duplicating: false
      },
      {
        model: Tag,
        as: "tags_proposals",
        required: true,
        attributes: ["tag_name"],
        duplicating: false
      },
      {
        model: TargetParticipant,
        as: "target_proposals",
        required: true,
        attributes: ["target_participant_category"],
        duplicating: false
      },
      {
        model: Sponsor,
        as: "sponsor_proposals",
        required: true,
        attributes: ["username", "nib"],
        duplicating: false,
        where: {username: username}
      },
      {
        model: Sponsoree,
        as: "sponsoree_proposals",
        required: true,
        attributes: ["username", "category"],
        duplicating: false
      },
    ];


    let result = await Proposal.findAll({
      where: where,
      include: include,
      order: [
        [`${sortBy}`, `${order}`]
      ]
    });

    console.log(result)

    if (String(filterEventLocation) !== "") {
      result = result.filter(item => filterEventLocation.includes(item.event_location));
    }
    if (String(filterTargetAgeMin) !== "") {
      result = result.filter(item => filterTargetAgeMin.includes(item.target_age_min));
    }
    if (String(filterTargetAgeMax) !== "") {
      result = result.filter(item => filterTargetAgeMax.includes(item.target_age_max));
    }
    if (String(filterTargetGender) !== "") {
      result = result.filter(item => filterTargetGender.includes(item.target_gender));
    }
    if (filterTagRelated.length > 0) {
      result = result.filter(item => {
        const tagNames = item.tags_proposals.map(tag => tag.tag_name);
        return tagNames.some(tag => filterTagRelated.includes(tag));
      });
    }
    if (filterTargetParticipant.length > 0) {
      result = result.filter(item => {
        console.log(item)
        const targetCategory = item.target_proposals.map(target => target.target_participant_category);
        return targetCategory.some(target => filterTargetParticipant.includes(target));
      });
    }
    // if (String(filterTargetParticipant) !== "") {
    //   result = result.filter(item => filterTargetParticipant.includes(item.target_proposals));
    // }
    if (String(filterStatus) !== "") {
      result = result.filter(item => filterStatus.includes(item.status_proposals));
    }

    const totalRows = Object.keys(result).length;
    const totalPage = Math.ceil(totalRows / limit);

    const lastIndex = (page + 1) * limit;
    const firstIndex = lastIndex - limit;
    result = result.slice(firstIndex, lastIndex);
    res.json({
      result: result,
      page: page,
      limit: limit,
      totalRows: totalRows,
      totalPage: totalPage
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: error.message });
  }
}

export const doCompleteProposal = async ( req, res) => {
  const { proposal_status_id } = req.params;
  console.log("incoming stat id: ", proposal_status_id);
  try {
    const currentStatus = await ProposalStatus.findOne({
      where: {
        proposal_status_id: proposal_status_id,
        status_name: "Processing Agreement",
        endAt: null
      },
    });

    if (!currentStatus) {
      return res.status(404).json({
        message: "No 'Processing Agreement' status found for this proposal.",
      });
    }

    if (!currentStatus.proposal_id) {
      return res.status(400).json({
        message: "Invalid proposal_id associated with the current status.",
      });
    }

    const proposal = await Proposal.findOne({
      where: { proposal_id: currentStatus.proposal_id },
    });

    if (!proposal) {
      return res.status(404).json({
        message: "Proposal not found with the given proposal_id.",
      });
    }

    currentStatus.endAt = new Date();
    await currentStatus.save();

    const newStatus = await ProposalStatus.create({
      proposal_id: currentStatus.proposal_id, 
      status_name: "Completed", 
    });

    return res.status(201).json({
      message: "Proposal status successfully updated to 'Completed'.",
      data: newStatus,
    });

  } catch (err) {
    console.error("Error in doCompletelProposal:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
}