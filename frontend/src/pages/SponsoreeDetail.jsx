import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import defaultProfile from '../assets/profile_default.png';
import { useSelector, useDispatch } from 'react-redux';
import ModernLayout from "../components/Layout";
import HistoryAgreement from "../components/HistoryAgreement";
import axios from "axios";
import Swal from "sweetalert2";

const SponsoreeDetail = () => {
    const { id } = useParams();
    console.log(id)
    const user = useSelector((state) => state.auth.user);
    const username = user.username;
    const navigate = useNavigate();
    const dispatch = useDispatch();
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

    const handleBanAccount = async () => {
        try {
            await axios.patch("/api/banAccount", {
                username: sponsoree.username
            })
            Swal.fire({
                title: "<strong>Ban Account Successful!</strong>",
                html: "<p>Your request has been successfully added</p>",
                icon: "success",
                iconColor: "#10b981",
                showCancelButton: false,
                confirmButtonText: "OK",
                background: "#fff",
                color: "#1f2937",
                buttonsStyling: false,
                customClass: {
                    popup: 'rounded-2xl shadow-md px-6 py-4',
                    title: 'text-xl font-semibold mb-2 text-green-600',
                    htmlContainer: 'text-sm text-gray-700',
                    confirmButton: 'bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5',
                },
            });
            navigate(-1);
        } catch (error) {
            Swal.fire({
                title: "<strong>Oops...</strong>",
                html: `<p>${error.response.data.msg}</p>`,
                icon: "error",
                iconColor: "#dc2626",
                showCancelButton: false,
                confirmButtonText: "OK",
                background: "#fff",
                color: "#1f2937",
                buttonsStyling: false,
                customClass: {
                    popup: 'rounded-2xl shadow-md px-6 py-4',
                    title: 'text-xl font-semibold mb-2 text-red-600',
                    htmlContainer: 'text-sm text-gray-700',
                    confirmButton: 'bg-[#dc2626] text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5',
                },
            });
        }
    }

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

                {!sponsoree.is_banned && (
                    <div>
                        <div className="flex flex-col items-center mt-20 text-center px-4">
                            <h1 className="text-2xl font-bold text-[#031930]">{sponsoree.name}</h1>
                            <p className="text-sm text-gray-500 mt-2">@{sponsoree.username}</p>

                            <div className="flex gap-3 mt-4">
                                {user.role === "Sponsor" && (
                                    <Link
                                        to={`/report/${sponsoree.username}`}
                                        className="bg-primary text-white px-5 py-2 rounded-md text-sm hover:bg-gray-700 transition-opacity duration-200"
                                    >
                                        Report
                                    </Link>
                                )}
                                {user && user.role === "Admin" && (
                                    <Link
                                        onClick={() => handleBanAccount()}
                                        className="border text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition bg-red-700 hover:bg-red-600 flex items-center justify-center">
                                        Ban Account
                                    </Link>
                                )}
                            </div>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 max-w-6xl mx-auto min-h-[13rem]">
                            {sponsoree.photo_sponsorship_users.length > 0 ? (
                                sponsoree.photo_sponsorship_users.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={`/api/sponsorship_photos/preview/${img.photo}`}
                                        alt={`sponsorship-${idx}`}
                                        className="rounded-xl w-full h-52 object-cover shadow-sm"
                                    />
                                ))
                            ) : (
                                <div className="col-span-full flex justify-center items-center min-h-[13rem]">
                                    <h2 className="text-lg font-semibold text-[#031930]">No photo uploaded.</h2>
                                </div>
                            )}
                        </div>

                        <HistoryAgreement username={id} role={"Sponsoree"} isMyProfile={true} />
                    </div>
                )}
            </div>
            {sponsoree.is_banned && (
                <div>
                    <div className="flex flex-col items-center mt-20 text-center px-4">
                        <h1 className="text-2xl font-bold text-[#031930]">{sponsoree.name}</h1>
                        <p className="text-sm text-gray-500 mt-2">@{sponsoree.username}</p>
                    </div>
                    <div className="flex justify-center pt-10">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">This account is already banned.</h2>
                    </div>
                </div>
            )}
        </ModernLayout>
    );
}
export default SponsoreeDetail;