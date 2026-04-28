import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import NGOLogin from './pages/NGOLogin'
import VolunteerLogin from './pages/VolunteerLogin'
import NGODashboard from './pages/ngo/NGODashboard'
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard'
import { useAuthStore } from './store/useAuthStore'

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: string }) => {
  const { user, role } = useAuthStore()
  if (!user) return <Navigate to="/" />
  if (role !== allowedRole) return <Navigate to={`/${role}/dashboard`} />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/ngo/login" element={<NGOLogin />} />
        <Route path="/ngo/register" element={<div className="text-white p-10">NGO Register Route (TBD)</div>} />
        <Route path="/volunteer/login" element={<VolunteerLogin />} />
        
        <Route path="/ngo/*" element={
          <ProtectedRoute allowedRole="ngo">
            <Routes>
              <Route path="dashboard" element={<NGODashboard />} />
              {/* Other NGO routes */}
            </Routes>
          </ProtectedRoute>
        } />

        <Route path="/volunteer/*" element={
          <ProtectedRoute allowedRole="volunteer">
            <Routes>
              <Route path="dashboard" element={<VolunteerDashboard />} />
              {/* Other Volunteer routes */}
            </Routes>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}
