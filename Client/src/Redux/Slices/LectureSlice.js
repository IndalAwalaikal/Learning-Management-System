import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../Helpers/axiosinstance";

const initialState={
    lectures:[]
}
 
export const getCourseLectures= createAsyncThunk("/course/lecture/get", async(cid)=>{
    try {
        const response = axiosInstance.get(`/course/${cid}`);
        return (await response).data;
    } catch (error) {
        console.log(error);
    }
});

export const addCourseLectures= createAsyncThunk("/course/lecture/add", async(data)=>{
    try {
        const fromData = new FormData();
        if(data.lecture) fromData.append("lecture",data.lecture);
        fromData.append("title",data.title);
        fromData.append("description",data.description);
        fromData.append("type", data.type || "VIDEO");
        if(data.externalUrl) fromData.append("externalUrl", data.externalUrl);
        
        const response = axiosInstance.post(`/course/${data.id}`,fromData);
        toast.promise(response,{
            loading:"Uploading lecture...",
            success:"Lecture added successfully",
            error:(err)=> err?.response?.data?.message || "Gagal menambah lecture"
        });
        return (await response).data;
    } catch (error) {
        console.log(error);
    }
});

export const deleteCourseLecture= createAsyncThunk("/course/lecture/delete", async(data)=>{
    try {
        const response = axiosInstance.delete(`/course/${data.courseId}/lectures/${data.lectureId}`);
        toast.promise(response,{
            loading:"Deleting lecture...",
            success:"Lecture deleted successfully",
            error:(err)=> err?.response?.data?.message || "Gagal menghapus lecture"
        });
        return (await response).data;
    } catch (error) {
        console.log(error);
    }
});

export const editCourseLecture = createAsyncThunk("/course/lecture/edit", async(data)=>{
    try {
        const fromData = new FormData();
        if(data.lecture) fromData.append("lecture",data.lecture);
        if(data.title) fromData.append("title",data.title);
        if(data.description) fromData.append("description",data.description);
        if(data.type) fromData.append("type", data.type);
        if(data.externalUrl) fromData.append("externalUrl", data.externalUrl);
        
        const response = axiosInstance.put(`/course/${data.courseId}/lectures/${data.lectureId}`,fromData);
        toast.promise(response,{
            loading:"Updating lecture...",
            success:"Lecture updated successfully",
            error: (err) => err?.response?.data?.message || "Failed to update lecture"
        });
        return (await response).data;
    } catch (error) {
        console.log("Lecture Edit Error:", error?.response?.data || error);
    }
});

const lectureSlice = createSlice({
    name:"lecture",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getCourseLectures.fulfilled,(state, action)=>{
            state.lectures=action?.payload?.lectures;
        })
        .addCase(addCourseLectures.fulfilled,(state, action)=>{
            state.lectures=action?.payload?.course?.lectures;
        })
        .addCase(editCourseLecture.fulfilled,(state, action)=>{
            state.lectures=action?.payload?.course?.lectures;
        })
    }

})
export default lectureSlice.reducer;