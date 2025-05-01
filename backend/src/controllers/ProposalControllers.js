import Proposal from "../models/proposal.js";
import ProposalStatus from "../models/proposal_status.js";
import ProposalTag from "../models/proposal_tag.js";
import ProposalTargetParticipant from "../models/proposal_target_participant.js";
import Sponsor from "../models/sponsor.js";
import Sponsoree from "../models/sponsoree.js";
import { v4 as uuidv4 } from 'uuid';
import path from "path";
import { unlink } from 'node:fs';
import { fileURLToPath } from 'url';
import TargetParticipant from "../models/target_participant.js";
import Tag from "../models/tag.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const doApprovalProposal = async (req, res) => {
  const { status_id } = req.params;
  console.log("Incoming status_id:", status_id);
  try {
    let errors = {};
    const currentStatus = await Status.findOne({
      where: {
        status_id: status_id,
        status_name: "SUBMITTED",
      }
    });

    if (!currentStatus) {
      return res.status(404).json({ message: "No 'submitted' status found." });
    }

    const newStatus = await Status.create({
      submission_id: currentStatus.submission_id,
      status_name: "UNDER REVIEW",
    });

    return res.status(201).json({
      message: "New status 'UNDER REVIEW' added.",
      data: newStatus,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
}

export const getProposalByStatus = async (req, res) => {
  const { status_name } = req.params;

  try {
    const proposals = await Status.findAll({
      where: { status_name },
      include: {
        model: Submission,
        as: 'submission_status',
        attributes: ['event_name', 'event_date', 'proposal_name'],
      },
    });

    if (!proposals) {
      return res.status(404).json({ message: 'No proposals found' });
    }
    console.log("Fetched Proposals:", JSON.stringify(proposals, null, 2));
    return res.json(proposals);
  } catch (error) {
    console.error('Error fetching proposals by status:', error);
    res.status(500).json({ message: 'Error fetching proposals' });
  }
};


export const getProposalStatusBySubmissionId = async (req, res) => {
  const { submission_id } = req.params;
  console.log("Received submissionId:", submission_id);
  try {
    const statuses = await Status.findAll({
      where: { submission_id: submission_id },
      order: [["createdAt", "ASC"]]
    });
    return res.status(200).json(statuses);
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
    target_gender
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
          target_gender: target_gender
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
        res.status(400).json({ msg: error.message });
      }
    });

    res.status(201).json({msg: "Proposal successfully created"});
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
