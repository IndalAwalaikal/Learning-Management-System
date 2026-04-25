import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPlayCircle, FiLock, FiEdit2 } from "react-icons/fi";

import HomeLayout from "../../Layouts/HomeLayout";

function CourseDescription() {
    const { state } = useLocation();
    const navigate = useNavigate();
    
    const { role, data } = useSelector((state) => state.auth);

    return (
        <HomeLayout>
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Back Navigation */}
                <div className="mb-6">
                    <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-700 transition-colors">
                        <FiArrowLeft /> Back to Directory
                    </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Detail Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest rounded mb-3">
                                {state?.category || "General"}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                                {state?.title}
                            </h1>
                            <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                {state?.description}
                            </p>
                        </div>
                        
                        <div className="border-t border-slate-200 pt-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Course Highlights</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Duration</p>
                                    <p className="font-bold text-slate-800">Self-Paced</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Level</p>
                                    <p className="font-bold text-slate-800">All Levels</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Certificate</p>
                                    <p className="font-bold text-slate-800">Available</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Thumbnail & Actions (Sticky) */}
                    <div className="relative">
                        <div className="sticky top-24 pro-card overflow-hidden">
                            <div className="aspect-video bg-slate-100 relative">
                                <img
                                    className="w-full h-full object-cover"
                                    alt="Course Thumbnail"
                                    src={state?.thumbnail?.secure_url}
                                />
                            </div>
                            
                            <div className="p-6 space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                        <span className="text-sm font-medium text-slate-500">Instructor:</span>
                                        <span className="text-sm font-bold text-slate-900">{state?.createdBy}</span>
                                    </div>
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                        <span className="text-sm font-medium text-slate-500">Total Lectures:</span>
                                        <span className="text-sm font-bold text-slate-900">{state?.numberOfLectures || 0} Modules</span>
                                    </div>
                                </div>

                                <div className="pt-2 space-y-3">
                                    <button 
                                        onClick={() => navigate("/course/displaylecture", { state: { ...state } })} 
                                        className="lms-btn-primary w-full flex items-center justify-center gap-2"
                                    >
                                        <FiPlayCircle className="text-lg" /> Access Learning Portal
                                    </button>
                                    {(role === 'TEACHER' && state?.createdBy?.toLowerCase() === data?.fullName?.toLowerCase()) && (
                                        <button 
                                            onClick={() => navigate("/course/edit", { state: { ...state } })} 
                                            className="lms-btn-outline w-full flex items-center justify-center gap-2"
                                        >
                                            <FiEdit2 className="text-lg" /> Edit Course Details
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
        </HomeLayout>
    );
}
export default CourseDescription;