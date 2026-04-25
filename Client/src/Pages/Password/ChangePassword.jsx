import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { isPassword } from "../../Helpers/regexMatcher";
import HomeLayout from "../../Layouts/HomeLayout";
import { changePassword } from "../../Redux/Slices/AuthSlice";

function ChangePassword(){

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userPassword, setUserPassword] = useState({
    oldPassword: "",
    newPassword: "",
    });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;
        setUserPassword({
            ...userPassword,
            [name]: value,
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (!userPassword.oldPassword || !userPassword.newPassword) {
            toast.error("All fields are mandatory");
            return;
         } 
        if(!isPassword(userPassword.newPassword)){
            toast.error("Password should be 6 - 16 character long with atleast a number and special character");
            return;
        }
        const response = await dispatch(changePassword(userPassword));
        if(response?.payload?.success){
            navigate("/user/profile");
            setUserPassword({
                oldPassword: "",
                newPassword: "",
              });
        }
    }
    return(
        <HomeLayout>
            <div className="flex items-center justify-center h-[100vh]">
                <form
                onSubmit={handleFormSubmit}
                className="flex flex-col justify-center gap-6 rounded-lg p-4 text-white w-80 h-[26rem] shadow-[0_0_10px_black]"
                >
                <h1 className="text-center text-2xl font-bold">Change Password</h1>

                <div className="flex flex-col gap-1">
                    <label className="text-lg font-semibold" htmlFor="oldPassword">
                    Old Password
                    </label>
                    <div className="relative w-full">
                        <input
                        required
                        type={showOldPassword ? "text" : "password"}
                        name="oldPassword"
                        id="oldPassword"
                        placeholder="Enter your old password"
                        className="bg-transparent px-2 py-1 border w-full pr-10"
                        value={userPassword.oldPassword}
                        onChange={handlePasswordChange}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                            {showOldPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-lg font-semibold" htmlFor="newPassword">
                    New Password
                    </label>
                    <div className="relative w-full">
                        <input
                        required
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        id="newPassword"
                        placeholder="Enter your new password"
                        className="bg-transparent px-2 py-1 border w-full pr-10"
                        value={userPassword.newPassword}
                        onChange={handlePasswordChange}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                    </div>
                </div>

                <Link to={"/user/profile"}>
                    <p className="link text-accent cursor-pointer flex items-center justify-center w-full gap-2">
                    <AiOutlineArrowLeft /> Back to Profile
                    </p>
                </Link>

                <button
                    className="w-full bg-yellow-600 hover:bg-yellow-700 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
                    type="submit"
                >
                    Change Password
                </button>
                </form>
            </div>
        </HomeLayout>
    )
}
export default ChangePassword;