import db from "../../config/Database.js";
import Milestone from "../models/milestone.js";
import MilestoneStatus from "../models/milestone_status.js";
import Proposal from "../models/proposal.js";
import ProposalStatus from "../models/proposal_status.js";
import { v4 as uuidv4 } from 'uuid';
import Sponsor from "../models/sponsor.js";
import path from "path";
import { fileURLToPath } from 'url';
import sequelize, { Op } from "sequelize";
import { promisify } from "util";
import { error } from "console";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createMilestones = async (req, res) => {
  try {
    const milestones = JSON.parse(req.body.milestones);
    const latestStatus = JSON.parse(req.body.latestStatus);

    if (!milestones || milestones.length === 0) {
      return res.status(400).json({ message: "No milestone data provided." });
    }

    let errors = {};
    const createdMilestones = [];

    for (let i = 0; i < milestones.length; i++) {
      const milestone = milestones[i];
      let fileName = null;
      const document = req.files ? req.files[`document_${i}`] : null;

      if (document) {
        const ext = path.extname(document.name).toLowerCase();

        if (
          ext !== ".pdf" &&
          ext !== ".jpg" &&
          ext !== ".png" &&
          ext !== ".jpeg" &&
          ext !== ".csv"
        ) {
          errors[`document_${i}`] = `File "${document.name}" is not supported. Allowed formats: .pdf, .jpg, .jpeg, .png, .csv.`;
          continue;
        }

        if (document.size > 10 * 1024 * 1024) {
          errors[`document_${i}`] = `File "${document.name}" is too large. Max allowed size is 10MB.`;
          continue;
        }

        fileName = `${milestone.proposal_id}_${Date.now()}_${document.name}`;
        const uploadPath = path.join(__dirname, "..", "..", "data", "milestone", fileName);
        await document.mv(uploadPath);
      }

      const created = await Milestone.create({
        milestone_id: uuidv4(),
        proposal_id: milestone.proposal_id,
        milestone_name: milestone.milestone_name,
        milestone_description: milestone.milestone_description,
        milestone_attachment: fileName,
        completed_date: milestone.completed_date || null,
        created_date: new Date(),
      });

      await MilestoneStatus.create({
        status_id: uuidv4(),
        milestone_id: created.milestone_id,
        status_name: "Pending",
        updatedAt: new Date(),
      });

      createdMilestones.push(created);
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "One or more files are invalid.",
        errors,
      });
    }

    if (latestStatus.status_name === "Accepted") {
      await ProposalStatus.update(
        {
          endAt: new Date(),
        },
        {
          where: {
            proposal_status_id: latestStatus.proposal_status_id,
          },
        }
      );

      await ProposalStatus.create({
        proposal_id: latestStatus.proposal_id,
        status_name: "Processing Agreement",
      });
    }

    return res.status(201).json({
      message: "Milestones created successfully.",
      data: createdMilestones,
    });

  } catch (error) {
    console.error("Milestone creation error:", error);
    return res.status(500).json({
      message: "Server error while creating milestones.",
    });
  }
};

export const getStatusBySubmissionId = async (req, res) => {
  const { proposal_status_id } = req.params;

  try {
    const status = await ProposalStatus.findOne({
      where: {
        proposal_status_id: proposal_status_id
      }
    });

    if (!status) {
      return res.status(404).json({ message: "Proposal Status not found for this submission" });
    }

    return res.status(200).json({ proposal_status_id: status.proposal_status_id });
  }
  catch (error) {
    console.error("Error fetching status:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getPendingMilestonesByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const milestones = await Milestone.findAll({
      include: [
        {
          model: Proposal,
          as: 'milestone_proposals',
          required: true,
          include: [
            {
              model: Sponsor,
              as: 'sponsor_proposals',
              where: { username },
              required: true
            }
          ]
        },
        {
          model: MilestoneStatus,
          as: 'status_milestones',
          separate: true,
          limit: 1,
          order: [['createdAt', 'DESC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const filtered = milestones.filter(milestone => {
      const latestStatus = milestone.status_milestones[0];
      return latestStatus?.status_name === 'Pending';
    });
    console.log("Result: ", filtered);
    res.json(filtered);
  } catch (err) {
    console.error('Failed to fetch milestones:', err);
    res.status(500).json({ error: 'Failed to fetch milestones' });
  }
};

export const getMilestoneById = async (req, res) => {
  const milestone = await Milestone.findByPk(req.params.milestone_id);
  const status = await MilestoneStatus.findOne({
    where: { milestone_id: req.params.milestone_id },
    order: [['createdAt', 'DESC']]
  });

  if (!milestone) return res.status(404).json({ message: "Milestone not found" });

  res.json({ milestone, status });
};

export const getMilestonesByProposalId = async (req, res) => {
  const { proposal_id } = req.params;

  try {
    const milestones = await Milestone.findAll({
      where: { proposal_id: proposal_id },
      include: [
        {
          model: MilestoneStatus,
          as: "status_milestones",
          separate: true,
          order: [["updatedAt", "DESC"]],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    console.log("Fetched milestones: ", milestones);

    const allCompleted = milestones.length > 0 &&
      milestones.every(milestone => {
        const latestStatus = milestone.status_milestones[0];
        return latestStatus && latestStatus.status_name === "Completed";
      });

    res.json({
      milestones,
      canComplete: allCompleted,
    });
  } catch (err) {
    console.error("Failed to fetch milestones by proposal ID:", err);
    res.status(500).json({ error: "Failed to fetch milestones" });
  }
};

export const updateMilestoneStatus = async (req, res) => {
  const { status_name } = req.body;
  const milestone_id = req.params.milestone_id;

  if (!["Completed", "Revision Required"].includes(status_name)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  await MilestoneStatus.create({
    milestone_status_id: uuidv4(),
    milestone_id,
    status_name,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  res.json({ message: "Milestone status updated" });
};

export const addReplyMilestone = async (req, res) => {
  const { milestone_id, milestone_reply } = req.body;
  const milestone_reply_attachment = req.files?.milestone_reply_attachment;
  console.log("file", milestone_reply_attachment)

  try {
    const milestone = await Milestone.findOne({
      where: { milestone_id },
      include: {
        model: MilestoneStatus,
        as: "status_milestones",
        where: {
          [Op.or]: [
            { status_name: "Pending", endAt: null },
            { status_name: "Revision Required", endAt: null }
          ]
        }
      }
    });

    if (!milestone) {
      return res.status(404).json({ message: "Milestone active not found." });
    }

    let fileName = "";
    if (milestone_reply_attachment) {
      console.log(milestone_reply_attachment)
      const ext = path.extname(String(milestone_reply_attachment.name)).toLowerCase();
      const allowedExtensions = [".pdf", ".xlsx", ".docs", ".jpg", ".png", ".zip"];

      if (!allowedExtensions.includes(ext)) {
        return res.status(400).json({ msg: `File type not allowed. Must be: ${allowedExtensions.join(", ")}` });
      }

      const fileSize = milestone_reply_attachment.data.length;
      if (fileSize > 20000000) {
        return res.status(400).json({ msg: `File ${milestone_reply_attachment.name} must be less than 20 MB.` });
      }

      const uniqueId = uuidv4();
      fileName = uniqueId + "_" + String(milestone_reply_attachment.name);
      const uploadPath = path.join(__dirname, "..", "..", "data", "milestone", fileName);

      const mv = promisify(milestone_reply_attachment.mv);
      await mv(uploadPath);

      milestone.milestone_reply = milestone_reply;
      milestone.milestone_reply_attachment = fileName;
      await milestone.save();
    } else {
      milestone.milestone_reply = milestone_reply;
      await milestone.save();
    }

    await MilestoneStatus.upsert({
      milestone_status_id: milestone.milestone_status_id,
      milestone_id: milestone_id,
      status_name: "Submitted",
      updatedAt: new Date()
    })

    return res.status(201).json({ msg: "Reply successfully created" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};

export const patchMilestoneRevision = async (req, res) => {
  const { milestone_id } = req.params;
  const { milestone_description } = req.body;
  const document = req.files?.milestone_attachment;

  try {
    const existing = await Milestone.findByPk(milestone_id);
    if (!existing) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    let fileName = existing.milestone_attachment;

    if (document) {
      const errors = {};
      const ext = path.extname(document.name).toLowerCase();
      const allowed = [".pdf", ".jpg", ".jpeg", ".png", ".csv"];
      if (!allowed.includes(ext)) {
        errors.document = `File "${document.name}" not supported. Allowed: ${allowed.join(", ")}`;
      }
      if (document.size > 10 * 1024 * 1024) {
        errors.document = `File "${document.name}" is too large. Max 10MB.`;
      }
      if (Object.keys(errors).length) {
        return res.status(400).json({ message: "Invalid file", errors });
      }

      if (existing.milestone_attachment) {
        const oldPath = path.join(__dirname, "..", "..", "data", "milestone", existing.milestone_attachment);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      fileName = `${existing.proposal_id}_${Date.now()}${ext}`;
      const uploadPath = path.join(process.cwd(), "data", "milestone", fileName);
      await document.mv(uploadPath);
    }

    const [updatedCount] = await Milestone.update(
      { milestone_description, milestone_attachment: fileName },
      { where: { milestone_id } }
    );
    if (updatedCount === 0) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    return res.json({ message: "Revision sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
