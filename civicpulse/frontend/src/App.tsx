import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import NGOLogin from './pages/NGOLogin'
import NGORegister from './pages/NGORegister'
import VolunteerLogin from './pages/VolunteerLogin'
import NGODashboard from './pages/ngo/NGODashboard'
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard'
import { useAuthStore } from './store/useAuthStore'

import NGOProjects from './pages/ngo/NGOProjects'
import NGOVolunteers from './pages/ngo/NGOVolunteers'
import NGOSettings from './pages/ngo/NGOSettings'
import NGOReports from './pages/ngo/NGOReports'
import Profile from './pages/shared/Profile'
import VolunteerTasks from './pages/volunteer/VolunteerTasks'



import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { Spinner } from './components/ui/Spinner'

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: string }) => {
  const { user, role, isLoading } = useAuthStore()
  
  if (isLoading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
      <Spinner />
    </div>
  )
  
  if (!user) return <Navigate to="/" />
  if (!role) return null // Wait for role to rehydrate from persist
  if (role !== allowedRole) return <Navigate to={`/${role}/dashboard`} />
  return <>{children}</>

}

export default function App() {
  const { setUser, setLoading } = useAuthStore()

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/ngo/login" element={<NGOLogin />} />
        <Route path="/ngo/register" element={<NGORegister />} />
        <Route path="/volunteer/login" element={<VolunteerLogin />} />

        
        <Route path="/ngo/*" element={
          <ProtectedRoute allowedRole="ngo">
            <Routes>
              <Route path="dashboard" element={<NGODashboard />} />
              <Route path="projects" element={<NGOProjects />} />
              <Route path="volunteers" element={<NGOVolunteers />} />
              <Route path="reports" element={<NGOReports />} />
              <Route path="settings" element={<NGOSettings />} />

              <Route path="profile" element={<Profile />} />
              {/* Other NGO routes */}
            </Routes>

          </ProtectedRoute>
        } />

        <Route path="/volunteer/*" element={
          <ProtectedRoute allowedRole="volunteer">
            <Routes>
              <Route path="dashboard" element={<VolunteerDashboard />} />
              <Route path="tasks" element={<VolunteerTasks />} />
              <Route path="profile" element={<Profile />} />

              {/* Other Volunteer routes */}
            </Routes>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}
