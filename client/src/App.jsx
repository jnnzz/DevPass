import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import StudentDashboard from './pages/student/StudentDashboard'
import './App.css'
import Landing from './pages/Landing'
import AdminDashboard from './pages/admin/AdminDashboard'
import SecurityPersonnel from './pages/Personnel/SecurityPersonnel'
import QRScanner from './pages/QRScanner'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing/>}></Route>
          <Route path="/student/dashboard" element={<StudentDashboard/>}></Route>
          <Route path="/admin/dashboard" element={<AdminDashboard/>}></Route>
          <Route path="/personnel/dashboard" element={<SecurityPersonnel/>}></Route>
          <Route path="/qr/scanner" element={<QRScanner/>}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
