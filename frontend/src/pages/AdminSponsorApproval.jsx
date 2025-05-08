import React, { useEffect, useState } from "react";
import axios from "axios";
import { Inbox } from "lucide-react";
import Swal from "sweetalert2";

const AdminPendingSponsorsPage = () => {
  const [pendingSponsors, setPendingSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);

  useEffect(() => {
    axios
      .get("/api/admin/pending-sponsors")
      .then((response) => {
        setPendingSponsors(response.data);
      })
      .catch((err) => console.error("Error fetching pending sponsors:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = (username) => {
    axios
      .put(`/api/admin/approve-sponsor/${username}`)
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Sponsor approved successfully",
          timer: 5000,
          showConfirmButton: false,
        });
        setPendingSponsors(pendingSponsors.filter(
          sponsor => sponsor.user_sponsors.username !== username
        ));
      })
      .catch((err) => {
        console.error("Error approving sponsor:", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to approve sponsor",
        });
      });
  };

  const handleReject = (username) => {
    axios
      .put(`/api/admin/reject-sponsor/${username}`)
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Sponsor rejected successfully",
          timer: 5000,
          showConfirmButton: false,
        });
        setPendingSponsors(pendingSponsors.filter(
          sponsor => sponsor.user_sponsors.username !== username
        ));
      })
      .catch((err) => {
        console.error("Error rejecting sponsor:", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to reject sponsor",
        });
      });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold tracking-wider text-center mb-8">
        Pending Sponsor Approvals
      </h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : pendingSponsors.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-10">
          <Inbox className="w-16 h-16 mb-4 text-primary" />
          <p className="text-lg font-medium">No pending sponsors</p>
          <p className="text-sm text-gray-400">You're all caught up 🎉</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pendingSponsors.map((sponsor) => (
          <div
            key={sponsor.sponsor_id}
            className="bg-white shadow-md rounded-xl p-5 border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-1">
              {sponsor.user_sponsors.name}
            </h2>
            <p className="text-sm text-gray-600 mb-1">
              Email: {sponsor.user_sponsors.email}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Status: <span className="font-medium">{sponsor.status}</span>
            </p>
            <button
              onClick={() => handleApprove(sponsor.user_sponsors.username)}
              className={`px-4 py-2 text-white rounded-md ${
                approving === sponsor.user_sponsors.username
                  ? "bg-primary cursor-not-allowed"
                  : "bg-primary hover:bg-green-700"
              }`}
              disabled={approving === sponsor.user_sponsors.username}
            >
              {approving === sponsor.user_sponsors.username
                ? "Approving..."
                : "Approve"}
            </button>
            <button
              onClick={() => handleReject(sponsor.user_sponsors.username)}
              className={`mx-2 px-4 py-2 text-white rounded-md ${
                approving === sponsor.user_sponsors.username
                  ? "bg-secondary cursor-not-allowed"
                  : "bg-secondary hover:bg-red-700"
              }`}
              disabled={approving === sponsor.user_sponsors.username}
            >
              {approving === sponsor.user_sponsors.username
                ? "Rejecting..."
                : "Reject"}
            </button>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default AdminPendingSponsorsPage;
