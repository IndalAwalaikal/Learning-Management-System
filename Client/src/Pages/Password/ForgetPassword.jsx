import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { isEmail } from "../../Helpers/regexMatcher";
import HomeLayout from "../../Layouts/HomeLayout";
import { forgetPassword } from "../../Redux/Slices/AuthSlice";

function ForgetPassword() {
    const dispatch = useDispatch();
    const [data, setData] = useState({ email: "" });

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (!data.email) { toast.error("Email layout is mandatory"); return; }
        if (!isEmail(data.email)) { toast.error("Invalid email format"); return; }
        const response = await dispatch(forgetPassword(data));
        if (response?.payload?.success) setData({ email: "" });
    };

    return (
        <HomeLayout>
            <div className="auth-bg">
                <div className="pro-card w-full max-w-md p-8 sm:p-10">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Reset Password</h1>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Enter the email address associated with your account, and we'll send you a link to reset your password.
                        </p>
                    </div>

                    <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="lms-label" htmlFor="email">Email address</label>
                            <input type="email" name="email" id="email" placeholder="name@company.com"
                                className="lms-input" value={data.email}
                                onChange={(e) => setData({ email: e.target.value })} />
                        </div>

                        <button type="submit" className="lms-btn-primary">
                            Send Reset Link
                        </button>

                        <div className="mt-4 text-center border-t border-slate-200 pt-5">
                            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:underline">
                                Return to sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </HomeLayout>
    );
}

export default ForgetPassword;