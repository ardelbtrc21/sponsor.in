import Status from '../models/status.js'
import Submission from '../models/proposal.js';
import Proposal from "../models/proposal.js";
import ProposalStatus from "../models/proposal_status.js";
import ProposalTag from "../models/proposal_tag.js";
import ProposalTargetParticipant from "../models/proposal_target_participant.js";
import { v4 as uuidv4 } from 'uuid'; 

export const doApprovalProposal = async(req, res) => {
    const {status_id} = req.params;
    console.log("Incoming status_id:", status_id);
    try{
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
    } catch(err){
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
    
    try {
      console.log("req: " + req.body)
      console.log("req: " + req)
        const {
            sponsoree_id,
            sponsor_id,
            proposal_name,
            file_proposal,
            event_name,
            event_date,
            event_location,
            target_age_min,
            target_age_max,
            target_gender,
            tags,
            target_participants
        } = req.body;

        const newProposal = await Proposal.create({
            proposal_id: uuidv4(),
            sponsoree_id,
            sponsor_id,
            proposal_name,
            file_proposal,
            event_name,
            event_date,
            event_location,
            target_age_min,
            target_age_max,
            target_gender,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await ProposalStatus.create({
            proposal_status_id: uuidv4(),
            proposal_id: newProposal.proposal_id,
            status: "pending", 
            createdAt: new Date(),
            updatedAt: new Date()
        });

        if (tags && Array.isArray(tags)) {
            for (const tagId of tags) {
                await ProposalTag.create({
                    proposal_id: newProposal.proposal_id,
                    tag_id: tagId
                });
            }
        }

        if (target_participants && Array.isArray(target_participants)) {
            for (const participantId of target_participants) {
                await ProposalTargetParticipant.create({
                    proposal_id: newProposal.proposal_id,
                    target_participant_id: participantId
                });
            }
        }

        res.status(201).json({
            msg: "Proposal successfully created",
            proposal_id: newProposal.proposal_id
        });
    } catch (error) {
        console.error("Error creating proposal:", error);
        res.status(500).json({ msg: "Failed to create proposal", error });
    }
};
