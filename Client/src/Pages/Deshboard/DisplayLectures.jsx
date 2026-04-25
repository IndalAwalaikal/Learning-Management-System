import { useEffect, useState } from "react";
import { FiArrowLeft, FiPlusCircle, FiTrash2, FiPlayCircle, FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { deleteCourseLecture, getCourseLectures } from "../../Redux/Slices/LectureSlice";

function Displaylectures() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const { lectures } = useSelector((state) => state.lecture);
    const { role, data: userData } = useSelector((state) => state.auth);
    const hasEditPermission = role === 'TEACHER' && state?.createdBy?.toLowerCase() === userData?.fullName?.toLowerCase();

    const [currentVideo, setCurrentVideo] = useState(0);

    async function onLectureDelete(courseId, lectureId) {
        if (window.confirm("Confirm deletion of this module? This action is irreversible.")) {
            await dispatch(deleteCourseLecture({ courseId: courseId, lectureId: lectureId }));
            await dispatch(getCourseLectures(courseId));
        }
    }

    useEffect(() => {
        if (!state) navigate("/courses");
        else dispatch(getCourseLectures(state._id));
    }, []);

    return (
        <HomeLayout>
            <div className="max-w-7xl mx-auto py-6">
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                    <div>
                        <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-700 transition-colors mb-2">
                            <FiArrowLeft /> Back to Courses
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-900">{state?.title || "Course Lectures"}</h1>
                    </div>
                    {hasEditPermission && (
                        <button 
                            onClick={() => navigate("/course/addlecture", { state: { ...state } })} 
                            className="lms-btn-primary flex items-center justify-center gap-2"
                        >
                            <FiPlusCircle className="text-lg" /> Upload Module
                        </button>
                    )}
                </div>

                {lectures && lectures.length > 0 ? (
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Video Player Column */}
                        <div className="w-full lg:w-2/3 pro-card overflow-hidden">
                            <div className="aspect-video bg-black relative flex items-center justify-center">
                                {(() => {
                                    const curr = lectures[currentVideo]?.lecture;
                                    const type = curr?.type || "VIDEO";
                                    const url = curr?.secure_url;

                                    if (!url) return <div className="text-white text-sm font-medium">Media Not Available</div>;

                                    if (type === "VIDEO") {
                                        return (
                                            <video 
                                                key={url}
                                                src={url}
                                                className="w-full h-full object-contain"   
                                                controls
                                                disablePictureInPicture
                                                controlsList="nodownload"
                                            />
                                        );
                                    } else if (type === "IMAGE") {
                                        return <img key={url} src={url} alt="Lecture media" className="w-full h-full object-contain" />;
                                    } else if (type === "DOCUMENT") {
                                        return (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 p-8 text-center text-slate-800">
                                                <div className="mb-4 bg-white p-4 rounded-full shadow-sm">
                                                    <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path></svg>
                                                </div>
                                                <h3 className="text-lg font-bold mb-2">PDF Document</h3>
                                                <p className="text-sm text-slate-500 mb-6">This module contains a readable document or slide deck.</p>
                                                <a href={url} target="_blank" rel="noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded shadow transition">
                                                    Open / Download PDF
                                                </a>
                                            </div>
                                        );
                                    } else if (type === "EXTERNAL_URL") {
                                        const isYoutube = url.includes("youtube.com") || url.includes("youtu.be");
                                        let embedUrl = url;
                                        if (isYoutube) {
                                            let videoId = "";
                                            if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
                                            else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1];
                                            if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
                                        }

                                        if (isYoutube) {
                                            return (
                                                <iframe 
                                                    key={embedUrl}
                                                    className="w-full h-full"
                                                    src={embedUrl}
                                                    title="External Media"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            );
                                        } else {
                                            return (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-center p-8 text-white">
                                                    <div className="mb-4 bg-slate-700 p-4 rounded-full">
                                                        <FiPlayCircle className="w-10 h-10 text-blue-400" />
                                                    </div>
                                                    <h3 className="text-lg font-bold mb-2">External Link Resource</h3>
                                                    <p className="text-sm text-slate-400 mb-6 opacity-80 max-w-sm overflow-hidden text-ellipsis whitespace-nowrap">{url}</p>
                                                    <a href={url} target="_blank" rel="noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded shadow transition">
                                                        Open Link in New Tab
                                                    </a>
                                                </div>
                                            );
                                        }
                                    } else if (type === "LIVE_MEETING") {
                                        return (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-blue-900 text-center p-8 text-white">
                                                <div className="mb-4 bg-blue-800 p-4 rounded-full shadow-inner">
                                                    <svg className="w-12 h-12 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                                </div>
                                                <h3 className="text-2xl font-bold mb-2">Live Virtual Class</h3>
                                                <p className="text-sm text-blue-200 mb-8 max-w-md">This module is an interactive live meeting. Ensure you have the meeting client installed on your device.</p>
                                                <a href={url} target="_blank" rel="noreferrer" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105 flex items-center gap-2">
                                                    Join Meeting Now
                                                </a>
                                            </div>
                                        );
                                    }
                                })()}
                            </div>
                            <div className="p-6 md:p-8 bg-white border-t border-slate-100">
                                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                                    Module {currentVideo + 1}: {lectures[currentVideo]?.title}
                                </h2>
                                <div className="prose prose-slate max-w-none text-slate-600">
                                    <p>{lectures[currentVideo]?.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Lectures Sidebar list */}
                        <div className="w-full lg:w-1/3 pro-card p-0 overflow-hidden flex flex-col max-h-[800px]">
                            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between shadow-sm z-10 shrink-0">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <FiPlayCircle className="text-blue-600 text-lg" /> Syllabus Index
                                </h3>
                                <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2.5 py-0.5 rounded-full">
                                    {lectures.length} Total
                                </span>
                            </div>
                            <ul className="overflow-y-auto flex-1 divide-y divide-slate-100">
                                {lectures.map((lecture, idx) => (
                                    <li 
                                        key={lecture._id} 
                                        className={`group relative p-4 transition-colors hover:bg-slate-50 flex items-start justify-between cursor-pointer ${currentVideo === idx ? 'bg-blue-50/50' : ''}`}
                                        onClick={() => setCurrentVideo(idx)}
                                    >
                                        <div className="flex gap-4 pr-10">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold mt-0.5 ${currentVideo === idx ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h4 className={`text-sm font-semibold mb-1 ${currentVideo === idx ? 'text-blue-700' : 'text-slate-900'}`}>
                                                    {lecture?.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 line-clamp-1">{lecture?.description}</p>
                                            </div>
                                        </div>
                                        
                                        {hasEditPermission && (
                                            <div className="absolute right-4 top-4 flex gap-2">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); navigate("/course/editlecture", { state: { courseId: state._id, lecture: lecture, courseDetails: state } }); }} 
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Edit Module"
                                                >
                                                    <FiEdit className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onLectureDelete(state?._id, lecture?._id); }} 
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete Module"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 px-6 pro-card bg-slate-50 border-dashed">
                        {hasEditPermission ? (
                            <>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No Content Available</h3>
                                <p className="text-slate-500 mb-6">This course syllabus is currently empty. Start uploading videos to build the curriculum.</p>
                                <button 
                                    onClick={() => navigate("/course/addlecture", { state: { ...state } })} 
                                    className="lms-btn-primary inline-flex items-center gap-2"
                                >
                                    <FiPlusCircle className="text-lg" /> Upload First Module
                                </button>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Under Construction</h3>
                                <p className="text-slate-500">The instructor has not uploaded any content for this course yet.</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </HomeLayout>
    );
}

export default Displaylectures;