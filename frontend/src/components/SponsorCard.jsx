import React from 'react';
import { useNavigate } from 'react-router-dom';
import defaultProfile from '../assets/profile_default.png';

const SponsorCard = ({ sponsor }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/sponsors/${sponsor.username}`)}
      className="relative bg-white shadow-md rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
    >
      {/* Profile Image */}
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <img
          src={sponsor.profile_photo ? `/profile_photo/${sponsor.profile_photo}` : defaultProfile}
          alt={sponsor.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Badge Availability */}
      <span
        className={`absolute top-4 right-4 px-4 py-1 rounded-full text-sm font-semibold shadow-lg transition-colors duration-300
          ${sponsor.is_available ? 'bg-hijau text-white' : 'bg-red-500 text-white'}`}
      >
        {sponsor.is_available ? 'Available' : 'Not Available'}
      </span>

      {/* Bottom Info */}
      <div className="flex justify-between items-center p-4">
        <div>
          <h3 className="text-lg font-semibold text-[#031930]">{sponsor.name}</h3>
        </div>
      </div>
    </div>
  );
};

export default SponsorCard;