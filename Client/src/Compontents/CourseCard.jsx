import { useNavigate } from "react-router-dom";

function CourseCard({ data }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate("/course/description/", { state: { ...data } })}
            className="pro-card group cursor-pointer overflow-hidden transition-shadow duration-200 hover:shadow-md flex flex-col h-full bg-white max-w-sm w-full"
        >
            {/* Thumbnail */}
            <div className="relative h-44 bg-slate-100 border-b border-slate-200 overflow-hidden">
                <img
                    className="w-full h-full object-cover"
                    src={data?.thumbnail?.secure_url}
                    alt={data?.title}
                />
            </div>

            {/* Content Segment */}
            <div className="p-5 flex flex-col flex-1">
                {/* Meta Tags */}
                <div className="mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {data?.category || 'General'}
                    </span>
                </div>

                <h2 className="text-lg font-bold text-slate-800 line-clamp-2 leading-tight mb-2 group-hover:text-blue-700 transition-colors">
                    {data?.title}
                </h2>
                
                <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed mb-4 flex-1">
                    {data?.description}
                </p>

                {/* Footer Metadata */}
                <div className="border-t border-slate-100 pt-4 flex items-center justify-between mt-auto">
                    <div className="text-xs">
                        <span className="text-slate-400">Instructor: </span>
                        <span className="text-slate-700 font-medium">{data?.createdBy}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseCard;