import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiArrowLeft, FiVideo, FiFileText, FiLink, FiImage } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { editCourseLecture } from "../../Redux/Slices/LectureSlice";

function EditLecture() {
    const { state } = useLocation();
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const initialType = state?.lecture?.type || "VIDEO";
    const initialMode = (initialType === "EXTERNAL_URL" || initialType === "LIVE_MEETING") ? "EXTERNAL" : "LOCAL";

    const [uploadMode, setUploadMode] = useState(initialMode);
    const [fileType, setFileType] = useState(initialType);
    
    const [userInput, setUserInput] = useState({
        courseId: state?.courseId,
        lectureId: state?.lecture?._id,
        lecture: undefined,
        title: state?.lecture?.title || "",
        description: state?.lecture?.description || "",
        videoSrc: state?.lecture?.secure_url || "", 
        externalUrl: initialMode === "EXTERNAL" ? (state?.lecture?.secure_url || "") : ""
    });

    function handleInputChange(e) {
        const { name, value } = e.target;
        setUserInput({ ...userInput, [name]: value });
    }

    function handleFile(e) {
        const file = e.target.files[0];
        if (file) {
            const source = window.URL.createObjectURL(file);
            setUserInput({
                ...userInput,
                lecture: file,
                videoSrc: source
            });
        }
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        
        if (!userInput.title || !userInput.description) {
            toast.error("Title and description are required");
            return;
        }

        if (uploadMode === "EXTERNAL" && !userInput.externalUrl) {
            toast.error("Please provide an external URL");
            return;
        }
        
        const typeToSend = uploadMode === "EXTERNAL" ? (fileType === "LIVE_MEETING" ? "LIVE_MEETING" : "EXTERNAL_URL") : fileType;

        const data = {
            courseId: userInput.courseId,
            lectureId: userInput.lectureId,
            title: userInput.title,
            description: userInput.description,
            type: typeToSend,
            lecture: uploadMode === "LOCAL" ? userInput.lecture : undefined,
            externalUrl: uploadMode === "EXTERNAL" ? userInput.externalUrl : undefined
        };

        const response = await dispatch(editCourseLecture(data));
        if (response?.payload?.success) {
            navigate(-1);
        }
    }

    useEffect(() => {
        if (!state) navigate("/courses");
    }, []);

    const getAcceptedFiles = () => {
        if(fileType === "VIDEO") return "video/mp4, video/x-m4v, video/*";
        if(fileType === "IMAGE") return "image/png, image/jpeg, image/jpg, image/webp";
        if(fileType === "DOCUMENT") return "application/pdf";
        return "*/*";
    }

    return (
        <HomeLayout>
            <div className="max-w-4xl mx-auto py-8">
                <div className="mb-6 pb-6 border-b border-slate-200">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-700 transition-colors mb-4"
                    >
                        <FiArrowLeft /> Back to Lectures
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900">Edit Course Module</h1>
                    <p className="text-slate-500 text-sm mt-1">Modify the title, description, or format type of this existing lecture block.</p>
                </div>
                
                <form onSubmit={onFormSubmit} className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-6">
                        <div className="p-5 border border-slate-200 rounded-lg bg-slate-50">
                            
                            <div className="flex bg-slate-200 p-1 rounded-md mb-6">
                                <button type="button" onClick={() => setUploadMode("LOCAL")} className={`flex-1 py-1.5 text-sm font-medium rounded ${uploadMode === "LOCAL" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                                    Local File
                                </button>
                                <button type="button" onClick={() => setUploadMode("EXTERNAL")} className={`flex-1 py-1.5 text-sm font-medium rounded ${uploadMode === "EXTERNAL" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                                    External URL
                                </button>
                            </div>

                            {uploadMode === "LOCAL" ? (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">File Format Type</label>
                                        <select value={fileType} onChange={(e) => { setFileType(e.target.value); setUserInput({...userInput, lecture: undefined, videoSrc:""}) }} className="lms-input">
                                            <option value="VIDEO">Video (MP4, MKV)</option>
                                            <option value="DOCUMENT">Document (PDF)</option>
                                            <option value="IMAGE">Image (JPG, PNG)</option>
                                        </select>
                                    </div>

                                    {userInput.videoSrc ? (
                                        <div className="rounded border border-slate-300 overflow-hidden bg-white flex flex-col items-center">
                                            {fileType === "VIDEO" && (
                                                <video src={userInput.videoSrc} controls controlsList="nodownload nofullscreen" disablePictureInPicture className="w-full aspect-video object-cover bg-black" />
                                            )}
                                            {fileType === "IMAGE" && (
                                                <img src={userInput.videoSrc} alt="Preview" className="w-full aspect-video object-cover" />
                                            )}
                                            {fileType === "DOCUMENT" && (
                                                <div className="w-full aspect-video flex flex-col items-center justify-center bg-slate-100 text-slate-500">
                                                    <FiFileText className="w-10 h-10 mb-2 text-red-500" />
                                                    <span className="text-sm font-medium pt-2 text-center max-w-xs">{userInput.lecture ? userInput.lecture.name : "Current Document Resource Linked"}</span>
                                                </div>
                                            )}
                                            <button 
                                                type="button" 
                                                onClick={() => setUserInput({...userInput, videoSrc: "", lecture: undefined})}
                                                className="w-full py-2 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition-colors"
                                            >
                                                Change File
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer block w-full group">
                                            <div className="w-full aspect-video rounded border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-slate-500 hover:border-blue-500 hover:text-blue-600 transition-colors px-4">
                                                {fileType === "VIDEO" && <FiVideo className="w-8 h-8 mb-2" />}
                                                {fileType === "DOCUMENT" && <FiFileText className="w-8 h-8 mb-2" />}
                                                {fileType === "IMAGE" && <FiImage className="w-8 h-8 mb-2" />}
                                                <span className="text-sm font-medium text-center">Click to browse {fileType.toLowerCase()} file<br/><span className="text-xs font-normal opacity-80">(MAX 50MB)</span></span>
                                            </div>
                                            <input type="file" className="hidden" id="lecture" name="lecture" onChange={handleFile} accept={getAcceptedFiles()} />
                                        </label>
                                    )}
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Link Source Type</label>
                                        <select value={fileType === "LIVE_MEETING" ? "LIVE_MEETING" : "EXTERNAL_URL"} onChange={(e) => { setFileType(e.target.value); }} className="lms-input">
                                            <option value="EXTERNAL_URL">External Video / Resource (e.g. YouTube)</option>
                                            <option value="LIVE_MEETING">Live Virtual Class (e.g. Zoom / Meet)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Meeting / Media URL</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiLink className="text-slate-400" />
                                            </div>
                                            <input 
                                                type="url" 
                                                name="externalUrl" 
                                                placeholder={fileType === "LIVE_MEETING" ? "https://zoom.us/j/..." : "https://youtube.com/watch?v=..."} 
                                                className="lms-input pl-10" 
                                                value={userInput.externalUrl}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="lms-label" htmlFor="title">Module Title</label>
                            <input required type="text" name="title" id="title" placeholder="e.g. Chapter 1: Introduction" onChange={handleInputChange} className="lms-input" value={userInput.title} />
                        </div>
                        
                        <div>
                            <label className="lms-label" htmlFor="description">Module Overview / Notes</label>
                            <textarea required name="description" id="description" placeholder="Core concepts or reading materials discussed..." onChange={handleInputChange} className="lms-input resize-y shadow-sm" rows={8} value={userInput.description} />
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex gap-4">
                            <button type="submit" className="lms-btn-primary flex-1">
                                Apply Edits
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </HomeLayout>
    );
}

export default EditLecture;
