import React, { useState } from 'react'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate, Link } from 'react-router-dom'
import { Shield } from 'lucide-react'

export default function NGOLogin() {
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
      setRole('ngo')
      navigate('/ngo/dashboard')
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
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
            <Shield size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">NGO Admin Login</h1>
          <p className="text-slate-500 text-sm mt-2">Manage your organization and volunteers</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm border border-red-100">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@organization.org" className="rounded-xl border-slate-200" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Password</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="rounded-xl border-slate-200" />
          </div>
          <Button type="submit" className="w-full h-12 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100" isLoading={loading}>Access Dashboard</Button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account? <Link to="/ngo/register" className="text-primary-600 font-bold hover:underline">Register NGO</Link>
        </p>
      </Card>
    </div>

  )
}
