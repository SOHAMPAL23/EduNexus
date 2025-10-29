import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CourseList from './components/student/CourseList';
import CourseDetail from './components/student/CourseDetail';
import AssignmentSubmit from './components/student/AssignmentSubmit';
import InstructorDashboard from './components/instructor/InstructorDashboard';
import CreateCourse from './components/instructor/CreateCourse';
import ManageCourse from './components/instructor/ManageCourse';
import AdminDashboard from './components/admin/AdminDashboard';
import ChatRoom from './components/chat/ChatRoom';
import UploadLecture from './components/instructor/UploadLecture';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<CourseList />} />
            
            {/* Student Routes */}
            <Route 
              path="/courses/:id" 
              element={
                <ProtectedRoute roles={['student', 'instructor', 'admin']}>
                  <CourseDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assignment/:id/submit" 
              element={
                <ProtectedRoute roles={['student']}>
                  <AssignmentSubmit />
                </ProtectedRoute>
              } 
            />
            
            {/* Instructor Routes */}
            <Route 
              path="/instructor/dashboard" 
              element={
                <ProtectedRoute roles={['instructor']}>
                  <InstructorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/instructor/create-course" 
              element={
                <ProtectedRoute roles={['instructor']}>
                  <CreateCourse />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/instructor/course/:id/manage" 
              element={
                <ProtectedRoute roles={['instructor']}>
                  <ManageCourse />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/instructor/course/:courseId/upload" 
              element={
              <ProtectedRoute roles={['instructor']}>
                <UploadLecture />
              </ProtectedRoute>
            } 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Chat Route */}
            <Route 
              path="/chat/:courseId" 
              element={
                <ProtectedRoute>
                  <ChatRoom />
                </ProtectedRoute>
              } 
            />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;