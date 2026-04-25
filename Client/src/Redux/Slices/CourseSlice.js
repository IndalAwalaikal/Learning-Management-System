import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast";

import axiosInstance from "../../Helpers/axiosinstance";

const initialState ={
    courseData: []
}

export const getAllCourse = createAsyncThunk("/course/get", async ()=>{
    try {
        const response=axiosInstance.get("/course");
        return (await response).data.courses;
    } catch (error) {
        toast.error(error?.response?.data?.message);    
    }
})

export const createNewCourse= createAsyncThunk("/course/create", async(data)=>{
    try {
        let fromData = new FormData();
        fromData.append("title",data?.title);
        fromData.append("description",data?.description);
        fromData.append("category",data?.category);
        fromData.append("createdBy",data?.createdBy);
        fromData.append("thumbnail",data?.thumbnail);

        const response=axiosInstance.post("/course", fromData);
        toast.promise(response,{
            loading:"Creating new course",
            success:"Course created sucessfully",
            error:(err)=> err?.response?.data?.message || "Gagal membuat course"
        });

        return (await response).data;
        
    } catch (error) {
        console.log(error);
    }
})

export const deleteCourse = createAsyncThunk("/course/delete", async (id)=>{
    try {
        const response=axiosInstance.delete(`/course/${id}`);
        toast.promise(response, {
            loading:"Deleting course...",
            success:"Course deleted successfully",
            error:(err)=> err?.response?.data?.message || "Gagal menghapus course",
        });
        return (await response).data;
    } catch (error) {
        console.log(error);
    }
})

export const updateCourse = createAsyncThunk("/course/update", async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("category", data.category);
      formData.append("createdBy", data.createdBy);
      formData.append("description", data.description);
      if (data.thumbnail) {
        formData.append("thumbnail", data.thumbnail);
      }
  
      const res = axiosInstance.put(`/course/${data.id}`, formData);
  
      toast.promise(res, {
        loading: "Updating the course...",
        success: "Course updated successfully",
        error: (err) => err?.response?.data?.message || "Gagal mengupdate course",
      });
  
      const response = await res;
      return response.data;
    } catch (error) {
      console.log(error);
    }
  });

const courseSlice =createSlice({
    name :"course",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getAllCourse.fulfilled,(state, action)=>{
            if(action.payload){
                state.courseData=[...action.payload]
                
            }
        })
    } 
});

export default courseSlice.reducer;
