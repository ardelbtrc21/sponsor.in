import Milestone from "../models/milestone.js";
import Status from "../models/status.js";

export const createMilestones = async (req, res) => {
  try {
    const milestonesData = req.body;

    if (!Array.isArray(milestonesData) || milestonesData.length === 0) {
      return res.status(400).json({ message: "No milestones provided" });
    }

    const createdMilestones = await Milestone.bulkCreate(milestonesData);

    return res.status(201).json({
      message: "Milestones created successfully",
      data: createdMilestones,
    });
  } catch (error) {
    console.error("Error creating milestones:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getStatusBySubmissionId = async (req, res) => {
  const { submissionId } = req.params;

  try {
    const status = await Status.findOne({
      where: { submission_id: submissionId },
      attributes: ['status_id'],
    });

    if (!status) {
      return res.status(404).json({ message: "Status not found for this submission" });
    }

    return res.status(200).json({ status_id: status.status_id });
  } catch (error) {
    console.error("Error fetching status:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};