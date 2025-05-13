import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const CreateMilestoneModal = ({ submission, onClose, latestStatus }) => {
  const [milestones, setMilestones] = useState([]);
  const [errors, setErrors] = useState([]);
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const proposalId = submission?.proposal_id;

  useEffect(() => {
    if (!proposalId) {
      setGeneralError("Proposal ID is not available.");
    }
  }, [proposalId]);

  const handleMilestoneChange = (index, field, value) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const handleClose = () => {
    onClose();
    window.location.reload();
  };

  const handleFileChange = (index, file) => {
    const updated = [...milestones];
    const updatedErrors = [...errors];

    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".csv", ".xlsx"];
    const maxSizeMB = 10;

    if (!allowedExtensions.includes(ext)) {
      updatedErrors[index] = {
        ...updatedErrors[index],
        milestone_attachment: `File "${file.name}" is not supported. Allowed formats: ${allowedExtensions.join(", ")}.`,
      };
      setErrors(updatedErrors);
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      updatedErrors[index] = {
        ...updatedErrors[index],
        milestone_attachment: `File "${file.name}" is too large. Max allowed size is ${maxSizeMB}MB.`,
      };
      setErrors(updatedErrors);
      return;
    }

    updated[index].milestone_attachment = file;
    if (updatedErrors[index]) {
      delete updatedErrors[index].milestone_attachment;
      if (Object.keys(updatedErrors[index]).length === 0) {
        updatedErrors[index] = undefined;
      }
    }

    setMilestones(updated);
    setErrors(updatedErrors);
  };

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        milestone_status_id: uuidv4(),
        proposal_id: proposalId,
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

  const validateMilestones = () => {
    const updatedErrors = [];
    let isValid = true;

    milestones.forEach((milestone, index) => {
      const milestoneErrors = {};

      if (!milestone.milestone_name?.trim()) {
        milestoneErrors.milestone_name = "Milestone name is required.";
        isValid = false;
      }

      if (!milestone.milestone_description?.trim()) {
        milestoneErrors.milestone_description = "Milestone description is required.";
        isValid = false;
      }

      updatedErrors[index] = milestoneErrors;
    });

    setErrors(updatedErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");

    if (!validateMilestones()) return;

    const formData = new FormData();
    formData.append("milestones", JSON.stringify(milestones));
    formData.append("latestStatus", JSON.stringify(latestStatus));

    milestones.forEach((m, i) => {
      if (m.milestone_attachment instanceof File) {
        formData.append(`document_${i}`, m.milestone_attachment);
      }
    });

    setLoading(true);
    try {
      await axios.post('/api/milestones/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create milestones.';
      setGeneralError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-md relative">
        <button
          aria-label="Close modal"
          className="absolute top-4 right-4 text-red-500"
          onClick={onClose}
        >
          ✕
        </button>

        {success ? (
          <div className="flex flex-col items-center text-center py-10 px-4">
            <div className="bg-green-100 rounded-full p-4 mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Milestone Created Successfully!</h2>
            <p className="text-gray-500 mb-6">
              Your milestone has been saved and linked to this agreement.
            </p>
            <button
              onClick={handleClose}
              className="btn btn-primary text-white px-6 py-2 rounded-full hover:opacity-80"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-center text-xl font-bold mb-4">CREATE AGREEMENT'S MILESTONE</h2>

            {milestones.length === 0 ? (
              <div className="text-center text-gray-500 mb-6">No milestones added yet.</div>
            ) : (
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={index} className="border-b pb-4">
                    <input
                      type="text"
                      className="w-full border p-3 rounded-xl mb-2 focus:ring-primary focus:border-primary"
                      placeholder="Milestone name"
                      value={milestone.milestone_name}
                      onChange={(e) => handleMilestoneChange(index, "milestone_name", e.target.value)}
                    />
                    {errors[index]?.milestone_name && (
                      <p className="text-red-500 text-sm mb-1">{errors[index].milestone_name}</p>
                    )}

                    <textarea
                      className="w-full border p-3 rounded-xl mb-2 focus:ring-primary focus:border-primary"
                      placeholder="Milestone description"
                      value={milestone.milestone_description}
                      onChange={(e) => handleMilestoneChange(index, "milestone_description", e.target.value)}
                    />
                    {errors[index]?.milestone_description && (
                      <p className="text-red-500 text-sm mb-1">{errors[index].milestone_description}</p>
                    )}

                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.csv,.xlsx"
                      name={`document_${index}`}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
                      onChange={(e) => handleFileChange(index, e.target.files[0])}
                    />
                    {errors[index]?.milestone_attachment && (
                      <p className="text-red-500 text-sm">{errors[index].milestone_attachment}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Accepted file types: .pdf, .jpg, .jpeg, .png, .csv, .xlsx. Max size: 10MB
                    </p>

                    <button
                      onClick={() => removeMilestone(index)}
                      className="text-red-600 hover:underline text-sm mt-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {generalError && <p className="text-red-600 font-medium text-sm mt-4">{generalError}</p>}
            <div className="flex justify-between mt-6">
              <button
                onClick={addMilestone}
                className="btn btn-secondary hover:bg-gray-200 py-2 px-6 rounded-xl"
              >
                + Add Milestone
              </button>

              {milestones.length > 0 && (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn btn-primary text-white py-2 px-6 rounded-xl hover:opacity-80 disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Milestones"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateMilestoneModal;
