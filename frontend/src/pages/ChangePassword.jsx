import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import ikon mata
import ModernLayout from '../components/Layout.jsx';

const ChangePassword = () => {
  const user = useSelector((state) => state.auth.user);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  
  // State untuk kontrol visibility password
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/changePassword', {
        username: user?.username,
        currentPassword,
        newPassword,
        confPassword: confirmPassword,
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
    <ModernLayout>
      <>
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto mt-10 p-6"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-[#0A2239]">Change Password</h2>

          {/* Current Password */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type={showCurrentPassword ? 'text' : 'password'} // Toggle between text and password
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-4 py-2"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)} // Toggle password visibility
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>}
          </div>

          {/* New Password */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-4 py-2"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
          </div>

          {/* Confirm New Password */}
          <div className="mb-6 relative">
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-4 py-2"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded hover:bg-secondary"
            >
              Update Password
            </button>
            {message && <p className="text-green-600 mt-4">{message}</p>}
          </div>
        </form>
      </>
    </ModernLayout>
  );
};

export default ChangePassword;