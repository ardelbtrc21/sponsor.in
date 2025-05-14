import React, { useEffect, useState } from 'react';
import axios from "axios";
import Swal from "sweetalert2";
import { message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { EyeIcon, EyeSlashIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { NavLink, useNavigate } from "react-router-dom";
const { Dragger } = Upload;

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});
    const [fileList, setFileList] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        document: null,
        role: 'Sponsoree',
        nib: '',
        category: ''
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'document') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    useEffect(() => {
        console.log("formData updated: ", formData);
    }, [formData]);

    const props = {
        type: "file",
        name: "document",
        multiple: false,
        openFileDialogOnClick: true,
        beforeUpload: (file) => {
            // Validasi tipe file
            if (file.type !== "application/pdf") {
                Swal.fire({
                    title: "<strong>Oops...</strong>",
                    html: "<p>Only PDF files are allowed.</p>",
                    icon: "error",
                    iconColor: "#dc2626", // merah untuk error
                    showCancelButton: false,
                    confirmButtonText: "OK",
                    background: "#fff",
                    color: "#1f2937",
                    buttonsStyling: false,
                    customClass: {
                        popup: 'rounded-2xl shadow-md px-6 py-4',
                        title: 'text-xl font-semibold mb-2 text-red-600',
                        htmlContainer: 'text-sm text-gray-700',
                        confirmButton: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5',
                    },
                });
                return Upload.LIST_IGNORE;
            }
            // Validasi ukuran file
            if (file.size > 10 * 1024 * 1024) {
                Swal.fire({
                    title: "<strong>Oops...</strong>",
                    html: "<p>File must be smaller than 10MB.</p>",
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

                return Upload.LIST_IGNORE;
            }
            return false; // mencegah auto upload
        },
        onChange(info) {
            const file = info.file;
            const newFileList = info.fileList.slice(-1);
            setFileList(newFileList);
            if (file) {
                setFormData({ ...formData, document: file })
            }

            const { status } = info.file;
            if (status === "done") {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === "error") {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        fileList,
    };

    const handleRoleChange = (selectedRole) => {
        setFormData({ ...formData, username: "", name: "", email: "", password: "", confirmPassword: "", category: '', document: null, role: selectedRole });
        setFormErrors({});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value instanceof File || typeof value === 'string' || typeof value === 'number') {
                    data.append(key, value);
                } else if (value) {
                    data.append(key, JSON.stringify(value)); // untuk object
                }
            });
            for (let [key, value] of data.entries()) {
                console.log(`${key}:`, value);
            }

            await axios.post("/api/user", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            navigate("/");
            Swal.fire({
                title: "<strong>Create User Successful!</strong>",
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

        } catch (error) {
            if (error.response) {
                setFormErrors(error.response.data);
                if (error.response.data.msg) {
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
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center bg-white text-black">
            <div className="flex w-screen h-full overflow-hidden shadow-lg">
                {/* Left Panel */}
                <div className="w-1/2 flex-1 bg-gradient-to-b from-secondary via-primary to-black p-10 md:p-16 flex flex-col justify-center rounded-r-3xl">
                    <div className="text-center text-white">
                        <h2 className="text-3xl font-bold mb-2">Get Started with Us</h2>
                        <p className="text-sm mb-8">Complete these easy steps to register your account.</p>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 bg-white text-black px-4 py-2 rounded-xl">
                                <div className="font-bold">1</div>
                                <span>Register your account</span>
                            </div>
                            <div className="flex items-center space-x-4 bg-[#223A59] px-4 py-2 rounded-xl">
                                <div className="font-bold">2</div>
                                <span>Set up your profile</span>
                            </div>
                            <div className="flex items-center space-x-4 bg-[#223A59] px-4 py-2 rounded-xl">
                                <div className="font-bold">3</div>
                                <span>Start the sponsorship</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-3/5 bg-white p-10 text-black mt-4">
                    <h2 className="text-2xl font-bold mb-6 text-center">Register Account</h2>

                    {/* Toggle Switch */}
                    <div className="mx-auto mb-6 bg-blue-300 rounded-full p-1 flex w-7/12 justify-center">
                        <button
                            className={`w-1/2 px-6 py-2 rounded-full text-sm font-semibold focus:outline-none transition-all duration-300 ${formData.role === 'Sponsoree' ? 'bg-white text-black' : 'text-white'}`}
                            onClick={() => { handleRoleChange('Sponsoree') }}
                        >
                            Sponsor Seeker
                        </button>
                        <button
                            className={`w-1/2 px-6 py-2 rounded-full text-sm font-semibold focus:outline-none transition-all duration-300 ${formData.role === 'Sponsor' ? 'bg-white text-black' : 'text-white'}`}
                            onClick={() => { handleRoleChange('Sponsor') }}
                        >
                            Sponsor Provider
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-xl"
                        />
                        <span className="text-sm text-red-800 p-3">{formErrors.username}</span>

                        <input
                            type="text"
                            name="name"
                            placeholder={`${formData.role === 'Sponsoree' ? "Name" : "Company Name"}`}
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-xl"
                        />
                        <span className="text-sm text-red-800 p-3">{formErrors.name}</span>

                        <input
                            type="email"
                            name="email"
                            placeholder={`${formData.role === 'Sponsoree' ? "Email" : "Company Email"}`}
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-xl"
                        />
                        <span className="text-sm text-red-800 p-3">{formErrors.email}</span>

                        {formData.role === 'Sponsoree' && (
                            <div className="relative w-full mb-4">
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
                                <span className="text-sm text-red-800 p-3">{formErrors.category}</span>
                            </div>
                        )}

                        {/* Password */}
                        <div className="relative w-full mb-4">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-xl pr-12"
                            />
                            <div
                                className="absolute right-4 inset-y-0 flex items-center cursor-pointer text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </div>
                            <span className="text-sm text-red-800 p-3">{formErrors.password}</span>
                        </div>

                        {/* Confirm Password */}
                        <div className="relative w-full mb-4">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-xl pr-12"
                            />
                            <div
                                className="absolute right-4 inset-y-0 flex items-center cursor-pointer text-gray-600"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </div>
                            <span className="text-sm text-red-800 p-3">{formErrors.confirmPassword}</span>
                        </div>

                        {/* <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-xl"
                        />
                        <span className="text-sm text-red-800 p-3">{formErrors.password}</span>

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-xl"
                        />
                        <span className="text-sm text-red-800 p-3">{formErrors.confirmPassword}</span> */}

                        {formData.role === 'Sponsor' && (
                            <div>
                                <input
                                    type="text"
                                    name="nib"
                                    placeholder="NIB (Nomor Induk Berusaha)"
                                    value={formData.nib}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-xl"
                                />
                                <span className="text-sm text-red-800 p-3">{formErrors.nib}</span>
                                <div className="col-span-full pt-3">
                                    <label htmlFor="cover-photo" className="block text-base font-medium leading-6 text-gray-900">
                                        NIB File
                                    </label>
                                    <Dragger {...props}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                        <p className="ant-upload-hint">
                                            Only Accept PDF File and Accept Size Max (10 Mb)
                                        </p>
                                    </Dragger>
                                    <span className="text-sm text-red-800">{formErrors.document}</span>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-1/2 justify-center items-center bg-primary text-white py-3 rounded-xl hover:opacity-90"
                            >
                                Sign Up
                            </button>
                        </div>

                        <p className="text-center text-sm mt-4">
                            Already have an account? <a href="/SignIn" className="font-semibold hover:underline">Log in</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}