import React, { useState } from 'react'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate, Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import axios from 'axios'

export default function NGORegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    region: '',
    workDomain: '',
    type: '',
    presidentName: '',
    govId: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Split workDomain by comma and trim
      const domains = formData.workDomain.split(',').map(d => d.trim()).filter(d => d !== '')
      
      const payload = {
        ...formData,
        workDomain: domains
      }

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/ngo/register`, payload)
      
      // After registration, redirect to login
      navigate('/ngo/login', { state: { message: 'Registration successful! Please login.' } })
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg py-12 px-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-900/50 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 size={24} />
          </div>
          <h1 className="text-2xl font-bold">Register Your NGO</h1>
          <p className="text-gray-400 text-sm mt-2">Join CivicPulse to coordinate volunteers and streamline operations</p>
        </div>

        {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-md mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">NGO Name</label>
            <Input name="name" value={formData.name} onChange={handleChange} required placeholder="Official NGO Name" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="contact@ngo.org" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <Input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">President/Head Name</label>
            <Input name="presidentName" value={formData.presidentName} onChange={handleChange} required placeholder="Full Name" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Government ID / Reg No.</label>
            <Input name="govId" value={formData.govId} onChange={handleChange} required placeholder="e.g. REG-123456" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Organization Type</label>
            <Input name="type" value={formData.type} onChange={handleChange} required placeholder="Trust, Society, etc." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Region / City</label>
            <Input name="region" value={formData.region} onChange={handleChange} required placeholder="e.g. Mumbai, Maharashtra" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Office Address</label>
            <Input name="address" value={formData.address} onChange={handleChange} required placeholder="Full Street Address" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Work Domains (comma separated)</label>
            <Input name="workDomain" value={formData.workDomain} onChange={handleChange} required placeholder="Education, Healthcare, Environment" />
          </div>

          <div className="md:col-span-2 mt-4">
            <Button type="submit" className="w-full h-12 text-lg" isLoading={loading}>Register NGO</Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already registered? <Link to="/ngo/login" className="text-primary-400 hover:underline">Sign in instead</Link>
        </p>
      </Card>
    </div>
  )
}
