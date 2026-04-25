import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

import HomeLayout from "../Layouts/HomeLayout";
import { login } from "../Redux/Slices/AuthSlice";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    function handleUserInput(e) {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    }

    async function onLogin(event) {
        event.preventDefault();
        if (!loginData.email || !loginData.password) {
            toast.error("Please fill all the details");
            return;
        }
        const response = await dispatch(login(loginData));
        if (response?.payload?.success) {
            navigate("/");
            setLoginData({ email: "", password: "" });
        }
    }

    return (
        <HomeLayout>
            <div className="auth-bg">
                <div className="pro-card w-full max-w-md p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">Sign in</h1>
                        <p className="text-slate-500 text-sm">Access your learning portal</p>
                    </div>

                    <form noValidate onSubmit={onLogin} className="flex flex-col gap-5">
                        <div>
                            <label className="lms-label" htmlFor="email">Email address</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="name@company.com"
                                className="lms-input"
                                onChange={handleUserInput}
                                value={loginData.email}
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="lms-label mb-0" htmlFor="password">Password</label>
                                <Link to="/forget-password" className="text-xs text-blue-700 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    className="lms-input pr-10"
                                    onChange={handleUserInput}
                                    value={loginData.password}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="lms-btn-primary mt-2">
                            Sign In
                        </button>

                        <div className="mt-4 text-center">
                            <p className="text-sm text-slate-500">
                                Don't have an account?{" "}
                                <Link to="/signup" className="lms-link">Create one</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </HomeLayout>
    );
}

export default Login;