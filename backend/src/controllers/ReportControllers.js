import Report from "../models/report.js";

export const newReport = async (req, res) => {
  const { report_id, username, created_by, created_for, reason, description, status, createdAt } = req.body;

  try {
    const newReport = await Report.create({
      report_id,
      username, 
      created_by,
      created_for,
      reason, 
      description, 
      status, 
      createdAt
    });
    console.log("Report saved:", newReport);
    res.status(200).json({ message: "Report submitted successfully", data: newReport });
  } catch (error) {
    console.error("Error submitting report:", error);
    res.status(500).json({ message: "Error submitting report", error: error.message });
  }
};
