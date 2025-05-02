import Proposal from "../models/proposal.js";
import ProposalStatus from "../models/proposal_status.js";

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
