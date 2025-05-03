import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import defaultProfile from '../assets/profile_default.png';
import NavbarCard from '../components/NavbarCard.jsx';

const AccountSettingForm = () => {
  const user = useSelector((state) => state.auth.user);
  const [email, setEmail] = useState(user?.email || '');
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", user?.username);
    if (email) formData.append("email", email);
    if (photo) formData.append("photo", photo);

    try {
      const res = await axios.patch('/api/updateUserAccount', formData);
      setMessage(res.data.msg);
      setErrors({});
    } catch (err) {
      if (err.response?.status === 404) {
        setErrors(err.response.data);
      } else {
        setMessage("Server Error: " + err.message);
      }
    }
  };

  const photoPreview = photo instanceof File
    ? URL.createObjectURL(photo)
    : user?.photo
      ? `/backend/data/profile_photo/${user.photo}`
      : defaultProfile;

  return (
    <>
      <NavbarCard></NavbarCard>
      <form 
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-8 text-[#0A2239]">Set Up Your Account</h2>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <img
              src={photoPreview}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border"
            />
            <input 
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="mt-4"
            />
            {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
          </div>

          {/* Form Fields */}
          <div className="flex-1 space-y-5 w-full">
            {/* Username (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={user?.username || ''}
                readOnly
                className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded px-4 py-2"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-4 py-2"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Change Password Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <Link
                to={`/change-password/${(user && user.username)}`}
                className="text-blue-600 hover:underline text-sm"
              >
                Change your password
              </Link>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded hover:bg-blusponsorinHover"
          >
            Save Changes
          </button>
          {message && <p className="text-green-600 mt-4">{message}</p>}
        </div>
      </form>
    </>
  );
};

export default AccountSettingForm;