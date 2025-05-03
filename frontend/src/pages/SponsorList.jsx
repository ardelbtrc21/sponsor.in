import React, { useState, useEffect } from 'react';
import SponsorCard from '../components/SponsorCard';
import NavbarCard from '../components/NavbarCard';
import emptyImage from '../assets/empty_folder.png';

const SponsorList = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchSponsors = async () => {
    try {
      const res = await fetch(
        `/api/sponsors?search=${searchQuery}&sort=name&order=${sortOrder}`
      );
      if (!res.ok) throw new Error('Gagal memuat data sponsor');
      const data = await res.json();
      setSponsors(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, [searchQuery, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(inputValue.trim());
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4">
      <NavbarCard />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold text-[#031930] mb-8 text-center">
          MEET YOUR PERFECT SPONSOR!
        </h2>

        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 w-full">
          <form onSubmit={handleSearchSubmit} className="w-full sm:flex-1">
            <input
              type="text"
              placeholder="Type the Company Name to Search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded w-full text-sm"
            />
          </form>
          <button
            onClick={toggleSortOrder}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary whitespace-nowrap text-sm"
          >
            Sort by Name {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {/* Sponsor Cards */}
        {(sponsors.length === 0 && !loading) ? (
          <div className="flex flex-col items-center justify-center mt-16">
            <img src={emptyImage} alt="No sponsor" className="w-48 h-48 opacity-90 mb-4" />
            <p className="text-black text-lg">No sponsor found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {sponsors.map((sponsor) => (
              <SponsorCard key={sponsor.username} sponsor={sponsor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SponsorList;