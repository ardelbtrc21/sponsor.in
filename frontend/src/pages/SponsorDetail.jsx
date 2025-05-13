import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import defaultProfile from '../assets/profile_default.png';
import ModernLayout from "../components/Layout";
import HistoryAgreement from "../components/HistoryAgreement";

const SponsorDetail = () => {
  const authUser = useSelector((state) => state.auth.user);
  const { id } = useParams(); // username sponsor dari URL
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [sponsor, setSponsor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/user/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data profile");
        return res.json();
      })
      .then((data) => {
        setSponsor(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  if (!sponsor) return null;

  const photoPreviewProfile = sponsor.profile_photo
    ? `/profile_photo/${sponsor.profile_photo}`
    : defaultProfile;
  const photoPreviewBanner = sponsor.background_photo
    ? `/api/background_photo/preview/${sponsor.background_photo}`
    : defaultProfile;

  return (
    <ModernLayout>
      {/* Banner */}
      <div className="relative w-full">
        <img
          src={photoPreviewBanner}
          className="w-screen h-72 object-cover"
          style={{ imageRendering: "auto" }}
          alt="banner"
        />
        <span
          className={`absolute top-4 right-20 px-4 py-1 rounded-full text-sm font-semibold shadow-lg transition-colors duration-300
            ${sponsor.user_sponsors?.is_available ? 'bg-hijau text-white' : 'bg-red-500 text-white'}`}
        >
          {sponsor.user_sponsors?.is_available ? 'Available' : 'Not Available'}
        </span>
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-10">
          <img
            src={photoPreviewProfile}
            alt="profile_photo"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
          />
        </div>
      </div>

      {/* Info Sponsor */}
      <div className="flex flex-col items-center mt-20 text-center px-4">
        <h1 className="text-2xl font-bold text-[#031930]">{sponsor.name}</h1>
        <p className="text-sm text-gray-500 mt-2">@{sponsor.username}</p>

        <div className="flex gap-3 mt-4">
          <Link
            to={`/proposal/create/${sponsor.user_sponsors?.sponsor_id}`}
            state={{ sponsor }}
            className="border text-primary font-semibold text-xs px-3 py-1.5 rounded-lg transition border-primary bg-transparent hover:bg-primary hover:text-white"
          >
            Submit a Proposal
          </Link>
          <Link
            to={`/report/${sponsor.username}`}
            className="bg-black text-white px-5 py-2 rounded-md text-sm hover:opacity-90 transition-opacity duration-200"
          >
            Report
          </Link>
        </div>

        {/* Info Box */}
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sponsor Info</h2>

          <p className="text-sm text-gray-700 mb-2">
            <span className="font-semibold">Category Provides:</span>{" "}
            {sponsor.user_sponsors?.category_provides?.length > 0 ? (
              sponsor.user_sponsors.category_provides.split(',').map((cat, idx) => (
                <span
                  key={idx}
                  className="inline-block mx-1 mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs"
                >
                  {cat}
                </span>
              ))
            ) : (
              <span className="ml-1">-</span>
            )}
          </p>

          <div className="text-sm text-gray-700 mb-2">
            <span className="font-semibold">Tag Related:</span>{" "}
            {sponsor.user_sponsors?.tags_sponsors?.length > 0 ? (
              sponsor.user_sponsors.tags_sponsors.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-block mx-1 mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs"
                >
                  {tag.tag_name}
                </span>
              ))
            ) : (
              <span className="ml-1">-</span>
            )}
          </div>

          <div className="text-sm text-gray-700">
            <span className="font-semibold">Target Market:</span>{" "}
            {sponsor.user_sponsors?.target_sponsors?.length > 0 ? (
              sponsor.user_sponsors.target_sponsors.map((target, idx) => (
                <span
                  key={idx}
                  className="inline-block mx-1 mt-1 px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs"
                >
                  {target.target_participant_category}
                </span>
              ))
            ) : (
              <span className="ml-1">-</span>
            )}
          </div>
        </div>

        {/* About */}
        <div className="mt-20 text-center px-6">
          <h2 className="text-2xl font-semibold text-[#031930]">About Us</h2>
          <p className="mt-3 text-gray-700 max-w-4xl mx-auto leading-relaxed">
            {sponsor.user_sponsors?.description || "No description provided."}
          </p>
        </div>
        {/* Sponsorships */}
        <div className="mt-16 px-6">
          <h2 className="text-2xl font-semibold text-center text-[#031930]">Our Sponsorships</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 max-w-6xl mx-auto">
            {sponsor.photo_sponsorship_users.length > 0
              ? sponsor.photo_sponsorship_users.map((img, idx) => (
                <img
                  key={idx}
                  src={`/api/sponsorship_photos/preview/${img.photo}`}
                  alt={`sponsorship-${idx}`}
                  className="rounded-xl w-full h-52 object-cover shadow-sm"
                />
              ))
              : [
                "https://i.pinimg.com/736x/75/bb/c1/75bbc141800fa53fb59c6a06bc2c27c3.jpg",
                "https://i.pinimg.com/474x/eb/fb/02/ebfb0275b4e79fcfb02928300e71bcf2.jpg",
                "https://i.pinimg.com/474x/c3/15/4e/c3154e3047a094b517dead55017adee0.jpg",
              ].map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`sponsorship-${idx}`}
                  className="rounded-xl w-full h-52 object-cover shadow-sm"
                />
              ))}
          </div>
          <HistoryAgreement username={id} role={sponsor.role} isMyProfile={true} />
        </div>
      </div>
    </ModernLayout>
  );
};

export default SponsorDetail;