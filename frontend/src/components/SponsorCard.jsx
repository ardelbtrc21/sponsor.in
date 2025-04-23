import React from 'react';
import { useNavigate } from 'react-router-dom';

const SponsorCard = ({ sponsor }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/sponsors/${sponsor.username}`)}
      className="bg-white shadow-md rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
    >
      {/* Profile Image */}
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <img
          src={sponsor.profile_photo || '/default-profile.png'}
          alt={sponsor.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Bottom Info */}
      <div className="flex justify-between items-center p-4">
        <div>
          <h3 className="text-lg font-semibold text-[#031930]">{sponsor.name}</h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">⭐ {sponsor.rating || 'N/A'}</p>
          <p className="text-sm text-gray-500">{sponsor.deals || 0} deals</p>
        </div>
      </div>
    </div>
  );
};

export default SponsorCard;