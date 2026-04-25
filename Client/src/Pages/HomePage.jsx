import { Link } from "react-router-dom";
import homeimg from '../Assets/Images/homePageMainImage.png';
import HomeLayout from "../Layouts/HomeLayout";

const stats = [
    { value: "500+", label: "Courses" },
    { value: "50K+", label: "Students" },
    { value: "200+", label: "Instructors" },
    { value: "95%", label: "Success Rate" },
];

function HomePage() {
    return (
        <HomeLayout>
            {/* ── Hero ─────────────────────────────────────────── */}
            <section className="bg-white border-b border-slate-200 lg:py-20 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Typography */}
                    <div className="space-y-6">
                        <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider rounded-md border border-blue-100">
                            Professional Education Platform
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold text-slate-900 leading-tight">
                            Elevate Your Team's <span className="text-blue-700">Capabilities</span> Online
                        </h1>

                        <p className="text-slate-600 text-lg leading-relaxed max-w-lg">
                            Access world-class training programs designed for modern enterprises and universities. Manage, track, and achieve your educational goals with our comprehensive Learning Management System.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link to="/courses">
                                <button className="lms-btn-primary px-6 py-3 w-auto flex-none text-base">
                                    Explore Catalog
                                </button>
                            </Link>
                            <Link to="/contact">
                                <button className="lms-btn-outline px-6 py-3 w-auto flex-none text-base">
                                    Request Demo
                                </button>
                            </Link>
                        </div>

                        {/* Stats Metrics */}
                        <div className="grid grid-cols-4 gap-4 pt-8 border-t border-slate-100 mt-8">
                            {stats.map((s, i) => (
                                <div key={i}>
                                    <div className="text-2xl font-bold text-slate-800">{s.value}</div>
                                    <div className="text-xs text-slate-500 mt-1 font-medium">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Hero Image */}
                    <div className="flex items-center justify-center lg:justify-end">
                        <div className="relative p-2 bg-slate-50 border border-slate-100 rounded-xl">
                            <img
                                src={homeimg}
                                alt="LMS Hero Dashboard"
                                className="relative rounded-lg shadow-sm border border-slate-200"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Key Features ───────────────────────────────── */}
            <section className="py-20 px-4 sm:px-8 bg-slate-50">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                        Enterprise-Grade Learning Infrastructure
                    </h2>
                    <p className="text-slate-600 max-w-xl mx-auto">
                        A robust, scalable platform designed to meet the rigorous demands of higher education institutions and corporate training environments.
                    </p>
                </div>
                <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { title: "Advanced Analytics", desc: "Track progress, completion rates, and performance metrics with detailed reporting tools." },
                        { title: "Secure & Compliant", desc: "Built with enterprise security standards ensuring data privacy and institutional compliance." },
                        { title: "Scalable Architecture", desc: "Easily accommodate thousands of concurrent users across globally distributed teams." },
                    ].map((f, i) => (
                        <div key={i} className="pro-card p-8">
                            <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded mb-5 flex items-center justify-center text-lg font-bold border border-blue-100">
                                {i + 1}
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-3">{f.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </HomeLayout>
    );
}

export default HomePage;