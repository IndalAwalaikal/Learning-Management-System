import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiUserPlus, FiUsers } from "react-icons/fi";

import HomeLayout from "../../Layouts/HomeLayout";
import { getTeachers, deleteTeacherById } from "../../Redux/Slices/AuthSlice";

function TeacherList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadTeachers() {
        setLoading(true);
        const res = await dispatch(getTeachers());
        if (res?.payload?.teachers) {
            setTeachers(res.payload.teachers);
        }
        setLoading(false);
    }

    useEffect(() => {
        loadTeachers();
    }, []);

    async function handleDelete(id, name) {
        if (!window.confirm(`Are you sure you want to permanently delete teacher "${name}"? This action cannot be undone.`)) {
            return;
        }
        const res = await dispatch(deleteTeacherById(id));
        if (res?.payload?.success) {
            setTeachers(prev => prev.filter(t => t._id !== id));
        }
    }

    return (
        <HomeLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <FiUsers className="text-blue-600" /> Teacher Roster
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Manage all registered instructor accounts on this platform.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/signup", { state: { createTeacher: true } })}
                        className="lms-btn-primary flex items-center gap-2 w-fit"
                    >
                        <FiUserPlus /> Add Teacher
                    </button>
                </div>

                {/* Table */}
                <div className="pro-card overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-slate-400">Loading teachers...</div>
                    ) : teachers.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">
                            <FiUsers className="mx-auto text-4xl mb-3 text-slate-300" />
                            <p className="font-medium text-slate-500">No teachers yet</p>
                            <p className="text-sm mt-1">Click "Add Teacher" to create the first one.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">#</th>
                                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Avatar</th>
                                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</th>
                                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                                        <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {teachers.map((teacher, idx) => (
                                        <tr key={teacher._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-slate-500 font-medium">{idx + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm overflow-hidden">
                                                    {teacher?.avatar?.secure_url && teacher.avatar.secure_url !== 'dummy' ? (
                                                        <img src={teacher.avatar.secure_url} alt={teacher.fullName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        teacher?.fullName?.[0]?.toUpperCase() || 'T'
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-800 capitalize">{teacher.fullName}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{teacher.email}</td>
                                            <td className="px-6 py-4 text-sm text-slate-400">
                                                {new Date(teacher.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(teacher._id, teacher.fullName)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                                                >
                                                    <FiTrash2 size={13} /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Summary */}
                {!loading && teachers.length > 0 && (
                    <p className="text-xs text-slate-400 text-right">
                        Total: {teachers.length} teacher{teachers.length !== 1 ? 's' : ''} registered
                    </p>
                )}
            </div>
        </HomeLayout>
    );
}

export default TeacherList;
