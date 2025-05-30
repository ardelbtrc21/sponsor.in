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

            if (res.is_banned) {
                dispatch(reset());
                Swal.fire({
                    title: "<strong>Your account is banned.</strong>",
                    html: "<p>Please confirm to sponsorin13@gmail.com if you think there's a misunderstanding.</p>",
                    icon: "error",
                    iconColor: "#dc2626", // red-600
                    showCancelButton: false,
                    confirmButtonText: "OK",
                    background: "#fff",
                    color: "#1f2937",
                    buttonsStyling: false,
                    customClass: {
                        popup: 'rounded-2xl shadow-md px-6 py-4',
                        title: 'text-xl font-semibold mb-2',
                        htmlContainer: 'text-sm text-gray-700',
                        confirmButton: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5',
                    },
                });
                return;
            }
            if (res.role === "Sponsor") {
                const sponsorRes = await axios.get(`/api/sponsors/${res.username}`);
                const sponsorStatus = sponsorRes.data.status;
                if (sponsorStatus !== "Approved") {
                    dispatch(reset());
                    Swal.fire({
                        title: "<strong>Account Not Approved</strong>",
                        html: "<p>Your sponsor account is not approved yet</p>",
                        icon: "error",
                        iconColor: "#dc2626", // red-600
                        showCancelButton: false,
                        confirmButtonText: "OK",
                        background: "#fff",
                        color: "#1f2937",
                        buttonsStyling: false,
                        customClass: {
                            popup: 'rounded-2xl shadow-md px-6 py-4',
                            title: 'text-xl font-semibold mb-2',
                            htmlContainer: 'text-sm text-gray-700',
                            confirmButton: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5',
                        },
                    });
                    return;
                }
            }
        } catch (error) {
            Swal.fire({
                title: "<strong>Login Failed</strong>",
                html: `<p>${error.message || "Invalid username or password"}</p>`,
                icon: "error",
                iconColor: "#dc2626", // red-600
                showCancelButton: false,
                confirmButtonText: "OK",
                background: "#fff",
                color: "#1f2937",
                buttonsStyling: false,
                customClass: {
                    popup: 'rounded-2xl shadow-md px-6 py-4',
                    title: 'text-xl font-semibold mb-2',
                    htmlContainer: 'text-sm text-gray-700',
                    confirmButton: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5',
                },
            });
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-white text-black">
            <div className="flex flex-col md:flex-row w-full md:w-5/6 min-h-screen shadow-lg overflow-hidden rounded-none md:rounded-3xl">
                {/* Left Panel */}
                <div className="md:w-1/2 flex-1 bg-gradient-to-b from-secondary via-primary to-black p-10 md:p-16 flex flex-col justify-center">
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
                <div className="flex flex-col justify-center md:w-3/5 w-full bg-white p-10 text-black">
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
                                className="w-1/2 bg-primary text-white py-3 rounded-xl hover:opacity-90"
                            >
                                Sign In
                            </button>
                        </div>

                        <p className="text-center text-sm mt-4">
                            Don't have an account?{" "}
                            <a href="/signUp" className="font-semibold hover:underline">
                                Register
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;