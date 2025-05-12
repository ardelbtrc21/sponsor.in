import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaPen } from 'react-icons/fa';
import defaultProfile from '../assets/profile_default.png';
import ModernLayout from '../components/Layout.jsx';
import Swal from 'sweetalert2';
import { Logout, reset } from '../features/authSlice.js';

const AccountSettingForm = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      if (err.response?.status === 404) {
        setErrors(err.response.data);
      } else {
        setMessage("Server Error: " + err.message);
      }
    }
  };

  const handleDeleteAccount = async () => {
    Swal.fire({
      title: `Are you sure to delete account "${user.username}" ?`,
      text: "Deleting your account is permanent and cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete("/api/user");
          await axios.delete("/api/logout");

          Swal.fire({
            title: "User Deleted!",
            text: "Redirecting to...",
            icon: "success",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });

          dispatch(reset());
          setTimeout(() => {
            navigate("/");
          }, 2000);

        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response?.data?.msg || "Something went wrong",
          });
        }
      }
    });
  };

  const photoPreview = photo
    ? URL.createObjectURL(photo)
    : user?.profile_photo
      ? `/profile_photo/${user.profile_photo}`
      : defaultProfile;

  return (
    <ModernLayout>
      <>
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="max-w-4xl mx-auto mt-10 p-6"
        >
          <h2 className="text-2xl font-bold text-center mb-8 text-[#0A2239]">Set Up Your Account</h2>

          {/* Profile Image */}
          <div className="flex justify-center mb-8">
            <div className="relative flex flex-col items-center">
              <img
                src={photoPreview}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
                className="mt-4 hidden"
                id="file-input"
              />
              {/* Icon Pencil */}
              <label
                htmlFor="file-input"
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full cursor-pointer"
              >
                <FaPen className="text-primary" size={20} />
              </label>
              {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
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
                  required
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
              {user.role !== 'Admin' && (
                <div className="flex justify-between items-center mt-8">
                  <button
                    type="button"
                    className="text-red-600 hover:underline text-sm font-semibold"
                    onClick={() => handleDeleteAccount()}
                  >
                    Delete Account
                  </button>
                </div>
              )}
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded hover:bg-secondary w-1/4"
              >
                Save Changes
              </button>
            </div>
          </div>
          {/* Submit Button */}
          <div className="mt-8 text-center">
            {message && <p className="text-green-600 mt-4">{message}</p>}
          </div>
        </form>
      </>
    </ModernLayout>
  );
};

export default AccountSettingForm;