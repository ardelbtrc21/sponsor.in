import React, { useState } from 'react';
import axios from "axios";
import Swal from "sweetalert2";

export default function RegisterPage() {
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        document: null,
        role: 'Sponsoree',
        nib: ''
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'document') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleRoleChange = (selectedRole) => {
        setFormData({ ...formData, username: "", name: "", email: "", password: "", confirmPassword: "", document: null, role: selectedRole });
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
            console.log(formData)
            for (let [key, value] of data.entries()) {
                console.log(`${key}:`, value);
              }

            await axios.post("/api/user", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            Swal.fire({
                title: "Create User Successful!",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
                text: "Your request has been successfully added"
            });

        } catch (error) {
            if (error.response) {
                setFormErrors(error.response.data);
                if (error.response.data.msg) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: error.response.data.msg,
                    });
                }
            }
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center bg-white text-black">
            <div className="flex w-[80%] h-[80%] overflow-hidden shadow-lg">
                {/* Left Panel */}
                <div className="w-1/2 flex-1 bg-gradient-to-b from-secondary via-primary to-black p-10 md:p-16 flex flex-col justify-center rounded-r-3xl">
                    <div className="text-center text-white">
                        <h2 className="text-3xl font-bold mb-2">Get Started with Us</h2>
                        <p className="text-sm mb-8">Complete these easy steps to register your account.</p>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 bg-white text-black px-4 py-2 rounded-xl">
                                <div className="font-bold">1</div>
                                <span>Sign up your account</span>
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
                <div className="w-1/2 bg-white p-10 text-black mt-4">
                    <h2 className="text-2xl font-bold mb-6 text-center">Sign Up Account</h2>

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
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-xl"
                        />
                        <span className="text-sm text-red-800 p-3">{formErrors.name}</span>

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-xl"
                        />
                        <span className="text-sm text-red-800 p-3">{formErrors.email}</span>

                        <input
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
                        <span className="text-sm text-red-800 p-3">{formErrors.confirmPassword}</span>

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
                                <input
                                    type="file"
                                    name="document"
                                    onChange={handleChange}
                                    className="w-full text-secondary"
                                />
                                <span className="text-sm text-red-800 p-3">{formErrors.files}</span>
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
                            Already have an account? <a href="/" className="font-semibold hover:underline">Log in</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}