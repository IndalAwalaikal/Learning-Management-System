import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../Helpers/axiosinstance"

const isBrowser = typeof window !== "undefined";

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const initialState = {
  isLoggedIn: isBrowser ? localStorage.getItem("isLoggedIn") === "true" : false,
  role: isBrowser ? localStorage.getItem("role") || "" : "",
  data: isBrowser ? safeParse(localStorage.getItem("data"), {}) : {},
};


export const creatAccount =createAsyncThunk("/auth/singup", async(data, {rejectWithValue})=>{
    try {
        const res =axiosInstance.post("user/register", data);
        toast.promise(res,{
            loading:"Membuat akun...",
            success:(data)=>{
                return data?.data?.message;
            },
            error:(err)=> err?.response?.data?.message || "Gagal membuat akun"
        })
        return(await res).data;
        
    } catch (error) {
        toast.error(error?.response?.data?.message || "Gagal membuat akun");
        return rejectWithValue(error?.response?.data);
    }
})

export const createTeacherAccount = createAsyncThunk("/auth/create-teacher", async(data, {rejectWithValue})=>{
    try {
        const res = axiosInstance.post("user/create-teacher", data);
        toast.promise(res,{
            loading:"Membuat akun teacher...",
            success:(data)=>{
                return data?.data?.message;
            },
            error:(err)=> err?.response?.data?.message || "Gagal membuat akun teacher"
        })
        return(await res).data;
        
    } catch (error) {
        toast.error(error?.response?.data?.message || "Gagal membuat akun teacher");
        return rejectWithValue(error?.response?.data);
    }
})

export const login =createAsyncThunk("/auth/login", async(data, {rejectWithValue})=>{
    try {
        const res =axiosInstance.post("user/login", data);
        toast.promise(res,{
            loading:"Autentikasi sedang diproses...",
            success:(data)=>{
                return data?.data?.message;
            },
            error:(err)=> err?.response?.data?.message || "Gagal login"
        })
        return(await res).data;
        
    } catch (error) {
        toast.error(error?.response?.data?.message || "Gagal login");
        return rejectWithValue(error?.response?.data);
    }
})

export const logout=createAsyncThunk("/auth/logout", async (_,{rejectWithValue})=>{
    try {
        const res =axiosInstance.post("user/logout");
        toast.promise(res,{
            loading:"Logout...",
            success:(data)=>{
                return data?.data?.message;
            },
            error:(err)=> err?.response?.data?.message || "Gagal logout"
        })
        return(await res).data;

    } catch (error) {
        toast.error(error?.response?.data?.message || "Gagal logout");
        return rejectWithValue(error?.response?.data);
    }
})

export const updateProfile=createAsyncThunk("/user/update/profile", async (data, {rejectWithValue})=>{
    try {
        const res =axiosInstance.put(`user/update`, data);
        toast.promise(res,{
            loading:"Mengupdate profil...",
            success:(data)=>{
                return data?.data?.message;
            },
            error:(err)=> err?.response?.data?.message || "Gagal mengupdate profil"
        })
        return(await res).data;

    } catch (error) {
        toast.error(error?.response?.data?.message || "Gagal mengupdate profil");
        return rejectWithValue(error?.response?.data);
    }
})

export const getuserData=createAsyncThunk("/user/details", async (_,{rejectWithValue})=>{
    try {
        const res =axiosInstance.get("user/me");
        return(await res).data;
    } catch (error) {
        return rejectWithValue(error?.response?.data);
    }
})

export const forgetPassword =createAsyncThunk("/auth/forget-Password", async(data, {rejectWithValue})=>{
    try {
        const res =axiosInstance.post("user/reset", data);
        toast.promise(res,{
            loading:"Mengirim link reset password...",
            success:(data)=>{
                return data?.data?.message;
            },
            error:(err)=> err?.response?.data?.message || "Gagal mengirim link reset password"
        })
        return(await res).data;
        
    } catch (error) {
        toast.error(error?.response?.data?.message || "Gagal mengirim link reset password");
        return rejectWithValue(error?.response?.data);
    }
})

export const changePassword = createAsyncThunk(
    "/auth/changePassword",
    async (userPassword, {rejectWithValue}) => {
        try {
        let res = axiosInstance.post("/user/change-password", userPassword);
        toast.promise(res,{
            loading:"Mengubah password...",
            success:(data)=>{
                return data?.data?.message;
            },
            error:(err)=> err?.response?.data?.message || "Gagal mengubah password"
        })
        return(await res).data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Gagal mengubah password");
            return rejectWithValue(error?.response?.data);
        }
 });

export const resetPassword = createAsyncThunk("/user/reset", async (data, {rejectWithValue}) => {
    try {
        let res = axiosInstance.post(`/user/reset/${data.resetToken}`, { password: data.password });
        toast.promise(res,{
            loading:"Mereset password...",
            success:(data)=>{
                return data?.data?.message;
            },
            error:(err)=> err?.response?.data?.message || "Gagal mereset password"
        })
        return(await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Gagal mereset password");
        return rejectWithValue(error?.response?.data);
    }
});

export const getTeachers = createAsyncThunk("/auth/teachers", async (_,{rejectWithValue}) => {
    try {
        const res = axiosInstance.get("user/teachers");
        return (await res).data;
    } catch (error) {
        return rejectWithValue(error?.response?.data);
    }
});

export const deleteTeacherById = createAsyncThunk("/auth/delete-teacher", async (id, {rejectWithValue}) => {
    try {
        const res = axiosInstance.delete(`user/teachers/${id}`);
        toast.promise(res, {
            loading: "Menghapus akun teacher...",
            success: (data) => data?.data?.message,
            error: (err) => err?.response?.data?.message || "Gagal menghapus akun teacher"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Gagal menghapus akun teacher");
        return rejectWithValue(error?.response?.data);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(creatAccount.fulfilled, (state, action)=>{
            if(!action?.payload?.user) return;
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", action?.payload?.user?.role);
            state.data=action?.payload?.user;
            state.role=action?.payload?.user?.role
            state.isLoggedIn = true;

        })
        .addCase(login.fulfilled, (state, action)=>{
            if(!action?.payload?.user) return;
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", action?.payload?.user?.role);
            state.data=action?.payload?.user;
            state.role=action?.payload?.user?.role
            state.isLoggedIn=true;

        })
        .addCase(logout.fulfilled, (state)=>{
            localStorage.clear();
            state.data={};
            state.isLoggedIn=false;
            state.role="";

        })
        .addCase(getuserData.fulfilled, (state, action)=>{
            if(!action?.payload?.user)return;
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", action?.payload?.user?.role);
            state.isLoggedIn=true;
            state.data=action?.payload?.user;
            state.role=action?.payload?.user?.role

        })

    }
});

export default authSlice.reducer;