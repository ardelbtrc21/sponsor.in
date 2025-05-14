import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import defaultProfile from '../assets/profile_default.png';
import { useSelector, useDispatch } from 'react-redux';
import ModernLayout from "../components/Layout";
import HistoryAgreement from "../components/HistoryAgreement";

const MyProfile = () => {
    const user = useSelector((state) => state.auth.user);
    const username = user.username;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [sponsor, setSponsor] = useState(null);
    const [sponsoree, setSponsoree] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    useEffect(() => {
        fetch(`/api/user/${username}`)
            .then((res) => {
                if (!res.ok) throw new Error("Gagal memuat data profile");
                return res.json();
            })
            .then((data) => {
                if (user.role === "Sponsor") {
                    setSponsor(data);
                }
                if (user.role === "Sponsoree") {
                    setSponsoree(data);
                }
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [username]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

    const photoPreviewProfile = user?.profile_photo
        ? `/profile_photo/${user.profile_photo}`
        : defaultProfile;
    const photoPreviewBanner = user?.background_photo ? `/api/background_photo/preview/${user?.background_photo}` : defaultProfile

    return (
        <ModernLayout>
            {user && user.role === "Sponsor" && (
                <div className="w-screen min-h-screen bg-white relative overflow-x-hidden pb-12">
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
            ${sponsor.user_sponsors.is_available ? 'bg-hijau text-white' : 'bg-red-500 text-white'}`}
                        >
                            {sponsor.user_sponsors.is_available ? 'Available' : 'Not Available'}
                        </span>

                        {/* Foto Profil */}
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
                                to="/edit-profile"
                                state={{ sponsor }}
                                className="border text-primary font-semibold text-xs px-3 py-1.5 rounded-lg transition border-primary bg-transparent hover:bg-primary hover:text-white"
                            >
                                Edit Profile
                            </Link>

                        </div>
                    </div>

                    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-6 mt-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Sponsor Info</h2>

                        {/* Category Provides */}
                        <p className="text-sm text-gray-700 mb-2">
                            <span className="font-semibold">Category Provides:</span>{" "}
                            {sponsor.user_sponsors.category_provides?.length > 0 ? (
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

                        {/* Tags Sponsor */}
                        <div className="text-sm text-gray-700 mb-2">
                            <span className="font-semibold">Tag Related:</span>{" "}
                            {sponsor.user_sponsors.tags_sponsors?.length > 0 ? (
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

                        {/* Target Market */}
                        <div className="text-sm text-gray-700">
                            <span className="font-semibold">Target Market:</span>{" "}
                            {sponsor.user_sponsors.target_sponsors?.length > 0 ? (
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
                            {sponsor.user_sponsors.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."}
                        </p>
                    </div>

                    {/* Sponsorships */}
                    <div className="mt-10 px-6">
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
                                : <div className="col-span-3 flex items-center justify-center w-full">
                                    <h2 className="text-lg text-center text-[#031930]">No photo uploaded.</h2>
                                </div>
                            }
                        </div>


                        <div className="mt-16 px-6 w-full">
                            <HistoryAgreement username={username} role={user.role} isMyProfile={true} />
                        </div>
                    </div>
                </div>
            )}
            {user && user.role === "Sponsoree" && (
                <div className="w-screen min-h-screen bg-white relative overflow-x-hidden pb-12">
                    {/* Banner */}
                    <div className="relative w-full">
                        <img
                            src={photoPreviewBanner}
                            className="w-screen h-72 object-cover"
                            style={{ imageRendering: "auto" }}
                            alt="banner"
                        />
                        <span className="absolute top-4 right-4 bg-hijau text-white text-sm px-3 py-1 rounded-full shadow-md">
                            {sponsoree.user_sponsorees.category}
                        </span>

                        {/* Foto Profil */}
                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-10">
                            <img
                                src={photoPreviewProfile}
                                alt="profile_photo"
                                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-center mt-20 text-center px-4">
                        <h1 className="text-2xl font-bold text-[#031930]">{sponsoree.name}</h1>
                        <p className="text-sm text-gray-500 mt-2">@{sponsoree.username}</p>

                        <div className="flex gap-3 mt-4">
                            <Link
                                to="/edit-profile"
                                state={{ sponsoree }}
                                className="border text-primary font-semibold text-xs px-3 py-1.5 rounded-lg transition border-primary bg-transparent hover:bg-primary hover:text-white"
                            >
                                Edit Profile
                            </Link>

                        </div>
                    </div>

                    {/* Sponsorships */}
                    <div className="mt-16 px-6">
                        <h2 className="text-2xl font-semibold text-center text-[#031930]">Our Sponsorships</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 max-w-6xl mx-auto">
                            {sponsoree.photo_sponsorship_users.length > 0
                                ? sponsoree.photo_sponsorship_users.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={`/api/sponsorship_photos/preview/${img.photo}`}
                                        alt={`sponsorship-${idx}`}
                                        className="rounded-xl w-full h-52 object-cover shadow-sm"
                                    />
                                ))
                                : <div className="col-span-3 flex items-center justify-center w-full">
                                    <h2 className="text-lg text-center text-[#031930]">No photo uploaded.</h2>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="mt-10 px-6 w-full">
                        <HistoryAgreement username={username} role={user.role} isMyProfile={true} />
                    </div>
                </div>
            )}
        </ModernLayout>
    );
};

export default MyProfile;