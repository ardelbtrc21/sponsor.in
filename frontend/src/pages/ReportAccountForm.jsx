import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Check, ArrowLeft} from "lucide-react";
import { useEffect } from "react";


const ReportAccountForm = () => {
  useEffect(() => {
    console.log("User from Redux:", user);
  }, []);
  
  const { id: reportedUsername } = useParams();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/report", {
        report_id: uuidv4(),
        username: reportedUsername,
        created_by: (user && user.username),
        created_for: reportedUsername,
        reason,
        description,
        status: "submitted",
        createdAt: new Date(),
      });

      setShowPopup(true);
      setLoading(false);

      setTimeout(() => {
        setShowPopup(false);
        navigate("/sponsors");
      }, 3000);
    } catch (error) {
      setLoading(false);
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 text-[#031930] flex items-center gap-1 text-sm font-medium hover:text-blue-600 transition-colors duration-200"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="border-2 border-[#031930] rounded-lg p-10 w-full max-w-lg relative">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#031930]">
          Report Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full border border-[#031930] px-4 py-2 rounded-md text-sm focus:outline-none"
          >
            <option value="">Your Reason</option>
            <option value="Fraud">Fraud</option>
            <option value="Inappropriate Content">Inappropriate Content</option>
            <option value="Scam">Scam</option>
            <option value="Harassment">Harassment</option>
            <option value="Other">Other</option>
          </select>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            placeholder="Type your description here..."
            className="w-full border border-[#031930] px-4 py-2 rounded-md text-sm resize-none focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary text-white py-3 rounded-md text-sm font-medium transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {showPopup && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
              <Check size={48} className="text-green-600 mx-auto mb-2" />
              <p className="text-black font-medium">
                Your report to account <span className="font-bold">{reportedUsername}</span> has been submitted and will be reviewed by our admin.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportAccountForm;
