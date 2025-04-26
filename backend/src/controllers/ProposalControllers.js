import Status from '../models/status.js'
import Submission from '../models/submission.js';

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