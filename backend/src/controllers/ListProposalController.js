import Submission from "../models/proposal.js";
import Status from "../models/status.js";

export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.findAll({
      include: [
        {
          model: Status,
          as: "statuses",
          attributes: ["status_name", "createdAt"],
        },
      ],
      order: [[{ model: Status, as: "statuses" }, "createdAt", "ASC"]], 
    });

    res.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error.message);
    res.status(500).json({
      message: "Failed to fetch submissions",
      error: error.message,
    });
  }
};
