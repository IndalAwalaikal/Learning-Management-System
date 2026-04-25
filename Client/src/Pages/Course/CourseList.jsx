import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import CourseCard from "../../Compontents/CourseCard";
import HomeLayout from "../../Layouts/HomeLayout";
import { getAllCourse } from "../../Redux/Slices/CourseSlice";

function CourseList() {
    const dispatch = useDispatch();
    const { courseData } = useSelector((state) => state.course);

    async function loadCourses() {
        await dispatch(getAllCourse());
    }

    useEffect(() => {
        loadCourses();
    }, []);

    return (
        <HomeLayout>
            <div className="min-h-screen bg-slate-50 px-4 sm:px-8 py-10">
                {/* Header Section */}
                <div className="max-w-7xl mx-auto mb-10 pb-8 border-b border-slate-200">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Course Directory
                    </h1>
                    <p className="text-slate-600">
                        Browse our extensive catalog of professional development programs.
                    </p>
                </div>

                {/* Course Grid */}
                {courseData && courseData.length > 0 ? (
                    <div className="max-w-7xl mx-auto grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
                        {courseData.map((element) => (
                            <CourseCard key={element._id} data={element} />
                        ))}
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto text-center py-20 bg-white pro-card">
                        <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded flex items-center justify-center mx-auto mb-4 text-slate-400 text-sm font-bold">
                            N/A
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-1">Directory Empty</h3>
                        <p className="text-slate-500 mb-4 text-sm">No courses have been published to the directory yet.</p>
                        <Link to="/" className="text-blue-700 font-medium hover:underline text-sm">
                            Return to Dashboard
                        </Link>
                    </div>
                )}
            </div>
        </HomeLayout>
    );
}

export default CourseList;