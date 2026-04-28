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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 border border-slate-200 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-100">
            <Users size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">Volunteer Login</h1>
          <p className="text-slate-500 text-sm mt-2">Access your assigned tasks and report from field</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm border border-red-100">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Generated Email</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="firstname.ngocode@civicpulse.org" className="rounded-xl border-slate-200" />
            <p className="text-[10px] text-slate-400 mt-2 leading-relaxed italic">Your login email was sent to your personal email by your NGO partner.</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Password</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="rounded-xl border-slate-200" />
          </div>
          <Button type="submit" className="w-full h-12 rounded-xl text-sm font-bold shadow-lg shadow-primary-200" isLoading={loading}>Sign In to Workspace</Button>
        </form>
      </Card>
    </div>
  )
}
