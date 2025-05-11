import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateMilestoneModal = ({ submission, onClose }) => {
  const [milestones, setMilestones] = useState([]);
  const [errors, setErrors] = useState([]);
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState(false);

  const statusId = submission.proposal_id;

  useEffect(() => {
    if (!statusId) {
      setGeneralError("Status ID is not available yet.");
    }
  }, [statusId]);

  const handleMilestoneChange = (index, field, value) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const handleFileChange = (index, file) => {
    const updated = [...milestones];
    updated[index].milestone_attachment = file;
    setMilestones(updated);
  };

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        milestone_name: "",
        milestone_description: "",
        milestone_attachment: null,
      },
    ]);
    setErrors([...errors, {}]);
  };

  const removeMilestone = (index) => {
    const updated = milestones.filter((_, i) => i !== index);
    const updatedErrors = errors.filter((_, i) => i !== index);
    setMilestones(updated);
    setErrors(updatedErrors);
  };

  const handleSubmit = async () => {
    if (!statusId) return setGeneralError("Status ID is not available yet.");

    let hasError = false;
    const newErrors = milestones.map((m) => {
      const error = {};
      if (!m.milestone_name) {
        error.milestone_name = "Milestone name is required.";
        hasError = true;
      }
      if (!m.milestone_description) {
        error.milestone_description = "Description is required.";
        hasError = true;
      }
      return error;
    });

    setErrors(newErrors);
    if (hasError) return;

    try {
      const payload = await Promise.all(
        milestones.map(async (m) => {
          let attachmentPath = "";

          if (m.milestone_attachment) {
            const formData = new FormData();
            formData.append("file", m.milestone_attachment);
            const res = await axios.post("http://localhost:5000/api/upload", formData);
            attachmentPath = res.data.filePath;
          }

          return {
            proposal_id: statusId,
            milestone_name: m.milestone_name,
            milestone_description: m.milestone_description,
            milestone_attachment: attachmentPath,
            created_date: new Date(),
            completed_date: null,
          };
        })
      );

      await axios.post("/api/milestones/create", payload);
      setSuccess(true);
    } catch (error) {
      console.error("Error submitting milestones:", error.response?.data || error.message);
      setGeneralError("Failed to submit milestones. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-md relative">
        <button className="absolute top-4 right-4 text-red-500" onClick={onClose}>✕</button>

        {success ? (
          <div className="flex flex-col items-center text-center py-10 px-4">
            <div className="bg-green-100 rounded-full p-4 mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="custom-title text-xl font-semibold text-gray-800 mb-2">Milestone Created Successfully!</h2>
            <p className="text-gray-500 mb-6">Your milestone has been saved and linked to this agreement.</p>
            <button onClick={onClose} className="btn btn-primary text-white px-6 py-2 rounded-full hover:opacity-80">
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">Create Agreement's Milestones</h2>

            {milestones.length === 0 ? (
              <div className="text-center text-gray-500 mb-6">No milestones added yet.</div>
            ) : (
              milestones.map((milestone, index) => (
                <div key={index} className="mb-6 border-b pb-4">
                  <input
                    type="text"
                    className="w-full border p-2 rounded mb-1"
                    placeholder="Milestone name"
                    value={milestone.milestone_name}
                    onChange={(e) => handleMilestoneChange(index, "milestone_name", e.target.value)}
                  />
                  {errors[index]?.milestone_name && (
                    <p className="text-red-500 text-sm mb-1">{errors[index].milestone_name}</p>
                  )}

                  <textarea
                    className="w-full border p-2 rounded mb-1"
                    placeholder="Milestone description"
                    value={milestone.milestone_description}
                    onChange={(e) => handleMilestoneChange(index, "milestone_description", e.target.value)}
                  />
                  {errors[index]?.milestone_description && (
                    <p className="text-red-500 text-sm mb-1">{errors[index].milestone_description}</p>
                  )}

                  <input
                    type="file"
                    className="w-full mb-2"
                    onChange={(e) => handleFileChange(index, e.target.files[0])}
                  />

                  <button
                    onClick={() => removeMilestone(index)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}

            {generalError && <p className="text-red-500 mb-3">{generalError}</p>}

            {milestones.length === 0 ? (
              <div className="flex justify-center mt-4">
                <button onClick={addMilestone} className="btn btn-secondary hover:bg-gray-200">
                  + Add Milestone
                </button>
              </div>
            ) : (
              <div className="flex justify-between mt-4">
                <button onClick={addMilestone} className="btn btn-secondary hover:bg-gray-200">
                  + Add Milestone
                </button>

                <button onClick={handleSubmit} className="btn btn-primary text-white hover:opacity-80">
                  Submit Milestones
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CreateMilestoneModal;
