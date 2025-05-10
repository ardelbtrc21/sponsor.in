import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginUser, reset, getMe } from "../features/authSlice";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import axios from "axios";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    
    const { user, isError, isSuccess, isLoading, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        let redirectTo = localStorage.getItem("redirectTo");
        if (redirectTo !== null && (user || isSuccess)) {
            navigate(redirectTo);
            localStorage.removeItem("redirectTo");
        } else if (user || isSuccess) {
            navigate("/home");
        }
        dispatch(reset());
    }, [user, isSuccess, dispatch, navigate]);


    const Auth = async (e) => {
        e.preventDefault();
        try {
            await dispatch(LoginUser({ username, password })).unwrap();
            const res = await dispatch(getMe()).unwrap();
    
            if (res.role === "sponsor") {
                const sponsorRes = await axios.get(`/api/sponsors/${res.username}`);
                const sponsorStatus = sponsorRes.data.status;
                if (sponsorStatus !== "approved") {
                    dispatch(reset());
                    Swal.fire({
                        icon: "error",
                        title: "Account Not Approved",
                        text: "Your sponsor account is not approved yet",
                    });
                    return;
                }
            }    
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: error.message || "Invalid username or password",
            });
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center bg-white text-black">
            <div className="flex w-5/6 h-screen overflow-hidden shadow-lg">
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
                <div className="flex flex-col justify-center w-3/5 bg-white p-10 text-black mt-4">
                    <h2 className="text-2xl font-bold mb-6 text-center">Log In Account</h2>

                    <form onSubmit={Auth} className="space-y-4">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 border rounded-xl"
                        />

                        {/* Password */}
                        <div className="relative w-full mb-4">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-1/2 justify-center items-center bg-primary text-white py-3 rounded-xl hover:opacity-90"
                            >
                                Sign In
                            </button>
                        </div>

                        <p className="text-center text-sm mt-4">
                            Don't have an account? <a href="/signUp" className="font-semibold hover:underline">Register</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;