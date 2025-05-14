import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ModernLayout from '../components/Layout.jsx';

const ChangePassword = () => {
  const user = useSelector((state) => state.auth.user);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState({});

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await axios.post('/api/changePassword', {
        username: user?.username,
        currentPassword,
        newPassword,
        confPassword: confirmPassword,
      });
      setSuccessMsg(res.data.msg);
      setErrors({});
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err.response?.status === 400) {
        setErrors(err.response.data);
      } else if (err.response?.status === 502){
        setErrorMsg("Can't use the same password!");
      }
      else {
        setErrorMsg("Server Error: " + err.message);
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
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-4 py-2 pr-10" 
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div className="mb-6 relative">
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-4 py-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="mb-6 relative">
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-4 py-2 pr-10" 
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded hover:bg-secondary"
            >
              Update Password
            </button>
            {successMsg && <p className="text-green-600 mt-4">{successMsg}</p>}
            {errorMsg && <p className="text-red-600 mt-4">{errorMsg}</p>}
          </div>
        </form>
      </>
    </ModernLayout>
  );
};

export default ChangePassword;