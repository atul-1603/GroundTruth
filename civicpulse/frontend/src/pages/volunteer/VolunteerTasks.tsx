import React, { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Briefcase, Clock, MapPin, CheckCircle2, AlertCircle } from 'lucide-react'
import client from '../../api/client'
import { useAuthStore } from '../../store/useAuthStore'

export default function VolunteerTasks() {
  const { user } = useAuthStore()
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = async () => {
    if (!user) return
    try {
      const res = await client.get(`/api/activity/volunteer/${user.uid}`)
      setTasks(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [user])

  const handleStatusUpdate = async (id: string, status: 'accepted' | 'rejected' | 'completed') => {
    try {
      await client.put(`/api/activity/assignment/${id}`, { status })
      fetchTasks()
    } catch (err) {
      alert('Failed to update task')
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 font-outfit">My Active Tasks</h1>
        <p className="text-slate-500 mt-1">Manage your assigned duties and coordinate with your NGO.</p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading assignments...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <Card key={task.id} className={`p-6 border-l-4 transition-all ${
              task.status === 'pending' ? 'border-l-amber-400' : 
              task.status === 'accepted' ? 'border-l-primary-500' : 'border-l-green-500'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <Badge variant={task.priorityScore >= 8 ? 'danger' : 'warning'}>Priority {task.priorityScore}</Badge>
                <Badge className="bg-slate-100 text-slate-600 border-none capitalize">{task.status}</Badge>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2">{task.title}</h3>
              <p className="text-slate-600 text-sm mb-6 line-clamp-3">{task.description}</p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin size={14} className="text-primary-500" />
                  {task.region || 'Assigned Region'}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock size={14} className="text-primary-500" />
                  Assigned on {new Date(task.assignedAt).toLocaleDateString()}
                </div>
                {task.deadline && (
                  <div className="flex items-center gap-2 text-xs text-red-600 font-bold">
                    <AlertCircle size={14} />
                    Deadline: {new Date(task.deadline).toLocaleDateString()}
                  </div>
                )}
              </div>


              <div className="flex gap-3">
                {task.status === 'pending' && (
                  <>
                    <Button variant="secondary" className="flex-1 rounded-xl" onClick={() => handleStatusUpdate(task.id, 'rejected')}>Decline</Button>
                    <Button className="flex-1 rounded-xl" onClick={() => handleStatusUpdate(task.id, 'accepted')}>Accept Task</Button>
                  </>
                )}
                {task.status === 'accepted' && (
                  <Button className="w-full rounded-xl bg-green-600 hover:bg-green-700 shadow-green-100" onClick={() => handleStatusUpdate(task.id, 'completed')}>
                    Mark as Resolved
                  </Button>
                )}
                {task.status === 'completed' && (
                  <div className="w-full py-2 bg-green-50 text-green-700 rounded-xl flex items-center justify-center gap-2 text-sm font-bold border border-green-100">
                    <CheckCircle2 size={16} /> Impact Logged
                  </div>
                )}
              </div>
            </Card>
          ))}

          {tasks.length === 0 && (
            <div className="md:col-span-2">
              <Card className="p-20 text-center border-dashed bg-slate-50/50">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Briefcase size={32} />
                </div>
                <h3 className="text-slate-900 font-bold">No tasks assigned</h3>
                <p className="text-slate-500 text-sm">You are currently on standby. Check back later for new duties.</p>
              </Card>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}
