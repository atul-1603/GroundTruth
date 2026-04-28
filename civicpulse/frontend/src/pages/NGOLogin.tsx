import React, { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'
import { useAuthStore } from '../../store/useAuthStore'
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
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-900/50 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={24} />
          </div>
          <h1 className="text-2xl font-bold">NGO Admin Login</h1>
          <p className="text-gray-400 text-sm mt-2">Manage your organization and volunteers</p>
        </div>
        {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-md mb-4 text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" isLoading={loading}>Sign In</Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account? <Link to="/ngo/register" className="text-primary-400 hover:underline">Register your NGO</Link>
        </p>
      </Card>
    </div>
  )
}
