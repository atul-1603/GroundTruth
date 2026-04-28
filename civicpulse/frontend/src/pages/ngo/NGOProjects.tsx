import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import client from '../../api/client'
import { useAuthStore } from '../../store/useAuthStore'
import { Plus, Briefcase, MapPin, ClipboardList } from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'


export default function NGOProjects() {
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [volunteers, setVolunteers] = useState<any[]>([])
  const [assignmentData, setAssignmentData] = useState({ userId: '', deadline: '' })
  
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newProject, setNewProject] = useState<any>({
    title: '',
    description: '',
    region: '',
    activityType: 'SURVEY',
    domain: '',
    address: '',
    lat: 19.0760,
    lng: 72.8777,
    deadline: ''
  })

  const { user } = useAuthStore()

  const fetchProjects = async () => {
    if (!user) return
    try {
      const res = await client.get(`/api/activity/ngo/${user.uid}`)
      setProjects(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }


  const fetchVolunteers = async () => {
    if (!user) return
    const res = await client.get(`/api/ngo/${user.uid}/volunteers`)
    setVolunteers(res.data)
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await client.post(`/api/activity/${selectedProject.activityId}/assign`, assignmentData)
      alert("Invite sent to volunteer!")
      setInviteModalOpen(false)
      fetchProjects()
    } catch (err) {
      alert("Failed to send invite")
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    fetchProjects()
    fetchVolunteers()
  }, [user])

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        ...newProject,
        ngoId: user?.uid,
        location: { lat: newProject.lat, lng: newProject.lng, address: newProject.address },
        assignedArea: { type: "radius", center: { lat: newProject.lat, lng: newProject.lng }, radiusMeters: 1000 }
      }
      await client.post('/api/activity', payload)
      setModalOpen(false)
      fetchProjects()
    } catch (err) {
      alert('Failed to create project')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900 font-outfit">Active Projects</h1>
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2 rounded-full h-11 px-6">
          <Plus size={18} /> New Project
        </Button>
      </div>

      <Modal open={modalOpen} onOpenChange={setModalOpen} title="Initiate New Field Project">
        <form onSubmit={handleAddProject} className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Project Title</label>
            <Input value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} required placeholder="e.g. Health Survey 2024" className="rounded-xl" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Detailed Mandate</label>
            <textarea 
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              rows={3}
              value={newProject.description} 
              onChange={e => setNewProject({...newProject, description: e.target.value})} 
              required 
              placeholder="Describe the operational goals..." 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Target Region</label>
              <Input value={newProject.region} onChange={e => setNewProject({...newProject, region: e.target.value})} required placeholder="Dharavi, Mumbai" className="rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Deadline (Optional)</label>
              <Input type="date" value={newProject.deadline || ''} onChange={e => setNewProject({...newProject, deadline: e.target.value})} className="rounded-xl" />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <Button type="button" variant="secondary" className="flex-1 rounded-xl h-12" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1 rounded-xl h-12 shadow-lg shadow-primary-100" isLoading={submitting}>Start Project</Button>
          </div>
        </form>
      </Modal>

      <Modal open={inviteModalOpen} onOpenChange={setInviteModalOpen} title="Assign Personnel">
        <form onSubmit={handleInvite} className="space-y-6 pt-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Select Volunteer</label>
            <select 
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              required
              value={assignmentData.userId}
              onChange={e => setAssignmentData({...assignmentData, userId: e.target.value})}
            >
              <option value="">Choose a verified volunteer...</option>
              {volunteers.map(v => (
                <option key={v.userId} value={v.userId}>{v.name} ({v.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Mission Deadline</label>
            <Input type="date" value={assignmentData.deadline} onChange={e => setAssignmentData({...assignmentData, deadline: e.target.value})} required className="rounded-xl" />
          </div>
          <div className="pt-2 flex gap-3">
            <Button type="button" variant="secondary" className="flex-1 rounded-xl h-12" onClick={() => setInviteModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1 rounded-xl h-12 shadow-lg shadow-primary-100" isLoading={submitting}>Send Task Invite</Button>
          </div>
        </form>
      </Modal>

      <div className="grid grid-cols-1 gap-6">
        {projects.map((project) => (
          <Card key={project.activityId} className="p-8 hover:shadow-xl transition-all border border-slate-200 hover:border-primary-200 rounded-3xl group">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-outfit">{project.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant={project.priorityScore >= 8 ? 'danger' : 'warning'} className="h-5 text-[10px]">Priority {project.priorityScore}</Badge>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <MapPin size={10} /> {project.region}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed text-sm max-w-2xl">{project.description}</p>
                
                <div className="flex items-center gap-6">
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Volunteers</p>
                     <p className="text-sm font-bold text-slate-900">{project.volunteersAssigned?.length || 0} Assigned</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status</p>
                     <p className="text-sm font-bold text-primary-600 capitalize">{project.status}</p>
                   </div>
                   {project.deadline && (
                     <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Deadline</p>
                       <p className="text-sm font-bold text-red-600">{new Date(project.deadline).toLocaleDateString()}</p>
                     </div>
                   )}
                </div>
              </div>

              <div className="w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 border-slate-100 flex gap-2">
                <Button 
                  onClick={() => { setSelectedProject(project); setInviteModalOpen(true) }}
                  variant="secondary" 
                  className="flex-1 md:flex-none rounded-xl h-10 px-6 text-xs font-bold"
                >
                  Invite Volunteer
                </Button>
                <Button className="flex-1 md:flex-none rounded-xl h-10 px-6 text-xs font-bold">
                  Manage Task
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {projects.length === 0 && !loading && (
          <Card className="p-20 text-center border-dashed bg-slate-50/50 rounded-3xl">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
               <ClipboardList size={32} />
            </div>
            <h3 className="text-slate-900 font-bold">No projects initiated yet</h3>
            <p className="text-slate-500 text-sm">Convert a field report or click "New Project" to start.</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
