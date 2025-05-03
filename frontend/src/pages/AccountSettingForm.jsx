import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const AccountSettingForm = () => {
  const user = useSelector((state) => state.auth.user); // Ambil user dari redux
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [availability, setAvailability] = useState(user?.availability || false);
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const isSponsor = user?.role === 'Sponsor';

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", user && user.username);
    console.log("username disini isinya apa? " + user && user.username)
    if (email) formData.append("email", email);
    if (password) formData.append("password", password);
    if (confirmPassword) formData.append("confirmPassword", confirmPassword);
    if (photo) formData.append("photo", photo);
    if (isSponsor) formData.append("availability", availability);

    try {
      const res = await axios.patch('/api/updateAccount', formData);
      setMessage(res.data.msg);
      setErrors({});
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setErrors(err.response.data);
      } else {
        setMessage("Server Error: " + err.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4 max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Update Account</h2>

      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full" />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full" />
        {errors.password && <p className="text-red-500">{errors.password}</p>}
      </div>

      <div>
        <label>Confirm Password:</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
          className="border p-2 w-full" />
        {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
      </div>

      {isSponsor && (
        <div className="flex items-center">
          <input type="checkbox" id="availability" checked={availability} onChange={() => setAvailability(!availability)} />
          <label htmlFor="availability" className="ml-2">Available for Sponsoring</label>
        </div>
      )}

      <div>
        <label>Profile Photo:</label>
        <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
        {errors.photo && <p className="text-red-500">{errors.photo}</p>}
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Update Account
      </button>

      {message && <p className="text-green-600 mt-4">{message}</p>}
    </form>
  );
};

export default AccountSettingForm;