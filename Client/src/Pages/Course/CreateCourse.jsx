import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { createNewCourse } from "../../Redux/Slices/CourseSlice";

function CreateCourse() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [userInput, setUserInput] = useState({
        title: "", category: "", createdBy: "", description: "", thumbnail: null, previewImage: ""
    });

    function handleImageUpload(e) {
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        if (uploadedImage) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function() {
                setUserInput({ ...userInput, previewImage: this.result, thumbnail: uploadedImage });
            });
        }
    }

    function handleUserInput(e) {
        const { name, value } = e.target;
        setUserInput({ ...userInput, [name]: value });
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        if (!userInput.title || !userInput.category || !userInput.createdBy || !userInput.description || !userInput.thumbnail) {
            toast.error("Please fill all mandatory fields.");
            return;
        }

        const response = await dispatch(createNewCourse({
            title: userInput.title,
            category: userInput.category,
            createdBy: userInput.createdBy,
            description: userInput.description,
            thumbnail: userInput.thumbnail
        }));
        if (response?.payload?.success) {
            navigate("/courses");
        }
    }

    return (
        <HomeLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Publish New Course</h1>
                        <p className="text-slate-500 text-sm mt-1">Configure the details of the course you wish to add to the directory.</p>
                    </div>
                </div>

                <form onSubmit={onFormSubmit} className="grid md:grid-cols-2 gap-8 items-start">
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
                                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        <span className="text-sm font-medium text-center px-4">Click to upload thumbnail<br/><span className="text-xs font-normal opacity-80">(Recommended: 1920x1080)</span></span>
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
                            <button type="submit" className="lms-btn-primary flex-1">Publish Course</button>
                            <Link to="/courses" className="lms-btn-outline flex-none px-6">Cancel</Link>
                        </div>
                    </div>
                </form>
            </div>
        </HomeLayout>
    );
}

export default CreateCourse;