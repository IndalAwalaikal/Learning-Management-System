import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { getuserData } from "../../Redux/Slices/AuthSlice";

function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state?.auth?.data);

    useEffect(() => {
        dispatch(getuserData());
    }, []);

    return (
        <HomeLayout>
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">User Profile</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage your account information and subscription details.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left - Avatar & Quick Info */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full border border-slate-300 bg-white overflow-hidden shadow-sm mb-4">
                                <img
                                    src={userData?.avatar?.secure_url || "https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg"}
                                    alt="User Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">{userData?.fullName}</h2>
                            <p className="text-sm text-slate-500">
                                {userData?.role === 'SUPER_ADMIN' ? 'Super Administrator' : userData?.role === 'TEACHER' ? 'Instructor' : 'Student Learner'}
                            </p>
                            
                            <Link to="/user/editprofile" className="mt-6 w-full lms-btn-outline text-sm">
                                Edit Identity
                            </Link>
                        </div>
                    </div>

                    {/* Right - Detailed Info & Subscription */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Account Details */}
                        <div className="border border-slate-200 rounded-lg">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 rounded-t-lg">
                                <h3 className="font-semibold text-slate-800">Account Credentials</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                                    <div className="text-sm font-medium text-slate-500">Email Address</div>
                                    <div className="col-span-2 text-sm text-slate-900 font-medium">{userData?.email}</div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                                    <div className="text-sm font-medium text-slate-500">Account Role</div>
                                    <div className="col-span-2 text-sm text-slate-900 font-medium">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                            {userData?.role}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-sm font-medium text-slate-500">Password</div>
                                    <div className="col-span-2 text-sm text-slate-900 font-medium">
                                        ••••••••
                                        <Link to="/change-password" className="ml-4 text-blue-600 hover:text-blue-800 text-xs">
                                            Update Password
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}

export default Profile;