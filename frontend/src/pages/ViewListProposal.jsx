import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateMilestoneModal from "../components/CreateMilestoneModal";

const ViewListSubmission = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get("/api/proposals/list");
        setSubmissions(response.data);
        console.log("response data: ", response.data);
      } catch (error) {
        console.error("Error fetching submissions:", error.response?.data || error.message);
      }
    };

    fetchSubmissions();
  }, []);

  const handleOpenModal = async (submission) => {
    try {
      const response = await axios.get(`/api/milestones/status/${submission["status_proposals.proposal_status_id"]}`);
      setSelectedSubmission({ ...submission, status_id: response.data.proposal_status_id });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching status ID:", error.message);
    }
  };

  const handleCloseModal = () => {
    setSelectedSubmission(null);
    setIsModalOpen(false);
  };

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">View List of Submissions</h2>

      {submissions.length > 0 ? (
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">Submission Name</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => {
              const latestStatus = submission["status_proposals.status_name"] || "No status";

              return (
                <tr key={submission["status_proposals.proposal_status_id"]} className="border-b">
                  <td className="px-4 py-2">{submission.proposal_name}</td>
                  <td className="px-4 py-2">{latestStatus}</td>
                  <td className="px-4 py-2">
                    {latestStatus === "Processing Agreement" && (
                      <button
                        onClick={() => handleOpenModal(submission)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Create Milestone
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No submissions found.</p>
      )}

      {isModalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl relative shadow-xl">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <CreateMilestoneModal
              submission={selectedSubmission}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewListSubmission;
