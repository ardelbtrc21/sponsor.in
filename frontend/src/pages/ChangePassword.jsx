import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import NavbarCard from '../components/NavbarCard.jsx';

const ChangePassword = () => {
  const user = useSelector((state) => state.auth.user);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/change-password', {
        username: user?.username,
        currentPassword,
        newPassword,
        confirmPassword
      });
      setMessage(res.data.msg);
      setErrors({});
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err.response?.status === 400) {
        setErrors(err.response.data);
      } else {
        setMessage("Server Error: " + err.message);
      }
    }
  };

  return (
    <>
      <NavbarCard></NavbarCard>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-[#0A2239]">Change Password</h2>

        {/* Current Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-4 py-2"
          />
          {errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>}
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-4 py-2"
          />
          {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
        </div>

        {/* Confirm New Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-4 py-2"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Update Password
          </button>
          {message && <p className="text-green-600 mt-4">{message}</p>}
        </div>
      </form>
    </>
  );
};

export default ChangePassword;
