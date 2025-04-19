import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginUser, reset } from "../../features/authSlice";
import { getMe } from "../../features/authSlice";

const Login = () => {
    // let search = window.location.search;
    // let params = new URLSearchParams(search);
    // const redirectTo = params.get("redirectTo");
    const [udomain, setUdomain] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const { user, isError, isSuccess, isLoading, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        let redirectTo = localStorage.getItem("redirectTo");
        if (redirectTo !==null && (user || isSuccess)) {
            navigate(redirectTo);
            localStorage.removeItem("redirectTo");
        }else if(user || isSuccess){
            navigate("/dashboard");
        }
        dispatch(reset());
    }, [user, isSuccess, dispatch, navigate]);


    const Auth = (e) => {
        e.preventDefault();
        dispatch(LoginUser({ udomain, password }));
    };


    return (
        <div className="w-full h-full">
            <div className="w-full h-24 bg-gradient-to-r from-[#0360AC] to-[#0783AA]">
                <img className="h-full ml-7" src="/assets/Logo_BCA_Putih.png" alt="" />
            </div>
            <div className="w-5/12 h-screen">
                <img className="w-full pl-14 ml-14 pt-14" src="/assets/Login_bg.jpg" alt="" />
            </div>
            <div className="absolute min-[860px]:top-10 top-12 mt-12 min-[860px]:mt-0 min-[860px]:right-12 m-auto min-[860px]:mr-14 min-[860px]:w-2/5 w-full">
                <section className="bg-gray-50 rounded-lg drop-shadow-2xl min-w-100">
                    <div className="flex flex-col items-center justify-center mx-auto h-[600px] min-[1450px]:h-[800px] lg:py-0">
                        <div className="font-sans text-2xl md:text-4xl min-[1450px]:text-[60px] font-bold text-sky-800 mt-5 min-[1450px]:mb-3">
                LINUX PORTAL   
                        </div>
                        <div className="font-sans min-[860px]:text-sm min-[1450px]:text-2xl font-semi-bold mb-10 text-sky-800 text-left">
                Linux Server Documentation Apps    
                        </div>           
                        <div className="w-full  bg-white rounded-lg shadow border md:mt-0 max-w-[83%] min-h-[55%] p-auto xl:p-0">
                            <div className="p-6 space-y-4 md:space-y-6 sm:p-8 p-auto">
                                <h1 className="md::text-xl pb-4 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                          Sign in to your account
                                </h1>
                                <form onSubmit={Auth}  className="space-y-4 md:space-y-6" action="#">
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900">Udomain</label>
                                        <input type="text" value={udomain} onChange={(e) => setUdomain(e.target.value)}placeholder="" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"/>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"/>
                                    </div>
                                    {isError && message &&
                            <div className="p-4 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50">
                                <span className="font-medium">{message}</span>
                            </div>
                                    }
                                    <div className="flex flex-col m-auto w-4/6">
                                        <button type="submit" className="px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">{isLoading ? "Loading..." : "Login"}</button>
                                    </div>                        
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Login;