import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const AccountSetting = () => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confPassword: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/user/${user.username}`);
        setFormData({
          name: res.data.name,
          email: res.data.email,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [user.username]);

  const handleAccountUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch("/api/updateUserAccount", {
        ...formData,
        username: user.username,
      });
      setMessage("Account updated successfully.");
    } catch (err) {
      setMessage(err.response?.data?.msg || "Update failed.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/changePassword", passwordData);
      setMessage("Password changed successfully.");
      setPasswordData({ currentPassword: "", newPassword: "", confPassword: "" });
    } catch (err) {
      setMessage(err.response?.data?.msg || "Password update failed.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Account Settings</h2>

      <form onSubmit={handleAccountUpdate} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            className="w-full border px-3 py-2 rounded"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            className="w-full border px-3 py-2 rounded"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Update Account
        </button>
      </form>

      <hr className="my-6" />

      <form onSubmit={handlePasswordChange} className="space-y-4">
        <div>
          <label className="block mb-1">Current Password</label>
          <input
            type="password"
            value={passwordData.currentPassword}
            className="w-full border px-3 py-2 rounded"
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1">New Password</label>
          <input
            type="password"
            value={passwordData.newPassword}
            className="w-full border px-3 py-2 rounded"
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1">Confirm New Password</label>
          <input
            type="password"
            value={passwordData.confPassword}
            className="w-full border px-3 py-2 rounded"
            onChange={(e) => setPasswordData({ ...passwordData, confPassword: e.target.value })}
          />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Change Password
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
    </div>
  );
};

export default AccountSetting;