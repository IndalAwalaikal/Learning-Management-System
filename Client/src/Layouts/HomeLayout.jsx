import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    FiHome, FiBookOpen, FiInfo, FiMail, 
    FiLogOut, FiMenu, FiX, FiPlusCircle, FiLayout, FiUsers 
} from 'react-icons/fi';

import Footer from '../Compontents/Footer.jsx';
import logoImage from '../Assets/Images/logoimage.png';
import { logout } from '../Redux/Slices/AuthSlice.js';

function HomeLayout({ children }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Default open on desktop, closed on mobile
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
    const role = useSelector((state) => state?.auth?.role);
    const userData = useSelector((state) => state?.auth?.data);

    async function handleLogout(e) {
        e.preventDefault();
        await dispatch(logout());
        navigate('/');
    }

    const currentRole = (isLoggedIn && role) ? role : 'STUDENT';
    const navLinks = [
        { to: '/', label: 'Dashboard', icon: <FiHome />, allowed: ['STUDENT', 'TEACHER', 'SUPER_ADMIN'] },
        { to: '/courses', label: 'Course Directory', icon: <FiBookOpen />, allowed: ['STUDENT', 'TEACHER'] },
        { to: '/about', label: 'About Us', icon: <FiInfo />, allowed: ['STUDENT'] },
        { to: '/contact', label: 'Support', icon: <FiMail />, allowed: ['STUDENT'] },
    ].filter(link => link.allowed.includes(currentRole));

    const isActive = (path) => location.pathname === path;

    const sidebarContent = (
        <div className="flex flex-col h-full bg-white border-r border-slate-200 shadow-sm overflow-hidden">
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 text-slate-600">
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Main Menu</p>
                {navLinks.map(link => (
                    <Link 
                        key={link.to} 
                        to={link.to} 
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            isActive(link.to) 
                                ? 'bg-blue-50 text-blue-700' 
                                : 'hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                        <span className={`text-lg ${isActive(link.to) ? 'text-blue-700' : 'text-slate-400'}`}>
                            {link.icon}
                        </span>
                        {desktopSidebarOpen || window.innerWidth <= 768 ? link.label : ''}
                    </Link>
                ))}

                {isLoggedIn && role === 'SUPER_ADMIN' && (
                    <div className="pt-6 mt-6 border-t border-slate-100">
                        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Administration</p>
                        <Link to="/admin/deshboard" onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive('/admin/deshboard') ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 hover:text-slate-900'}`}>
                            <FiLayout className={`text-lg ${isActive('/admin/deshboard') ? 'text-blue-700' : 'text-slate-400'}`} /> 
                            {desktopSidebarOpen || window.innerWidth <= 768 ? 'Management Dashboard' : ''}
                        </Link>
                        <Link to="/admin/teachers" onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive('/admin/teachers') ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 hover:text-slate-900'}`}>
                            <FiUsers className={`text-lg ${isActive('/admin/teachers') ? 'text-blue-700' : 'text-slate-400'}`} /> 
                            {desktopSidebarOpen || window.innerWidth <= 768 ? 'Teacher Roster' : ''}
                        </Link>
                    </div>
                )}

                {isLoggedIn && role === 'TEACHER' && (
                    <div className="pt-6 mt-6 border-t border-slate-100">
                        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Instructor Tools</p>
                        <Link to="/admin/deshboard" onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive('/admin/deshboard') ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 hover:text-slate-900'}`}>
                            <FiLayout className={`text-lg ${isActive('/admin/deshboard') ? 'text-blue-700' : 'text-slate-400'}`} /> 
                            {desktopSidebarOpen || window.innerWidth <= 768 ? 'Instructor Dashboard' : ''}
                        </Link>
                        <Link to="/course/create" onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive('/course/create') ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 hover:text-slate-900'}`}>
                            <FiPlusCircle className={`text-lg ${isActive('/course/create') ? 'text-blue-700' : 'text-slate-400'}`} /> 
                            {desktopSidebarOpen || window.innerWidth <= 768 ? 'Publish Course' : ''}
                        </Link>
                    </div>
                )}
            </nav>
        </div>
    );

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            {/* ── Desktop Sidebar ─────────────────────────────────────── */}
            <aside className={`hidden md:block shrink-0 z-20 transition-all duration-300 ${desktopSidebarOpen ? 'w-64' : 'w-20'}`}>
                {/* Branding inside Desktop Sidebar Area to maintain height with header */}
                <div className="h-16 flex items-center px-4 border-b border-slate-100 bg-white">
                    <button 
                        className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none mr-2 rounded hover:bg-slate-100 transition-colors"
                        onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
                    >
                        <FiMenu className="w-5 h-5" />
                    </button>
                    {desktopSidebarOpen && (
                        <Link to="/" className="flex items-center gap-2 overflow-hidden">
                            <img src={logoImage} alt="LearnLMS Logo" className="w-8 h-8 object-contain shrink-0" />
                            <span className="font-bold text-lg text-slate-800 whitespace-nowrap">
                                Learn<span className="text-blue-700">LMS</span>
                            </span>
                        </Link>
                    )}
                </div>
                <div className="h-[calc(100vh-64px)]">
                    {sidebarContent}
                </div>
            </aside>

            {/* ── Mobile Overlay & Sidebar ───────────────────────────── */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    <div 
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="relative w-64 max-w-sm h-full shadow-2xl flex flex-col bg-white">
                        <div className="h-16 flex items-center px-6 border-b border-slate-100 bg-white justify-between">
                            <Link to="/" className="flex items-center gap-2">
                                <img src={logoImage} alt="LearnLMS Logo" className="w-8 h-8 object-contain" />
                                <span className="font-bold text-xl text-slate-800">Learn<span className="text-blue-700">LMS</span></span>
                            </Link>
                            <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 rounded-full">
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            {sidebarContent}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Main Content Area ──────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Global Top App Bar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 z-10">
                    <div className="flex items-center gap-3 md:hidden">
                        <button 
                            className="p-2 -ml-2 text-slate-600 hover:text-slate-900 focus:outline-none rounded hover:bg-slate-100 transition-colors"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <FiMenu className="w-6 h-6" />
                        </button>
                        <Link to="/" className="flex items-center gap-2">
                            <img src={logoImage} alt="LearnLMS Logo" className="w-8 h-8 object-contain" />
                            <span className="font-bold text-lg text-slate-800">Learn<span className="text-blue-700">LMS</span></span>
                        </Link>
                    </div>

                    {/* Desktop header title (Optional) */}
                    <div className="hidden md:block">
                        {/* Empty Space for alignment, alternatively breadcrumbs could go here */}
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {!isLoggedIn ? (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-700 hidden sm:block">Sign In</Link>
                                <Link to="/signup" className="px-4 py-2 text-sm font-medium bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors">Register</Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/user/profile" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-50 transition-colors">
                                    <span className="text-sm font-medium text-slate-700 hidden sm:block">{userData?.fullName?.split(' ')[0]}</span>
                                    <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                                        {userData?.fullName?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                </Link>
                                <button onClick={handleLogout} className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors hidden sm:flex items-center gap-1">
                                    <FiLogOut /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto scroll-smooth bg-slate-50">
                    <div className="min-h-full flex flex-col">
                        <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-8">
                            {children}
                        </div>
                        <Footer />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default HomeLayout;