import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { useEffect } from 'react';
import { Bar, Pie } from "react-chartjs-2";
import { FiUsers, FiDollarSign, FiActivity, FiPlayCircle, FiEdit2, FiTrash2, FiPlusCircle } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import HomeLayout from "../../Layouts/HomeLayout";
import { deleteCourse, getAllCourse } from '../../Redux/Slices/CourseSlice';
import { getStatsData } from '../../Redux/Slices/StatSlice';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function AdminDeshboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { allUsersCount } = useSelector((state) => state.stat);
    const { role, data: userData } = useSelector((state) => state.auth);

    const myCoures = useSelector((state) => state?.course?.courseData);

    async function onCourseDelete(id) {
        if (window.confirm("Archive and remove this course permanently? This cannot be undone.")) {
            const res = await dispatch(deleteCourse(id));
            if (res?.payload?.success) {
                await dispatch(getAllCourse());
            }
        }
    }

    useEffect(() => {
        (async () => {
            await dispatch(getAllCourse());
            await dispatch(getStatsData());
        })();
    }, []);

    return (
        <HomeLayout>
            <div className="max-w-7xl mx-auto py-4">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">{role === 'SUPER_ADMIN' ? 'Platform Overview' : 'Instructor Dashboard'}</h1>
                    <p className="text-slate-500 text-sm mt-1">{role === 'SUPER_ADMIN' ? 'Monitor platform usage and manage teaching staff.' : 'Manage your published courses and learning modules.'}</p>
                </div>

                {/* Key Metrics Grid — always visible */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="pro-card p-6 border-l-4 border-l-slate-400">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Users</p>
                                <h3 className="text-3xl font-extrabold text-slate-900">{allUsersCount || 0}</h3>
                            </div>
                            <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                                <FiUsers className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                    <div className="pro-card p-6 border-l-4 border-l-blue-400">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Courses</p>
                                <h3 className="text-3xl font-extrabold text-slate-900">{myCoures?.length || 0}</h3>
                            </div>
                            <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-blue-500">
                                <FiPlayCircle className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SUPER_ADMIN: Quick actions */}
                {role === 'SUPER_ADMIN' && (
                    <div className="pro-card p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => navigate("/admin/teachers")}
                                className="lms-btn-primary flex items-center gap-2"
                            >
                                <FiUsers className="text-lg" /> View Teacher Roster
                            </button>
                            <button
                                onClick={() => navigate("/signup", { state: { createTeacher: true } })}
                                className="lms-btn-outline flex items-center gap-2"
                            >
                                <FiPlusCircle className="text-lg" /> Add New Teacher
                            </button>
                        </div>
                    </div>
                )}

                {/* TEACHER: Full Course Management Table */}
                {role === 'TEACHER' && (
                    <div className="pro-card overflow-hidden">
                        <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">My Courses</h2>
                                <p className="text-sm text-slate-500">Manage courses you have published.</p>
                            </div>
                            <button
                                onClick={() => navigate("/course/create")}
                                className="lms-btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                <FiPlusCircle className="text-lg" /> Publish Course
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-white border-b border-slate-200">
                                        <th className="py-4 px-6 font-semibold text-slate-500 uppercase tracking-wider text-xs">Title & Category</th>
                                        <th className="py-4 px-6 font-semibold text-slate-500 uppercase tracking-wider text-xs">Instructor</th>
                                        <th className="py-4 px-6 font-semibold text-slate-500 uppercase tracking-wider text-xs">Modules</th>
                                        <th className="py-4 px-6 font-semibold text-slate-500 uppercase tracking-wider text-xs text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {myCoures?.length > 0 ? myCoures.filter(c => c?.createdBy?.toLowerCase() === userData?.fullName?.toLowerCase()).map((course) => (
                                        <tr key={course._id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="py-4 px-6">
                                                <p className="font-semibold text-slate-900">{course?.title}</p>
                                                <p className="text-xs text-slate-500">{course?.category}</p>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                                                    {course?.createdBy}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="text-slate-600 font-medium">{course?.numberOfLectures || 0} Modules</p>
                                            </td>
                                            <td className="py-4 px-6 text-right space-x-2">
                                                <button
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    onClick={() => navigate("/course/displaylecture", { state: { ...course } })}
                                                    title="View/Manage Modules"
                                                >
                                                    <FiPlayCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                                                    onClick={() => navigate("/course/edit", { state: { ...course } })}
                                                    title="Edit Course Details"
                                                >
                                                    <FiEdit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    onClick={() => onCourseDelete(course?._id)}
                                                    title="Delete Course"
                                                >
                                                    <FiTrash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="py-10 text-center text-slate-500">
                                                You haven't published any courses yet. Click "Publish Course" to create one.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </HomeLayout>
    );
}

export default AdminDeshboard;