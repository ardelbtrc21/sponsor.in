import React, { useState, useEffect } from 'react';
import SponsorCard from '../components/SponsorCard';
import NavbarCard from '../components/NavbarCard';
import emptyImage from '../assets/empty_folder.png';
import ModernLayout from '../components/Layout';
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"

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

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setSearchQuery(inputValue.trim());
    await fetchSponsors()
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

  return (
    <ModernLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold text-[#031930] mb-8 text-center">
          Meet Your Perfect Sponsor!
        </h2>

        {/* Search and Sort Controls */}
        <div className="flex items-center mb-4 w-full gap-2">
          {/* Search Input */}
          <div className="relative flex-grow">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Type the Company Name to Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full text-sm focus:outline-none"
            />
          </div>

          {/* Sort Button */}
          <button
            onClick={toggleSortOrder}
            className="bg-primary text-white text-sm px-4 py-2 rounded-md hover:bg-secondary whitespace-nowrap"
            style={{ flexShrink: 0 }}
          >
            Sort by Name {sortOrder === "asc" ? "↑" : "↓"}
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
    </ModernLayout>
  );
};

export default SponsorList;