import React, { useState, useEffect } from 'react';
import SponsorCard from '../components/SponsorCard'; 
import NavbarCard from '../components/NavbarCard';   

const SponsorList = () => {
  const [sponsors, setSponsors] = useState([]);  
  const [loading, setLoading] = useState(true);   
  const [error, setError] = useState(null);      

  useEffect(() => {
    fetch('/api/sponsors')
      .then((res) => {
        if (!res.ok) throw new Error('Gagal memuat data sponsor');
        return res.json();
      })
      .then((data) => {
        setSponsors(data); 
        setLoading(false);   
      })
      .catch((err) => {
        setError(err.message); 
        setLoading(false);     
      });
  }, []);  

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4">
      <NavbarCard />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold text-[#031930] mb-6 text-center">
          MEET YOUR PERFECT SPONSOR!
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {sponsors.map((sponsor) => (
            <SponsorCard key={sponsor.username} sponsor={sponsor} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorList;