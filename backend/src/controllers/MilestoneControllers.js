import db from "../../config/Database.js";
import Milestone from "../models/milestone.js";
import MilestoneStatus from "../models/milestone_status.js";
import ProposalStatus from "../models/proposal_status.js";
import { v4 as uuidv4, v4 } from 'uuid';

export const createMilestones = async (req, res) => {
  const t = await db.transaction();

  try {
    const milestonesData = req.body;

    if (!Array.isArray(milestonesData) || milestonesData.length === 0) {
      return res.status(400).json({ message: "No milestones provided" });
    }

    const milestonesWithId = milestonesData.map((m) => ({
      ...m,
      milestone_id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const createdMilestones = await Milestone.bulkCreate(milestonesWithId, {
      transaction: t,
    });

    const milestoneStatuses = createdMilestones.map((m) => ({
      milestone_status_id: uuidv4(),
      milestone_id: m.milestone_id,
      status_name: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await MilestoneStatus.bulkCreate(milestoneStatuses, { 
      transaction: t 
    });

    await t.commit();

    return res.status(201).json({
      message: "Milestones and statuses created successfully",
      data: createdMilestones,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error creating milestones:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
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