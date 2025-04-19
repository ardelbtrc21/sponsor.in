import React, { useState } from 'react';

export default function RegisterPage() {
    const [role, setRole] = useState('seeker');
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        document: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'document') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-white text-black">
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
                            className={`w-1/2 px-6 py-2 rounded-full text-sm font-semibold focus:outline-none transition-all duration-300 ${role === 'seeker' ? 'bg-white text-black' : 'text-white'}`}
                            onClick={() => setRole('seeker')}
                        >
                            Sponsor Seeker
                        </button>
                        <button
                            className={`w-1/2 px-6 py-2 rounded-full text-sm font-semibold focus:outline-none transition-all duration-300 ${role === 'provider' ? 'bg-white text-black' : 'text-white'}`}
                            onClick={() => setRole('provider')}
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

                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-xl"
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-xl"
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-xl"
                        />

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-xl"
                        />

                        {role === 'provider' && (
                            <input
                                type="file"
                                name="document"
                                onChange={handleChange}
                                className="w-full text-secondary"
                            />
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