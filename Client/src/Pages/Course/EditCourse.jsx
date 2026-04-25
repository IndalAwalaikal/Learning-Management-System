import { useState } from "react";
import toast from "react-hot-toast";
import { FiArrowLeft, FiImage } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { updateCourse, getAllCourse } from "../../Redux/Slices/CourseSlice";

function EditCourse() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();

    const [userInput, setUserInput] = useState({
        id: state?._id,
        title: state?.title || "",
        category: state?.category || "",
        description: state?.description || "",
        createdBy: state?.createdBy || "",
        thumbnail: null,
        previewImage: state?.thumbnail?.secure_url || "",
    });

    function handleImageUpload(e) {
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        if (uploadedImage) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function () {
                setUserInput((prev) => ({
                    ...prev,
                    previewImage: this.result,
                    thumbnail: uploadedImage
                }));
            });
        }
    }

    function handleUserInput(e) {
        e.preventDefault();
        const { name, value } = e.target;
        setUserInput((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    async function OnFormSubmit(e) {
        e.preventDefault();
        if (!userInput.title || !userInput.description || !userInput.category) {
            toast.error("All mandatory fields must be provided");
            return;
        }

        const response = await dispatch(updateCourse(userInput));
        if (response?.payload?.success) {
            await dispatch(getAllCourse());
            navigate("/courses");
        }
    }

    return (
        <HomeLayout>
            <div className="max-w-4xl mx-auto py-8">
                {/* Header */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                    <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-700 transition-colors mb-4">
                        <FiArrowLeft /> Back to Directory
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Configure Course Info</h1>
                    <p className="text-slate-500 text-sm mt-1">Modify syllabus details or instructor metadata for this module.</p>
                </div>

                <form onSubmit={OnFormSubmit} className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Left Column: Image & Basic Info */}
                    <div className="space-y-6">
                        <div className="p-5 border border-slate-200 rounded-lg bg-slate-50">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Course Thumbnail</label>
                            <label htmlFor="image_uploads" className="cursor-pointer block w-full group">
                                {userInput.previewImage ? (
                                    <div className="w-full aspect-video rounded overflow-hidden border border-slate-300">
                                        <img src={userInput.previewImage} alt="Course preview" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-full aspect-video rounded border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-slate-500 hover:border-blue-500 hover:text-blue-600 transition-colors">
                                        <FiImage className="w-8 h-8 mb-2" />
                                        <span className="text-sm font-medium text-center px-4">Click to replace thumbnail<br/><span className="text-xs font-normal opacity-80">(Recommended: 1920x1080)</span></span>
                                    </div>
                                )}
                            </label>
                            <input className="hidden" type="file" id="image_uploads" accept=".jpg,.jpeg,.png" name="image_uploads" onChange={handleImageUpload} />
                        </div>
                    </div>

                    {/* Right Column: Text Details */}
                    <div className="space-y-5">
                        <div>
                            <label className="lms-label" htmlFor="title">Course Title</label>
                            <input required type="text" name="title" id="title" placeholder="e.g. Advanced Machine Learning" className="lms-input" onChange={handleUserInput} value={userInput.title} />
                        </div>
                        
                        <div>
                            <label className="lms-label" htmlFor="category">Category</label>
                            <input required type="text" name="category" id="category" placeholder="e.g. Computer Science" className="lms-input" onChange={handleUserInput} value={userInput.category} />
                        </div>
                        
                        <div>
                            <label className="lms-label" htmlFor="createdBy">Instructor/Author</label>
                            <input required type="text" name="createdBy" id="createdBy" placeholder="e.g. Dr. John Doe" className="lms-input" onChange={handleUserInput} value={userInput.createdBy} />
                        </div>

                        <div>
                            <label className="lms-label" htmlFor="description">Detailed Description</label>
                            <textarea required name="description" id="description" placeholder="Provide a comprehensive syllabus overview..." className="lms-input resize-y shadow-sm" rows={6} onChange={handleUserInput} value={userInput.description} />
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex gap-4">
                            <button type="submit" className="lms-btn-primary flex-1">Apply Updates</button>
                            <Link to="/courses" className="lms-btn-outline flex-none px-6">Cancel</Link>
                        </div>
                    </div>
                </form>
            </div>
        </HomeLayout>  
    )
}

export default EditCourse;