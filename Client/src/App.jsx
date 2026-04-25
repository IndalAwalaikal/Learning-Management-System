
import './App.css'

import { Route, Routes } from 'react-router-dom'

import RequireAuth from './Compontents/Auth/RequireAuth.jsx'
import AboutUs from './Pages/AboutUs.jsx'
import Contact from './Pages/Contact.jsx'
import CourseDescripition from './Pages/Course/CourseDescription.jsx'
import CourseList from './Pages/Course/CourseList.jsx'
import CreateCourse from './Pages/Course/CreateCourse.jsx'
import EditCourse from './Pages/Course/EditCourse.jsx'
import Denied from './Pages/Denied.jsx'
import AddCourseLectures from './Pages/Deshboard/AddLectures.jsx'
import EditLecture from './Pages/Deshboard/EditLecture.jsx'
import AdminDeshboard from './Pages/Deshboard/AdminDeshboard.jsx'
import Displaylectures from './Pages/Deshboard/DisplayLectures.jsx'
import TeacherList from './Pages/Deshboard/TeacherList.jsx'
import HomePage from './Pages/HomePage.jsx'
import Login from './Pages/Login.jsx'
import NotFound from './Pages/NotFound.jsx'
import ChangePassword from './Pages/Password/ChangePassword.jsx'
import ForgetPassword from './Pages/Password/ForgetPassword.jsx'
import ResetPassword from './Pages/Password/ResetPassword.jsx'
import Signup from './Pages/Signup.jsx'
import EditProfile from './Pages/User/EditProfile.jsx'
import Profile from './Pages/User/Profile.jsx'

function App() {
  return (
    <>
      <Routes>
          <Route path='/' element={<HomePage/>}></Route>
          <Route path='/about' element={<AboutUs/>}></Route>
          <Route path='/courses' element={<CourseList/>}></Route>
          <Route path='/contact' element={<Contact/>}></Route>
          <Route path='/denied' element={<Denied/>}></Route>
          <Route path='/course/description' element={<CourseDescripition/>}></Route>

          <Route path='/signup' element={<Signup/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/forget-password' element={<ForgetPassword/>}></Route>
          <Route path="/reset-password/:resetToken" element={<ResetPassword/>} />
          
          {/* TEACHER-only: Course management */}
          <Route element={<RequireAuth allowedRoles={["TEACHER"]}/>}>
           <Route path='/course/create' element={<CreateCourse/>}></Route>
           <Route path='/course/edit' element={<EditCourse/>}></Route>
           <Route path='/course/addlecture' element={<AddCourseLectures/>}></Route>
           <Route path='/course/editlecture' element={<EditLecture/>}></Route>
          </Route>

          {/* SUPER_ADMIN-only: Teacher management */}
          <Route element={<RequireAuth allowedRoles={["SUPER_ADMIN"]}/>}>
           <Route path='/admin/teachers' element={<TeacherList/>}></Route>
          </Route>

          {/* Shared dashboard for both roles */}
          <Route element={<RequireAuth allowedRoles={["SUPER_ADMIN", "TEACHER"]}/>}>
           <Route path='/admin/deshboard' element={<AdminDeshboard/>}></Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={["SUPER_ADMIN", "TEACHER", "STUDENT"]}/>}>
            <Route path='/user/profile' element={<Profile/>}></Route> 
            <Route path='/user/editprofile' element={<EditProfile/>}></Route> 
            <Route path='/change-password' element={<ChangePassword/>}></Route>
            <Route path='/course/displaylecture' element={<Displaylectures/>}></Route>
          </Route>
                  
          <Route path='*' element={<NotFound/>}></Route>
      </Routes>
    </>
  )
}

export default App
