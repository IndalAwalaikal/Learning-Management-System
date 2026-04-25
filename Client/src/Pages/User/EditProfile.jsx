import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { getuserData, updateProfile } from "../../Redux/Slices/AuthSlice";

function EditProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [data, setData] = useState({
        previewImage: "",
        fullName: "",
        avatar: undefined,
        userId: useSelector((state) => state?.auth?.data?._id)
    });

    function handleImageUpload(e) {
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        if (uploadedImage) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function () {
                setData({ ...data, previewImage: this.result, avatar: uploadedImage });
            });
        }
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        if (!data.fullName || !data.avatar) {
            toast.error("All fields are mandatory");
            return;
        }
        if (data.fullName.length < 5) {
            toast.error("Name must be at least 5 characters long");
            return;
        }

        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("avatar", data.avatar);

        await dispatch(updateProfile(formData));
        await dispatch(getuserData());
        navigate("/user/profile");
    }

    return (
        <HomeLayout>
            <div className="max-w-xl mx-auto py-10">
                <div className="pro-card p-8 sm:p-10">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2 border-b border-slate-100 pb-4">
                        Edit Profile
                    </h1>
                    
                    <form onSubmit={onFormSubmit} className="flex flex-col gap-6 mt-6">
                        {/* Avatar */}
                        <div className="flex flex-col items-center">
                            <label htmlFor="image_uploads" className="cursor-pointer group flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full border border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden mb-3 hover:border-blue-500 transition-colors shadow-sm relative">
                                    {data.previewImage ? (
                                        <img className="w-full h-full object-cover" src={data.previewImage} alt="preview" />
                                    ) : (
                                        <span className="text-slate-400 text-xs px-2 text-center">New Photo</span>
                                    )}
                                </div>
                                <span className="text-xs text-blue-600 font-medium group-hover:underline">Upload Avatar</span>
                            </label>
                            <input className="hidden" type="file" id="image_uploads" name="image_uploads" accept=".jpg, .png, .jpeg" onChange={handleImageUpload} />
                        </div>

                        <div>
                            <label className="lms-label" htmlFor="fullName">Full Legal Name</label>
                            <input
                                required
                                type="text"
                                name="fullName"
                                id="fullName"
                                placeholder="Enter your updated name"
                                className="lms-input"
                                value={data.fullName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-slate-100 mt-2">
                            <button type="submit" className="lms-btn-primary flex-1">
                                Save Changes
                            </button>
                            <Link to="/user/profile" className="lms-btn-outline flex-none px-6">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </HomeLayout>
    );
}

export default EditProfile;