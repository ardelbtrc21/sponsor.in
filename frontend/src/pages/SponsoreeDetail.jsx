import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import defaultProfile from '../assets/profile_default.png';
import { useSelector, useDispatch } from 'react-redux';
import ModernLayout from "../components/Layout";
import HistoryAgreement from "../components/HistoryAgreement";

const SponsoreeDetail = () => {
    const { id } = useParams();
    console.log(id)
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
        fetch(`/api/user/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Gagal memuat data profile");
                return res.json();
            })
            .then((data) => {
                setSponsoree(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

    const photoPreviewProfile = sponsoree?.profile_photo
        ? `/profile_photo/${sponsoree.profile_photo}`
        : defaultProfile;
    const photoPreviewBanner = sponsoree?.background_photo ? `/api/background_photo/preview/${sponsoree?.background_photo}` : defaultProfile;

    return (
        <ModernLayout>
            <div className="w-screen min-h-screen bg-white relative overflow-x-hidden pb-12">
                {/* Banner */}
                <div className="relative w-full">
                    <img
                        src={photoPreviewBanner}
                        className="w-screen h-72 object-cover"
                        style={{ imageRendering: "auto" }}
                        alt="banner"
                    />
                    <span className="absolute top-4 right-4 bg-green-500 text-white text-sm px-3 py-1 rounded-full shadow-md">
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
                </div>
                <HistoryAgreement username={id} role={"Sponsoree"} isMyProfile={true} />
            </div>
        </ModernLayout>
    );
};

export default SponsoreeDetail;