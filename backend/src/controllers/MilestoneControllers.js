import db from "../../config/Database.js";
import Milestone from "../models/milestone.js";
import MilestoneStatus from "../models/milestone_status.js";
import Proposal from "../models/proposal.js";
import ProposalStatus from "../models/proposal_status.js";
import { v4 as uuidv4} from 'uuid';
import Sponsor from "../models/sponsor.js";
import path from "path";

export const createMilestones = async (req, res) => {
  try {
    const milestones = JSON.parse(req.body.milestones);
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
        const ext = path.extname(String(document.name)).toLowerCase();
        if (ext !== ".pdf") {
          errors[`document_${i}`] = `File ${document.name} must be a PDF.`;
          continue;
        }
        const fileSize = document.data.length;
        if (fileSize > 10000000) {
          errors[`document_${i}`] = `File ${document.name} must be less than 10MB.`;
          continue;
        }

        fileName = `${milestone.proposal_id}_${Date.now()}_${document.name}`;
        const uploadPath = path.join(__dirname, "..", "..", "data", "milestones", fileName);

        await new Promise((resolve, reject) => {
          document.mv(uploadPath, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
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
        updatedAt: new Date()
      });

      createdMilestones.push(created);
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Some milestones failed", errors });
    }

    return res.status(201).json({
      message: "Milestones created successfully.",
      data: createdMilestones,
    });

  } catch (error) {
    console.error("Milestone error:", error);
    return res.status(500).json({ message: "Server error while creating milestones." });
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
      return latestStatus?.status_name === 'Submitted';
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
          order: [["createdAt", "DESC"]], 
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    console.log("Fetched milestones: ", milestones);

    const allCompleted = milestones.every(milestone => {
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