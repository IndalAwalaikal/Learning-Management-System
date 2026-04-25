import { Link } from 'react-router-dom';
import logoImage from '../Assets/Images/logoimage.png';

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-slate-200 text-slate-600 mt-auto shrink-0">
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-100">
                    {/* Brand Info */}
                    <div className="md:col-span-1 pr-4">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <img src={logoImage} alt="LearnLMS Logo" className="w-6 h-6 object-contain" />
                            <span className="font-bold text-lg text-slate-800">
                                Learn<span className="text-blue-600">LMS</span>
                            </span>
                        </Link>
                        <p className="text-sm text-slate-500 leading-relaxed pr-2">
                            A highly secure, scalable learning management system architecture for modern enterprises and higher education.
                        </p>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h4 className="font-semibold text-slate-900 text-xs mb-4 uppercase tracking-wider">Institution</h4>
                        <ul className="space-y-3">
                            {[['About Us', '/about']].map(([label, to]) => (
                                <li key={label}>
                                    <Link to={to} className="text-sm text-slate-500 hover:text-blue-700 font-medium transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h4 className="font-semibold text-slate-900 text-xs mb-4 uppercase tracking-wider">Academics</h4>
                        <ul className="space-y-3">
                            {[['Course Directory', '/courses']].map(([label, to]) => (
                                <li key={label}>
                                    <Link to={to} className="text-sm text-slate-500 hover:text-blue-700 font-medium transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links Column 3 */}
                    <div>
                        <h4 className="font-semibold text-slate-900 text-xs mb-4 uppercase tracking-wider">Support</h4>
                        <ul className="space-y-3">
                            {[['Contact IT', '/contact']].map(([label, to]) => (
                                <li key={label}>
                                    <Link to={to} className="text-sm text-slate-500 hover:text-blue-700 font-medium transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Footer Area */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-medium text-slate-500">
                        © {year} LearnLMS Corporation. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-xs font-medium text-slate-500 hover:text-blue-700 transition-colors">Privacy Policy</a>
                        <a href="#" className="text-xs font-medium text-slate-500 hover:text-blue-700 transition-colors">Terms of Service</a>
                        <a href="#" className="text-xs font-medium text-slate-500 hover:text-blue-700 transition-colors">Accessibility</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;