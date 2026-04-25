import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { isEmail, isPassword } from "../Helpers/regexMatcher";
import HomeLayout from "../Layouts/HomeLayout";
import { creatAccount, createTeacherAccount } from "../Redux/Slices/AuthSlice";

function Signup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();
    const isTeacherCreation = state?.createTeacher;
    const [prevImage, setPrevImage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [signupData, setSignupData] = useState({
        fullName: "", email: "", password: "", avatar: "",
    });

    function handleUserInput(e) {
        const { name, value } = e.target;
        setSignupData({ ...signupData, [name]: value });
    }

    function getImage(event) {
        event.preventDefault();
        const uploadedImage = event.target.files[0];
        if (uploadedImage) {
            setSignupData({ ...signupData, avatar: uploadedImage });
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function () {
                setPrevImage(this.result);
            });
        }
    }

    async function createNewAccount(event) {
        event.preventDefault();
        if (!signupData.email || !signupData.fullName || !signupData.avatar || !signupData.password) {
            toast.error("Please fill all the details. An avatar image is required.");
            return;
        }
        if (signupData.fullName.length < 5) {
            toast.error("Name should be at least 5 characters");
            return;
        }
        if (!isEmail(signupData.email)) {
            toast.error("Invalid email id");
            return;
        }
        if (!isPassword(signupData.password)) {
            toast.error("Password should be 6-16 characters with at least a number and special character");
            return;
        }
        const formData = new FormData();
        formData.append("fullName", signupData.fullName);
        formData.append("email", signupData.email);
        formData.append("password", signupData.password);
        formData.append("avatar", signupData.avatar);

        if (isTeacherCreation) {
            const response = await dispatch(createTeacherAccount(formData));
            if (response?.payload?.success) {
                navigate("/admin/deshboard");
                setSignupData({ fullName: "", email: "", password: "", avatar: "" });
                setPrevImage("");
            }
        } else {
            const response = await dispatch(creatAccount(formData));
            if (response?.payload?.success) {
                navigate("/");
                setSignupData({ fullName: "", email: "", password: "", avatar: "" });
                setPrevImage("");
            }
        }
    }

    return (
        <HomeLayout>
            <div className="auth-bg">
                <div className="pro-card w-full max-w-md p-8 sm:p-10">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">{isTeacherCreation ? "Create a Teacher" : "Create an account"}</h1>
                        <p className="text-slate-500 text-sm">{isTeacherCreation ? "Manually grant platform access to a new instructor" : "Join the platform to start learning"}</p>
                    </div>

                    <form noValidate onSubmit={createNewAccount} className="flex flex-col gap-5">
                        {/* Avatar Upload (Minimalist) */}
                        <div className="flex flex-col items-center justify-center mb-2">
                            <label htmlFor="image_uploads" className="cursor-pointer group flex flex-col items-center">
                                <div className="w-20 h-20 rounded border border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden mb-2 hover:border-blue-500 transition-colors">
                                    {prevImage ? (
                                        <img className="w-full h-full object-cover" src={prevImage} alt="avatar preview" />
                                    ) : (
                                        <span className="text-slate-400 text-xs text-center px-2">Upload Photo</span>
                                    )}
                                </div>
                            </label>
                            <input className="hidden" type="file" name="image_uploads" id="image_uploads"
                                accept=".jpg,.jpeg,.png" onChange={getImage} />
                        </div>

                        <div>
                            <label className="lms-label" htmlFor="fullName">Full Name</label>
                            <input type="text" name="fullName" id="fullName" placeholder="John Doe"
                                className="lms-input" onChange={handleUserInput} value={signupData.fullName} />
                        </div>

                        <div>
                            <label className="lms-label" htmlFor="email">Email address</label>
                            <input type="email" name="email" id="email" placeholder="name@company.com"
                                className="lms-input" onChange={handleUserInput} value={signupData.email} />
                        </div>

                        <div>
                            <label className="lms-label" htmlFor="password">Password</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} name="password" id="password"
                                    placeholder="Minimum 6 characters"
                                    className="lms-input pr-10" onChange={handleUserInput} value={signupData.password} />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Must contain a number and a special symbol.</p>
                        </div>

                        <button type="submit" className="lms-btn-primary mt-2">{isTeacherCreation ? "Instantiate Account" : "Create Account"}</button>

                        {!isTeacherCreation && (
                            <div className="mt-2 text-center">
                                <p className="text-sm text-slate-500">
                                    Already have an account?{" "}
                                    <Link to="/login" className="lms-link">Sign in</Link>
                                </p>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </HomeLayout>
    );
}

export default Signup;