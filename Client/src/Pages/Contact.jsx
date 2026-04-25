import { useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../Helpers/axiosinstance";
import { isEmail } from "../Helpers/regexMatcher";
import HomeLayout from "../Layouts/HomeLayout";

function Contact() {
    const [userInput, setUserInput] = useState({ name: "", email: "", message: "" });

    function handleInputChange(e) {
        const { name, value } = e.target;
        setUserInput({ ...userInput, [name]: value });
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        if (!userInput.email || !userInput.name || !userInput.message) {
            toast.error("All fields are mandatory");
            return;
        }
        if (!isEmail(userInput.email)) {
            toast.error("Invalid email address format");
            return;
        }
        try {
            const response = axiosInstance.post("/contact", userInput);
            toast.promise(response, {
                loading: "Submitting inquiry...",
                success: "Inquiry submitted successfully",
                error: "Failed to submit inquiry",
            });
            const res = await response;
            if (res?.data?.success) setUserInput({ name: "", email: "", message: "" });
        } catch {
            toast.error("Operation failed");
        }
    }

    return (
        <HomeLayout>
            <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-16 px-4 sm:px-8">
                <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left Typography */}
                    <div className="space-y-6">
                        <div className="inline-block px-3 py-1 bg-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider rounded border border-slate-300">
                            Support & Inquiries
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                            Contact Administration
                        </h1>
                        <p className="text-slate-600 text-base leading-relaxed">
                            For technical support, academic inquiries, or enterprise partnerships, please complete the form. Our administrative team typically responds within 1-2 business days.
                        </p>

                        <div className="pt-6 space-y-4">
                            <div className="flex flex-col border-l-2 border-blue-600 pl-4">
                                <span className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Corporate Office</span>
                                <span className="text-slate-800 font-medium pb-1">learnlms@enterprise.com</span>
                                <span className="text-slate-600 text-sm">Mon-Fri, 9:00 AM - 5:00 PM (EST)</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Form */}
                    <div className="pro-card p-8 sm:p-10">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                            Submit a Query
                        </h2>
                        
                        <form noValidate onSubmit={onFormSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="lms-label" htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="e.g. Jane Doe"
                                    className="lms-input"
                                    onChange={handleInputChange}
                                    value={userInput.name}
                                />
                            </div>

                            <div>
                                <label className="lms-label" htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="e.g. jane@university.edu"
                                    className="lms-input"
                                    onChange={handleInputChange}
                                    value={userInput.email}
                                />
                            </div>

                            <div>
                                <label className="lms-label" htmlFor="message">Message</label>
                                <textarea
                                    name="message"
                                    id="message"
                                    placeholder="Detailed description of your inquiry..."
                                    rows={5}
                                    className="lms-input shadow-sm"
                                    onChange={handleInputChange}
                                    value={userInput.message}
                                />
                            </div>

                            <button type="submit" className="lms-btn-primary mt-2">
                                Submit Inquiry
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}

export default Contact;