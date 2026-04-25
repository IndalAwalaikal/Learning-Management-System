import { configureStore } from "@reduxjs/toolkit";

import AuthSliceReducer from "./Slices/AuthSlice";
import CourseSliceReducer from "./Slices/CourseSlice";
import LecturesReducer from './Slices/LectureSlice'
import  StatReducer from './Slices/StatSlice';

const store = configureStore({
    reducer:{
        auth:AuthSliceReducer,
        course: CourseSliceReducer, 
        lecture:LecturesReducer,
        stat:StatReducer,
    },
    devTools: true
})
export default store;