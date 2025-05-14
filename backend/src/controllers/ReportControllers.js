import Report from "../models/report.js";
import User from "../models/user.js";

export const newReport = async (req, res) => {
  const { report_id, username, created_by, created_for, reason, description, status, createdAt } = req.body;

  try {
    const newReport = await Report.create({
      report_id,
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

export const getListReports = async (req, res) => {
  try {
    const sortBy = "createdAt";
    const order = req?.body?.order || "DESC";
    const filterReason = req?.body?.filter?.reason || []

    // pagination
    const page = parseInt(req?.body?.page) || 0;
    const limit = parseInt(req?.body?.limit) || 10;
    let result = await Report.findAll({
      order: [
        [`${sortBy}`, `${order}`]
      ],
      include: [
        {
          model: User,
          as: "created_by_report",
          required: true,
          attributes: ["username", "name", "email", "role", "is_banned"],
          duplicating: false
        },
        {
          model: User,
          as: "created_for_report",
          required: true,
          attributes: ["username", "name", "email", "role", "is_banned"],
          duplicating: false
        }
      ]
    });

    if (filterReason.length > 0) {
      result = result.filter(item =>
        filterReason.includes(item.reason));
    }

    const totalRows = Object.keys(result).length;
    const totalPage = Math.ceil(totalRows / limit);

    const lastIndex = (page + 1) * limit;
    const firstIndex = lastIndex - limit;
    result = result.slice(firstIndex, lastIndex);

    res.json({
      result: result,
      page: page,
      limit: limit,
      totalRows: totalRows,
      totalPage: totalPage
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: error.message });
  }
}

export const rejectReport = async (req, res) => {
  try {
    const report_id = req.params.id;

    await Report.update({
      status: "rejected"
    }, {
      where: {
        report_id: report_id
      }
    })
    res.status(200).json({ msg: "Report Successfully Rejected!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}