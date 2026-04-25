import { FiAlertTriangle, FiArrowLeft, FiHome } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

function Denied() {
    const navigate = useNavigate();
    return (
        <div className="h-screen w-full flex flex-col justify-center items-center bg-slate-50 relative overflow-hidden">
            <h1 className="text-9xl font-extrabold text-slate-900 tracking-widest">403</h1>
            <div className="bg-red-500 text-white px-2 text-sm rounded rotate-12 absolute">
                Access Denied
            </div>
            
            <div className="mt-8 flex flex-col items-center max-w-md text-center">
                <FiAlertTriangle className="text-red-500 text-5xl mb-4" />
                <p className="text-lg font-medium text-slate-700 mb-6">
                    Anda tidak memiliki izin untuk mengakses halaman ini. Silakan kembali ke halaman utama.
                </p>
                <div className="flex gap-4">
                    <Link to="/" className="lms-btn-outline flex items-center gap-2">
                        <FiHome /> Halaman Utama
                    </Link>
                    <Link to="/contact" className="lms-btn-primary">
                        Hubungi Support
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Denied;