import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { isPassword } from "../../Helpers/regexMatcher";
import HomeLayout from "../../Layouts/HomeLayout";
import { resetPassword } from "../../Redux/Slices/AuthSlice";

function ResetPassword(){

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [data, setData] = useState({
        password: "",
        cnfPassword: "",
        resetToken: useParams().resetToken,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showCnfPassword, setShowCnfPassword] = useState(false);
    const handleUserInput = (event) => {
        const { name, value } = event.target;
        setData({
             ...data, 
             [name]: value 
        });
      };

      const handleFormSubmit = async (event) => {
        event.preventDefault();

        if(!isPassword(data.password )){
            toast.error("Password should be 6 - 16 character long with atleast a number and special character");
            return;
        }

        if (!data.password || !data.cnfPassword || !data.resetToken) {
            toast.error( "Minimum password length should be 8 with Uppercase, Lowercase, Number and Symbol");
            return;
        }

        if (data.password !== data.cnfPassword) {
            toast.error("Both password should be same");
            return;
        }

        const response = await dispatch(resetPassword(data));
        if(response?.payload?.success){
            navigate("/login");
            setData({
                password: "",
                cnfPassword: "",
              });
        }
    }
    return (
        <HomeLayout>
             <div
                onSubmit={handleFormSubmit}
                className="flex items-center justify-center h-[100vh]"
            >
                <form className="flex flex-col justify-center gap-6 rounded-lg p-4 text-white w-80 h-[26rem] shadow-[0_0_10px_black]">
                <h1 className="text-center text-2xl font-bold">Reset Password</h1>

                <div className="flex flex-col gap-1">
                    <label className="text-lg font-semibold" htmlFor="email">
                    New Password
                    </label>
                    <div className="relative w-full">
                        <input
                        required
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="Enter your new password"
                        className="bg-transparent px-2 py-1 border w-full pr-10"
                        value={data.password}
                        onChange={handleUserInput}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-lg font-semibold" htmlFor="cnfPassword">
                    Confirm New Password
                    </label>
                    <div className="relative w-full">
                        <input
                        required
                        type={showCnfPassword ? "text" : "password"}
                        name="cnfPassword"
                        id="cnfPassword"
                        placeholder="Confirm your new password"
                        className="bg-transparent px-2 py-1 border w-full pr-10"
                        value={data.cnfPassword}
                        onChange={handleUserInput}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white"
                            onClick={() => setShowCnfPassword(!showCnfPassword)}
                        >
                            {showCnfPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                    </div>
                </div>

                <button
                    className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
                    type="submit"
                >
                    Reset Password
                </button>
                </form>
            </div>
        </HomeLayout>
    )
}
export default ResetPassword;