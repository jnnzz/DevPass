import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import StudentDashboard from './pages/student/StudentDashboard'
import './App.css'
import Landing from './pages/Landing'
import AdminDashboard from './pages/admin/AdminDashboard'
import SecurityPersonnel from './pages/Personnel/SecurityPersonnel'
import AdminSettings from './pages/admin/AdminSettings'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/personnel/dashboard" element={<SecurityPersonnel />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
    </Router>
  )
}

export default App
