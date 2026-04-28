import React, { useState } from 'react'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate } from 'react-router-dom'
import { Users } from 'lucide-react'

export default function VolunteerLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setUser, setRole } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      setUser(userCredential.user)
      setRole('volunteer')
      navigate('/volunteer/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-900/50 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={24} />
          </div>
          <h1 className="text-2xl font-bold">Volunteer Login</h1>
          <p className="text-gray-400 text-sm mt-2">Access your assigned tasks and report from field</p>
        </div>
        {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-md mb-4 text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Generated Email</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="firstname.ngocode@civicpulse.org" />
            <p className="text-xs text-gray-500 mt-1">Your login email was sent to your personal email by your NGO</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" isLoading={loading}>Sign In</Button>
        </form>
      </Card>
    </div>
  )
}
