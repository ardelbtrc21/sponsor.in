import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import defaultProfile from '../assets/profile_default.png';
import { InboxOutlined } from "@ant-design/icons";
import { Upload, Select } from "antd";
import axios from "axios";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
const { Dragger } = Upload;

const EditProfile = ({ sponsor: sponsoree }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const fileInputRef = useRef(null);
    const [tagsDB, SetTagsDB] = useState([]);
    const [tags, setTags] = useState([]);
    const filteredTags = tagsDB.filter(o => !tags.includes(o));
    const [targetsDB, SetTargetsDB] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [targets, setTargets] = useState([]);
    const filteredTargets = targetsDB.filter(o => !targets.includes(o));
    const passedSponsor = location.state?.sponsor;
    const passedSponsoree = location.state?.sponsoree;
    const user = useSelector((state) => state.auth.user);
    const username = user.username;
    const [removedPhotos, setRemovedPhotos] = useState([]);
    const [sponsorData, setSponsorData] = useState(passedSponsor || null);
    const [sponsoreeData, setSponsoree] = useState(passedSponsoree || null);
    const [showBgDropdown, setShowBgDropdown] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        background_photo: null,
        is_available: false,
        category_provides: "",
        description: "",
        sponsorship_photos: [],
        tags: [],
        targets: [],
        category: ""
    });

    useEffect(() => {
        if (location.state?.sponsor) {
            setSponsorData(passedSponsor);
        }
    }, [passedSponsor, username, location.state?.sponsor]);
    useEffect(() => {
        if (location.state?.sponsoree) {
            setSponsoree(passedSponsoree);
        }
    }, [passedSponsoree, username, location.state?.sponsoree]);

    useEffect(() => {
        if (sponsorData) {
            console.log(sponsorData)
            setFormData({
                name: sponsorData.name,
                background_photo: sponsorData.background_photo,
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
        if (sponsoreeData) {
            setFormData({
                name: sponsoreeData.name,
                background_photo: sponsoreeData.background_photo,
                sponsorship_photos: sponsoreeData.photo_sponsorship_users || [],
                category: sponsoreeData.user_sponsorees?.category || ""
            });
        }
    }, [sponsoreeData]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".bg-dropdown")) {
                setShowBgDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!fileInputRef.current) {
            console.warn("fileInputRef not ready");
        }
    }, []);

    const handleBackgroundPhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                background_photo: file,
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "checkbox") {
            setFormData({ ...formData, [name]: checked });
        } else if (type === "file") {
            setFormData({ ...formData, [name]: files[0] });
        }
        else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSponsorshipPhotoChange = (info) => {
        const maxFile = 5
        if (formData.sponsorship_photos.length <= maxFile) {
            const newFiles = info.fileList.slice(-1)
                .map((file) => file.originFileObj)
                .filter((file) => !!file); // pastikan bukan undefined/null

            setFileList(newFiles);
            setFormData((prevData) => ({
                ...prevData,
                sponsorship_photos: [...prevData.sponsorship_photos, ...newFiles],
            }));
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "You can upload max 3 photos",
            });
        }
    };

    const handleRemoveSponsorshipPhoto = (idx) => {
        const photoToRemove = formData.sponsorship_photos[idx];

        if (!(photoToRemove instanceof File)) {
            // Jika itu bukan File baru, berarti foto lama dari server → simpan nama/ID-nya
            setRemovedPhotos((prev) => [...prev, photoToRemove.photo]);
        }

        setFormData((prev) => ({
            ...prev,
            sponsorship_photos: prev.sponsorship_photos.filter((_, i) => i !== idx),
        }));
    };


    const getTags = async () => {
        try {
            const response = await axios.get("/api/tags");
            const tagNames = response.data.map(item => item.tag_name);
            SetTagsDB(tagNames);
        } catch (error) {
            console.log(error);
        }
    };

    const getTargets = async () => {
        try {
            const response = await axios.get("/api/targets");
            const targetCategory = response.data.map(item => item.target_participant_category);
            SetTargetsDB(targetCategory);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getTags()
        getTargets()
        console.log(formData.category)
    }, []);


    const handleSave = () => {
        console.log(formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("username", username);
        data.append("name", formData.name);
        data.append("is_available", formData.is_available);
        data.append("category_provides", formData.category_provides);
        data.append("description", formData.description);
        data.append("category", formData.category);
        console.log(formData.category)
        data.append("removed_photos", JSON.stringify(removedPhotos))

        if (formData.background_photo instanceof File) {
            data.append("background_photo", formData.background_photo);
        }

        // 1. Tambahkan sponsorship_photos baru (File)
        formData.sponsorship_photos.forEach((item) => {
            if (item instanceof File) {
                data.append("sponsorship_photos", item);
            }
        });

        // 2. Tambahkan sponsorship_photos lama (bukan File)
        const existingPhotos = formData.sponsorship_photos
            .filter((item) => !(item instanceof File))
            .map((item) => item.photo); // ambil filename-nya atau ID-nya
        data.append("existing_photos", JSON.stringify(existingPhotos));

        data.append("tags", JSON.stringify(formData.tags));
        data.append("targets", JSON.stringify(formData.targets));

        try {
            const response = await axios.patch("/api/editProfile", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Profile updated:", response.data);
            navigate("/my-profile", { replace: true }); // ganti dengan path yang sesuai
            window.location.reload(); // paksa reload
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };
    //testing

    const profilePhoto = user?.profile_photo
        ? `/profile_photo/${user.profile_photo}`
        : defaultProfile;
    let bannerPhoto;
    if (!formData?.background_photo && !sponsorData?.background_photo && !sponsoreeData?.background_photo) {
        bannerPhoto = defaultProfile
    } else if (formData?.background_photo && formData?.background_photo !== (sponsorData?.background_photo || sponsoreeData?.background_photo)) {
        bannerPhoto = URL.createObjectURL(formData.background_photo);
    } else if (sponsorData?.background_photo || sponsoreeData?.background_photo) {
        bannerPhoto = sponsorData?.background_photo ? `/api/background_photo/preview/${sponsorData.background_photo}` : `/api/background_photo/preview/${sponsoreeData.background_photo}`;
    }

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
                        className="bg-white text-black p-1 rounded-full hover:bg-gray-200"
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
                                    if ((user?.background_photo || formData.background_photo) && sponsorData) {
                                        setFormData({ ...formData, background_photo: null });
                                        setSponsorData({ ...sponsorData, background_photo: null });
                                    } else {
                                        setFormData({ ...formData, background_photo: null });
                                        setSponsoree({ ...sponsoreeData, background_photo: null });
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
                {/* <div className="absolute top-4 right-4">
                    <button
                        onClick={handleSave}
                        className="bg-primary hover:opacity-90 text-white px-6 py-2 rounded-xl text-sm font-semibold shadow"
                    >
                        Save Changes
                    </button>
                </div> */}
                <div className="absolute -bottom-12 left-6 flex items-center gap-4">
                    <img
                        src={profilePhoto}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-4 border-white object-cover"
                    />
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
                    {sponsorData && sponsorData.length > 0 && (
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
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-xl"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={sponsorData ? sponsorData.username : sponsoreeData.username}
                            disabled
                            className="w-full p-3 border rounded-xl bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    {sponsoreeData && sponsoreeData !== null && (
                        <div className="relative w-full mb-4">
                            {console.log(formData.category)}
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full appearance-none p-3 pr-10 border rounded-xl bg-white"
                            >
                                <option value="">Select Category</option>
                                <option value="school">School</option>
                                <option value="university">University</option>
                                <option value="social organization">Social Organization</option>
                                <option value="religious organization">Religious Organization</option>
                                <option value="art organization">Art Organization</option>
                                <option value="environmental organization">Environmental Organization</option>
                                <option value="personal">Personal</option>
                                <option value="others">Others</option>
                            </select>

                            <div className="pointer-events-none absolute right-4 inset-y-0 flex items-center">
                                <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                            </div>
                        </div>
                    )}

                    {sponsorData && sponsorData.length > 0 && (
                        <div className="relative">
                            <label className="block text-sm font-medium mb-1">Category Provides</label>
                            <div className="relative">
                                <select
                                    name="category_provides"
                                    value={formData.category_provides}
                                    onChange={handleChange}
                                    className="w-full pl-4 pr-10 py-3 border rounded-xl bg-white text-base focus:outline-none appearance-none"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Fund">Fund</option>
                                    <option value="Product">Product</option>
                                    <option value="Services">Services</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                                    <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* <div>
                        <label className="block text-sm font-medium mb-1">Category Provides</label>
                        <input
                            type="text"
                            name="category_provides"
                            value={formData.category_provides}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-xl"
                        />
                    </div>
                    {console.log(formData.sponsorship_photos.length)} */}
                    {sponsorData && sponsorData.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium mb-1">About Us (Description)</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-xl min-h-[100px]"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">Sponsorship Photos</label>

                        <Dragger
                            name="sponsorship_photos"
                            multiple
                            accept="image/*"
                            beforeUpload={() => false}
                            onChange={handleSponsorshipPhotoChange} // ✅ ganti function ini
                            showUploadList={false}
                            className="!border-dashed !border-gray-300 !bg-gray-50 !rounded-xl px-6 py-8"
                            style={{ borderWidth: 1, overflow: 'hidden' }}
                        >

                            <p className="ant-upload-drag-icon mb-2">
                                <InboxOutlined style={{ color: "#888" }} />
                            </p>
                            <p className="text-base font-semibold text-gray-700">Drop images here</p>
                            <p className="text-sm text-gray-500">Drag or click to upload multiple sponsorship images, max 3 photos</p>
                        </Dragger>

                        <div className="flex flex-row flex-wrap gap-4 mt-4">
                            {formData.sponsorship_photos.map((img, idx) => {
                                const imgSrc =
                                    img instanceof File
                                        ? URL.createObjectURL(img)
                                        : `/api/sponsorship_photos/preview/${img.photo}`;
                                return (
                                    <div key={idx} className="relative w-24 h-24">
                                        <img
                                            src={imgSrc}
                                            alt={`preview-${idx}`}
                                            className="w-full h-full object-cover rounded-lg shadow"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSponsorshipPhoto(idx)}
                                            className="absolute top-0 right-0 bg-white text-black rounded-full w-5 h-5 text-xs flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 hover:bg-gray-300"
                                            title="Remove"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {sponsorData && sponsorData.length > 0 && (
                        <div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Tags</label>
                                <Select
                                    mode="tags"
                                    style={{ width: '100%' }}
                                    placeholder="Add tags"
                                    value={formData.tags.map((tag) => tag.tag_name)}
                                    onChange={(values) =>
                                        setFormData({
                                            ...formData,
                                            tags: values.map((val) => ({ tag_name: val })),
                                        })
                                    }
                                    options={filteredTags.map(item => ({ value: item, label: item }))}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Target Market</label>
                                <Select
                                    mode="tags"
                                    style={{ width: '100%' }}
                                    placeholder="Add target markets"
                                    value={formData.targets.map((t) => t.target_participant_category)}
                                    onChange={(values) =>
                                        setFormData({
                                            ...formData,
                                            targets: values.map((val) => ({
                                                target_participant_category: val,
                                            })),
                                        })
                                    }
                                    options={filteredTargets.map(item => ({ value: item, label: item }))}
                                />
                            </div>
                        </div>
                    )}
                    <div className="flex justify-center pt-8">
                        <button
                            onClick={handleSubmit}
                            className="w-1/3 bg-primary h-1/2 text-white py-3 rounded-xl hover:opacity-90"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;