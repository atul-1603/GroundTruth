import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import client from '../../api/client'
import { useAuthStore } from '../../store/useAuthStore'
import { UserPlus, Search, Mail, Plus, Trash2, Edit2 } from 'lucide-react'
import { Modal } from '../../components/ui/Modal'

export default function NGOVolunteers() {
  const [volunteers, setVolunteers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [newVol, setNewVol] = useState({ name: '', personal_email: '', skills: '', password: '' })
  const [editingVol, setEditingVol] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')


  const { user } = useAuthStore()

  const fetchVolunteers = async () => {
    if (!user) return
    try {
      const res = await client.get(`/api/ngo/${user.uid}/volunteers`)
      setVolunteers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVolunteers()
  }, [user])

  const handleDeleteVolunteer = async (volunteerId: string) => {
    if (!window.confirm('Are you sure you want to remove this volunteer?')) return
    try {
      await client.delete(`/api/ngo/${user?.uid}/volunteers/${volunteerId}`)
      fetchVolunteers()
    } catch (err) {
      console.error(err)
      alert('Failed to delete volunteer')
    }
  }

  const handleUpdateVolunteer = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const skillsArr = editingVol.skills_str.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '')
      await client.put(`/api/ngo/${user?.uid}/volunteers/${editingVol.userId}`, {
        ...editingVol,
        skills: skillsArr
      })
      setEditModalOpen(false)
      fetchVolunteers()
    } catch (err) {
      console.error(err)
      alert('Failed to update volunteer')
    } finally {
      setSubmitting(false)
    }
  }


  const handleAddVolunteer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newVol.password && newVol.password.length < 6) {
      alert('Password must be at least 6 characters long')
      return
    }
    setSubmitting(true)

    try {
      const skillsArr = newVol.skills.split(',').map(s => s.trim()).filter(s => s !== '')
      await client.post(`/api/ngo/${user?.uid}/volunteers`, {
        ...newVol,
        skills: skillsArr
      })
      setModalOpen(false)
      setNewVol({ name: '', personal_email: '', skills: '', password: '' })
      fetchVolunteers()

    } catch (err) {
      console.error(err)
      alert('Failed to add volunteer')
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Volunteer Network</h1>
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2 rounded-full">
          <UserPlus size={18} /> Add Volunteer
        </Button>
      </div>

      <Modal open={modalOpen} onOpenChange={setModalOpen} title="Invite New Volunteer">
        <form onSubmit={handleAddVolunteer} className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Full Name</label>
            <Input 
              value={newVol.name} 
              onChange={e => setNewVol({...newVol, name: e.target.value})} 
              required 
              placeholder="John Doe" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Personal Email</label>
            <Input 
              type="email" 
              value={newVol.personal_email} 
              onChange={e => setNewVol({...newVol, personal_email: e.target.value})} 
              required 
              placeholder="john@example.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Temporary Password (Optional)</label>
            <Input 
              type="password"
              value={newVol.password} 
              onChange={e => setNewVol({...newVol, password: e.target.value})} 
              placeholder="Min 6 characters" 
            />
            <p className="text-[10px] text-slate-400 mt-1">If empty, a random password will be generated and emailed.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Skills (comma separated)</label>
            <Input 
              value={newVol.skills} 
              onChange={e => setNewVol({...newVol, skills: e.target.value})} 
              placeholder="First Aid, Logistics, Tech" 
            />
          </div>
          <div className="pt-4 flex gap-3">
            <Button type="button" variant="secondary" className="flex-1 rounded-full" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1 rounded-full" isLoading={submitting}>Send Invite</Button>
          </div>
        </form>
      </Modal>


      <Modal open={editModalOpen} onOpenChange={setEditModalOpen} title="Edit Volunteer">
        {editingVol && (
          <form onSubmit={handleUpdateVolunteer} className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
              <Input 
                value={editingVol.name} 
                onChange={e => setEditingVol({...editingVol, name: e.target.value})} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Personal Email</label>
              <Input 
                type="email" 
                value={editingVol.personal_email} 
                onChange={e => setEditingVol({...editingVol, personal_email: e.target.value})} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Skills (comma separated)</label>
              <Input 
                value={editingVol.skills_str} 
                onChange={e => setEditingVol({...editingVol, skills_str: e.target.value})} 
              />
            </div>
            <div className="pt-4 flex gap-3">
              <Button type="button" variant="secondary" className="flex-1" onClick={() => setEditModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="flex-1" isLoading={submitting}>Save Changes</Button>
            </div>
          </form>
        )}
      </Modal>



      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <Input 
          className="pl-10 h-12 rounded-xl bg-white border-slate-200" 
          placeholder="Search volunteers by name, skills or email..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {volunteers
          .filter(vol => 
            vol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vol.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vol.skills?.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()))
          )
          .map((vol) => (
          <Card key={vol.userId} className="p-6 relative group border border-slate-200 hover:border-primary-200 transition-all hover:shadow-lg hover:shadow-slate-100">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => {
                  setEditingVol({ ...vol, skills_str: vol.skills?.join(', ') || '' })
                  setEditModalOpen(true)
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => handleDeleteVolunteer(vol.userId)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl">
                {vol.name[0]}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{vol.name}</h3>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Mail size={12} /> {vol.email}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-1 font-medium">Availability Score</p>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${vol.fatigueScore > 7 ? 'bg-red-500' : vol.fatigueScore > 4 ? 'bg-amber-500' : 'bg-ngo-success'}`}
                    style={{ width: `${vol.fatigueScore * 10}%` }}
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-2">
                {vol.skills?.map((skill: string) => (
                  <Badge key={skill} className="bg-slate-50 text-slate-500 border border-slate-100">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
        {volunteers.length === 0 && !loading && (
          <div className="md:col-span-3 text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No volunteers found matching your search.</p>
          </div>
        )}
      </div>

    </DashboardLayout>
  )
}
