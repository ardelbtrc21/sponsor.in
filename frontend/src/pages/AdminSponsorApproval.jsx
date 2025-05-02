import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPendingSponsorsPage = () => {
  const [pendingSponsors, setPendingSponsors] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/pending-sponsors")
      .then((response) => {
        console.log("API response:", response.data);
        setPendingSponsors(response.data);
      })
      .catch((err) => console.error("Error fetching pending sponsors:", err));
  }, []);

  const handleApprove = (username) => {
    axios
      .put(`http://localhost:5000/api/admin/approve-sponsor/${username}`)
      .then((response) => {
        alert("Sponsor approved successfully");
        setPendingSponsors(pendingSponsors.filter(sponsor => sponsor.user_sponsors.username !== username));
      })
      .catch((err) => console.error("Error approving sponsor:", err));
  };

  return (
    <div className="admin-pending-sponsors">
      <h1 className="text-center text-2xl mb-6">Pending Sponsor Approvals</h1>

      <div className="pending-sponsors-list">
        {pendingSponsors.length === 0 ? (
          <p>No pending sponsors</p>
        ) : (
          <ul>
            {pendingSponsors.map((sponsor) => (
              <li key={sponsor.sponsor_id} className="flex justify-between p-4 border-b">
                <div>
                  <h3 className="font-bold">{sponsor.user_sponsors.name}</h3>
                  <p>{sponsor.user_sponsors.email}</p>
                  <p>Status: {sponsor.status}</p>
                </div>
                <button
                  onClick={() => handleApprove(sponsor.user_sponsors.username)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminPendingSponsorsPage;
