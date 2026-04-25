import aboutMainImage from "../Assets/Images/aboutMainImage.png";
import CarouselSlide from "../Compontents/CarouselSlide";
import { celebrities } from "../Constants/CelebrityData";
import HomeLayout from "../Layouts/HomeLayout";

function AboutUs() {
    return (
        <HomeLayout>
            <div className="bg-slate-50 min-h-screen">
                {/* ── Hero Section ──────────────────────────────── */}
                <section className="bg-white border-b border-slate-200 pt-16 pb-20 px-4 sm:px-8">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                        {/* Text */}
                        <div className="lg:w-1/2 space-y-8">
                            <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider rounded border border-blue-100">
                                About Our Institution
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
                                Excellence in <span className="text-blue-700">Education</span> & Training
                            </h1>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                Our mission is to provide rigorous, high-quality, and scalable education solutions for individuals and enterprises globally. We connect industry-leading experts with eager minds to foster professional growth, drive innovation, and build the workforce of tomorrow.
                            </p>
                        </div>

                        {/* Image */}
                        <div className="lg:w-1/2 flex justify-center">
                            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                                <img
                                    className="rounded shadow-sm max-w-full h-auto"
                                    src={aboutMainImage}
                                    alt="About our institution"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Leadership / Faculty Section ──────────────── */}
                <section className="py-20 px-4 sm:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">
                                Our Esteemed Faculty & Board
                            </h2>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                Learn from distinguished thought leaders and industry pioneers who bring decades of real-world experience into every program.
                            </p>
                        </div>
                        
                        {/* Carousel Wrapper */}
                        <div className="w-full max-w-lg mx-auto bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden">
                            <div className="carousel w-full">
                                {celebrities && celebrities.map(celebrity => (
                                    <CarouselSlide
                                        {...celebrity}
                                        key={celebrity.slideNumber}
                                        totalSlides={celebrities.length}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </HomeLayout>
    );
}

export default AboutUs;