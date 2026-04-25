import { FiAlertCircle, FiHome } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="h-screen w-full flex flex-col justify-center items-center bg-slate-50 relative overflow-hidden">
            <h1 className="text-9xl font-extrabold text-slate-900 tracking-widest">404</h1>
            <div className="bg-blue-600 text-white px-2 text-sm rounded -rotate-12 absolute">
                Resource Missing
            </div>
            
            <div className="mt-8 flex flex-col items-center max-w-md text-center">
                <FiAlertCircle className="text-slate-400 text-5xl mb-4" />
                <p className="text-lg font-medium text-slate-700 mb-6">
                    The directory or training course you are trying to reach has been moved or deleted.
                </p>
                <div className="flex gap-4">
                    <button onClick={() => navigate(-1)} className="lms-btn-outline border-slate-300 text-slate-700 hover:bg-slate-100">
                        Go Back
                    </button>
                    <Link to="/" className="lms-btn-primary flex items-center gap-2">
                        <FiHome /> System Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;