import React, { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuthStore } from '../../store/useAuthStore'
import client from '../../api/client'
import { User, Mail, Phone, MapPin, Camera, ShieldCheck, Award } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'

export default function Profile() {
  const { user, role } = useAuthStore()
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      try {
        const endpoint = role === 'ngo' ? `/api/ngo/${user.uid}` : `/api/volunteer/${user.uid}`
        const res = await client.get(endpoint)
        setProfileData(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user, role])

  const handleSave = async () => {
    try {
      const endpoint = role === 'ngo' ? `/api/ngo/${user?.uid}` : `/api/volunteer/${user?.uid}`
      await client.put(endpoint, profileData)
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (err) {
      alert('Failed to update profile')
    }
  }

  if (loading) return <DashboardLayout><div className="p-12 text-center text-slate-400">Loading profile...</div></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {/* Header Section */}
        <div className="relative">
          <div className="h-48 w-full bg-gradient-to-r from-primary-600 to-indigo-600 rounded-3xl shadow-lg"></div>
          <div className="absolute -bottom-16 left-8 flex items-end gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-xl border border-slate-100 overflow-hidden">
                <div className="w-full h-full rounded-[1.4rem] bg-slate-50 flex items-center justify-center text-primary-500 font-bold text-4xl">
                  {profileData?.name?.[0] || 'U'}
                </div>
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-slate-500 hover:text-primary-600 transition-colors">
                <Camera size={18} />
              </button>
            </div>
            <div className="pb-4">
              <h1 className="text-3xl font-extrabold text-slate-900">{profileData?.name || 'User Name'}</h1>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant={role === 'ngo' ? 'primary' : 'success'} className="uppercase tracking-widest text-[10px]">
                  {role} Account
                </Badge>
                <span className="text-sm text-slate-500 flex items-center gap-1">
                  <MapPin size={14} /> {profileData?.region || 'Global'}
                </span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 right-8">
            <Button 
              variant={isEditing ? 'primary' : 'secondary'} 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="rounded-xl px-6 shadow-md"
            >
              {isEditing ? 'Save Profile' : 'Edit Profile'}
            </Button>
          </div>
        </div>

        <div className="pt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Info */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <User size={20} className="text-primary-500" />
                  Account Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Display Name</label>
                  <Input 
                    value={profileData?.name} 
                    onChange={e => setProfileData({...profileData, name: e.target.value})}
                    readOnly={!isEditing}
                    className={!isEditing ? 'bg-slate-50' : ''}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                  <Input value={user?.email || ''} readOnly className="bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                  <Input 
                    value={profileData?.phone || ''} 
                    onChange={e => setProfileData({...profileData, phone: e.target.value})}
                    readOnly={!isEditing}
                    placeholder="+91 XXXXX XXXXX"
                    className={!isEditing ? 'bg-slate-50' : ''}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location / Region</label>
                  <Input 
                    value={profileData?.region || ''} 
                    onChange={e => setProfileData({...profileData, region: e.target.value})}
                    readOnly={!isEditing}
                    className={!isEditing ? 'bg-slate-50' : ''}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">About / Bio</label>
                <textarea 
                  className={`w-full h-32 p-4 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${!isEditing ? 'bg-slate-50 border-slate-100 text-slate-600' : 'bg-white border-slate-200 text-slate-900 focus:border-primary-500'}`}
                  value={profileData?.bio || ''}
                  onChange={e => setProfileData({...profileData, bio: e.target.value})}
                  readOnly={!isEditing}
                  placeholder="Tell us about your mission..."
                />
              </div>
            </Card>

            {role === 'volunteer' && (
               <Card className="p-8">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                    <Award size={20} className="text-ngo-accent" />
                    Skills & Expertise
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {profileData?.skills?.map((skill: string) => (
                      <Badge key={skill} className="bg-slate-100 text-slate-600 border-none px-4 py-2 text-xs font-bold">
                        {skill}
                      </Badge>
                    ))}
                    {isEditing && (
                      <button className="px-4 py-2 rounded-full border border-dashed border-slate-300 text-slate-400 text-xs font-bold hover:border-primary-500 hover:text-primary-600 transition-colors">
                        + Add Skill
                      </button>
                    )}
                  </div>
               </Card>
            )}
          </div>

          {/* Right Column: Stats & Meta */}
          <div className="space-y-8">
            <Card className="p-6 bg-slate-900 text-white rounded-3xl">
              <h3 className="text-primary-300 text-xs font-bold uppercase tracking-widest mb-6">Security Status</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-800/50 flex items-center justify-center text-primary-400">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Verified Account</p>
                    <p className="text-[10px] text-primary-400">Identity checks completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-800/50 flex items-center justify-center text-primary-400">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Email Connected</p>
                    <p className="text-[10px] text-primary-400">{user?.email}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-slate-900 text-sm font-bold mb-4">Activity Log</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-1 h-8 bg-primary-100 rounded-full"></div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Profile Updated</p>
                    <p className="text-[10px] text-slate-400">2 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-1 h-8 bg-green-100 rounded-full"></div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Task Completed</p>
                    <p className="text-[10px] text-slate-400">Yesterday</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
