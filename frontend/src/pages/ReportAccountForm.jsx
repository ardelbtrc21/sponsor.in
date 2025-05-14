import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";

const ReportAccountForm = () => {
  const { id: reportedUsername } = useParams();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("User from Redux:", user);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/report", {
        report_id: uuidv4(),
        created_by: user?.username,
        created_for: reportedUsername,
        reason: reason,
        description: description,
        status: "submitted",
        createdAt: new Date(),
      });

      setLoading(false);
      Swal.fire({
        title: "<strong>Report Submitted</strong>",
        html: `<p>Your report to account <b>${reportedUsername}</b> has been submitted and will be reviewed by our admin.</p>`,
        icon: "success",
        iconColor: "#10b981",
        confirmButtonText: "OK",
        background: "#fff",
        color: "#1f2937",
        buttonsStyling: false,
        customClass: {
          popup: 'rounded-2xl shadow-md px-6 py-4',
          title: 'text-xl font-semibold mb-2 text-green-600',
          htmlContainer: 'text-sm text-gray-700',
          confirmButton: 'bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5',
        },
      }).then(() => {
        navigate("/");
      });

    } catch (error) {
      setLoading(false);
      console.error("Error submitting report:", error);
      Swal.fire({
        title: "<strong>Submission Failed</strong>",
        html: "<p>Failed to submit report. Please try again later.</p>",
        icon: "error",
        iconColor: "#dc2626",
        confirmButtonText: "OK",
        background: "#fff",
        color: "#1f2937",
        buttonsStyling: false,
        customClass: {
          popup: "rounded-2xl shadow-md px-6 py-4",
          title: "text-xl font-semibold mb-2",
          htmlContainer: "text-sm text-gray-700",
          confirmButton: "bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5",
        },
      });
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
      </div>
    </div>
  );
};

export default ReportAccountForm;