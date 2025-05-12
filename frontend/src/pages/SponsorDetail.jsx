import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import defaultProfile from '../assets/profile_default.png';

const SponsorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sponsor, setSponsor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/sponsors/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data sponsor");
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

  return (
    <div className="w-screen min-h-screen bg-white relative overflow-x-hidden">
      {/* Tombol back pojok kiri atas */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 text-[#031930] flex items-center gap-1 text-sm font-medium hover:text-blue-600 transition-colors duration-200"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      {/* Banner */}
      <div className="relative w-full">
        <img
          src={sponsor.profile_photo ? URL.createObjectURL(sponsor.profile_photo) : defaultProfile}
          className="w-screen h-72 object-cover"
          style={{ imageRendering: "auto" }}
          alt="banner"
        />
        <span className="absolute top-4 right-4 bg-green-500 text-white text-sm px-3 py-1 rounded-full shadow-md">
          {sponsor.status || "Available"}
        </span>

        {/* Foto Profil */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-10">
          <img
              src={sponsor.profile_photo ? URL.createObjectURL(sponsor.profile_photo) : defaultProfile}
            alt="profile_photo"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
          />
        </div>
      </div>

      {/* Info Sponsor */}
      <div className="flex flex-col items-center mt-20 text-center px-4">
        <h1 className="text-2xl font-bold text-[#031930]">{sponsor.name}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
          <span>⭐ {sponsor.rating || 4.5}</span>
          <span>• {sponsor.deals || "1K"} Deals</span>
          <span>• {sponsor.reports || 0} Reports</span>
        </div>

        <div className="flex gap-3 mt-4">
        <Link
            to={`/proposal/create/${sponsor.sponsor_id}`}
            className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors duration-200"
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
      </div>

      {/* About */}
      <div className="mt-20 text-center px-6">
        <h2 className="text-2xl font-semibold text-[#031930]">About Us</h2>
        <p className="mt-3 text-gray-700 max-w-4xl mx-auto leading-relaxed">
          {sponsor.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."}
        </p>
      </div>

      {/* Sponsorships */}
      <div className="mt-16 px-6">
        <h2 className="text-2xl font-semibold text-center text-[#031930]">Our Sponsorships</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 max-w-6xl mx-auto">
          {(sponsor.sponsorships || [
            "https://i.pinimg.com/736x/75/bb/c1/75bbc141800fa53fb59c6a06bc2c27c3.jpg",
            "https://i.pinimg.com/474x/eb/fb/02/ebfb0275b4e79fcfb02928300e71bcf2.jpg",
            "https://i.pinimg.com/474x/c3/15/4e/c3154e3047a094b517dead55017adee0.jpg",
          ]).map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`sponsorship-${idx}`}
              className="rounded-xl w-full h-52 object-cover shadow-sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorDetail;