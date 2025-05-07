import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import defaultProfile from '../assets/profile_default.png';

const EditProfile = ({ sponsor }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const passedSponsor = location.state?.sponsor;
    const user = useSelector((state) => state.auth.user);
    const username = user.username;

    const [sponsorData, setSponsorData] = useState(passedSponsor || null);
    const [showBgDropdown, setShowBgDropdown] = useState(false);

    const [formData, setFormData] = useState({
        background_photo: null,
        is_available: false,
        category_provides: "",
        description: "",
        sponsorship_photos: [],
        tags: [],
        targets: [],
    });

    useEffect(() => {
        if (passedSponsor) {
            setSponsorData(passedSponsor);
        } else {
            fetch(`/api/user/${username}`)
                .then((res) => res.json())
                .then((data) => setSponsorData(data))
                .catch((err) => console.error(err));
        }
    }, [passedSponsor, username]);

    useEffect(() => {
        if (sponsorData) {
            setFormData({
                background_photo: null,
                is_available: sponsorData.user_sponsors?.is_available || false,
                category_provides: sponsorData.user_sponsors?.category_provides || "",
                description: sponsorData.user_sponsors?.description || "",
                sponsorship_photos: sponsorData.photo_sponsorship_users || [],
                tags: sponsorData.user_sponsors?.tags_sponsors || [],
                targets: sponsorData.user_sponsors?.target_sponsors || [],
            });
        }
    }, [sponsorData]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".bg-dropdown")) {
                setShowBgDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "checkbox") {
            setFormData({ ...formData, [name]: checked });
        } else if (type === "file") {
            if (name === "sponsorship_photos") {
                setFormData({ ...formData, [name]: Array.from(files) });
            } else {
                setFormData({ ...formData, [name]: files[0] });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSave = () => {
        console.log(formData);
    };

    const profilePhoto = sponsorData?.profile_photo ? sponsorData.profile_photo : defaultProfile;
    const bannerPhoto = formData.background_photo
        ? URL.createObjectURL(formData.background_photo)
        : (sponsorData?.background_photo || defaultProfile);

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="relative h-60 w-full">
                <img
                    src={bannerPhoto}
                    alt="Banner"
                    className="h-full w-full object-cover"
                />

                <div className="absolute bottom-2 right-2 bg-dropdown">
                    <button
                        onClick={() => setShowBgDropdown(!showBgDropdown)}
                        className="absolute bottom-2 right-2 bg-white text-black p-1 rounded-full hover:bg-gray-200"
                        title="Edit background"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 11l6-6m2 2L7 17H4v-3l11-11z" />
                        </svg>
                    </button>

                    {showBgDropdown && (
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg z-50 py-1 text-sm">
                            <button
                                onClick={() => {
                                    if (sponsorData?.background_photo || formData.background_photo) {
                                        setFormData({ ...formData, background_photo: null });
                                        setSponsorData({ ...sponsorData, background_photo: null });
                                    }
                                    setShowBgDropdown(false);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                Remove
                            </button>
                            <button
                                onClick={() => {
                                    document.getElementById('uploadBackgroundInput').click();
                                    setShowBgDropdown(false);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                Upload
                            </button>
                        </div>
                    )}
                </div>

                <div className="absolute top-4 left-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-white bg-black/40 hover:bg-black/60 px-3 py-1 rounded-full flex items-center gap-2"
                    >
                        <ArrowLeft size={18} />
                        <span className="text-sm">Back</span>
                    </button>
                </div>
                <div className="absolute top-4 right-4">
                    <button
                        onClick={handleSave}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow"
                    >
                        Save changes
                    </button>
                </div>
                <div className="absolute -bottom-12 left-6 flex items-center gap-4">
                    <img
                        src={profilePhoto}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-4 border-white object-cover"
                    />
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">{sponsorData?.name || "Sponsor Name"}</h1>
                        <p className="text-sm text-gray-500">@{sponsorData?.username || "username"}</p>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="mt-20 max-w-3xl mx-auto px-4 py-8 bg-white">
                <div className="space-y-6">

                    <input
                        type="file"
                        id="uploadBackgroundInput"
                        name="background_photo"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                    />

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="is_available"
                            checked={formData.is_available}
                            onChange={handleChange}
                            className="h-4 w-4 text-green-600 border-gray-300 rounded"
                        />
                        <label className="text-sm">Available for Sponsorship</label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category Provides</label>
                        <input
                            type="text"
                            name="category_provides"
                            value={formData.category_provides}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">About Us (Description)</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 min-h-[100px]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Sponsorship Photos</label>
                        <input type="file" name="sponsorship_photos" multiple accept="image/*" onChange={handleChange} />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                            {formData.sponsorship_photos.map((photo, idx) => (
                                <img
                                    key={idx}
                                    src={typeof photo === "string" ? photo : URL.createObjectURL(photo)}
                                    alt={`preview-${idx}`}
                                    className="w-full h-24 object-cover rounded"
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Tags</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags.map((t) => t.tag_name).join(", ")}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    tags: e.target.value.split(",").map((tag) => ({ tag_name: tag.trim() })),
                                })
                            }
                            className="w-full border rounded px-3 py-2"
                            placeholder="e.g., Tech, Finance"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Target Market</label>
                        <input
                            type="text"
                            name="targets"
                            value={formData.targets.map((t) => t.target_participant_category).join(", ")}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    targets: e.target.value.split(",").map((target) => ({
                                        target_participant_category: target.trim(),
                                    })),
                                })
                            }
                            className="w-full border rounded px-3 py-2"
                            placeholder="e.g., Students, Professionals"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;