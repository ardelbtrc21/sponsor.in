import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import HistoryAgreement from "./HistoryAgreement";

const HistoryAgreementWrapper = () => {
  const { username } = useParams();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await axios.get(`/api/users/${username}`);
        setRole(res.data.role);
      } catch (err) {
        console.error("Failed to fetch role:", err);
      }
    };

    fetchRole();
  }, [username]);

  return role ? (
    <HistoryAgreement username={username} role={role} />
  ) : (
    <p className="text-center mt-6">Loading user data...</p>
  );
};

export default HistoryAgreementWrapper;
