import React, { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/ui/Badge'
import * as Tabs from '@radix-ui/react-tabs'
import client from '../../api/client'
import { useAuthStore } from '../../store/useAuthStore'
import { FileText, Image as ImageIcon, Mic, CheckCircle2, Loader2, Send, Clock, UserCheck, Award } from 'lucide-react'

import { motion, AnimatePresence } from 'framer-motion'


export default function VolunteerDashboard() {
  const { user } = useAuthStore()
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [textReport, setTextReport] = useState("")
  const [submittingStatus, setSubmittingStatus] = useState<'idle' | 'submitting' | 'analyzing' | 'success'>('idle')
  const [myReports, setMyReports] = useState<any[]>([])
  const [assignedTasks, setAssignedTasks] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)

  const fetchMyData = async () => {
    if (!user) return
    try {
      const profileRes = await client.get(`/api/volunteer/${user.uid}`)
      setProfile(profileRes.data)
      
      const res = await client.get(`/api/activity/volunteer/${user.uid}`)
      setAssignedTasks(res.data)
      const reportsRes = await client.get(`/api/report/user/${user.uid}`)
      setMyReports(reportsRes.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchMyData()
    const interval = setInterval(fetchMyData, 10000) 
    return () => clearInterval(interval)
  }, [user])

  const handleStatusUpdate = async (assignmentId: string, status: 'accepted' | 'rejected') => {
    try {
      await client.put(`/api/activity/assignment/${assignmentId}`, { status })
      fetchMyData()
    } catch (err) {
      alert('Failed to update status')
    }
  }

  const submitTextReport = async () => {
    if (!profile?.ngoId) {
      alert("Account error: No linked NGO found")
      return
    }
    setSubmittingStatus('submitting')
    try {
      setTimeout(() => setSubmittingStatus('analyzing'), 1000)
      
      const res = await client.post('/api/report/text', {
        text: textReport,
        activityType: "SURVEY",
        ngoId: profile.ngoId
      })
      
      setTimeout(() => {
        setSubmittingStatus('success')
        setTimeout(() => {
          setReportModalOpen(false)
          setSubmittingStatus('idle')
          setTextReport("")
          fetchMyData()
        }, 2000)
      }, 1500)
    } catch(err) {
      console.error(err)
      setSubmittingStatus('idle')
      alert('Report submission failed. Please try again.')
    }
  }


  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome, {user?.displayName || 'Volunteer'}</h1>
          <p className="text-slate-500">Track your impact and stay updated on assigned tasks.</p>
        </div>
        <Button 
          onClick={() => setReportModalOpen(true)} 
          className="rounded-full h-12 px-6 shadow-lg shadow-primary-200 gap-2"
        >
          <Send size={18} /> Submit Field Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Assigned Tasks */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary-500 rounded-full"></span>
              Assigned Tasks
            </h2>
            <div className="space-y-4">
              {assignedTasks.map(task => (
                <Card key={task.id} className="p-5 border-l-4 border-l-primary-500">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-slate-900">{task.title}</h3>
                    <Badge variant={task.priorityScore >= 8 ? 'danger' : 'warning'}>Priority {task.priorityScore}</Badge>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={14} /> Assigned {new Date(task.assignedAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      {task.status === 'pending' ? (
                        <>
                          <Button size="sm" variant="secondary" onClick={() => handleStatusUpdate(task.id, 'rejected')}>Reject</Button>
                          <Button size="sm" onClick={() => handleStatusUpdate(task.id, 'accepted')}>Accept Task</Button>
                        </>
                      ) : (
                        <Badge variant="success" className="capitalize">{task.status}</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              {assignedTasks.length === 0 && (
                <Card className="p-12 text-center bg-slate-50/50 border-dashed">
                  <p className="text-slate-400 font-medium">No new tasks assigned yet.</p>
                </Card>
              )}
            </div>
          </section>

          {/* My Submitted Reports */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-ngo-accent rounded-full"></span>
              Recent Reports
            </h2>
            <Card className="overflow-hidden border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-4 font-semibold text-slate-600 uppercase text-[10px]">Type</th>
                    <th className="p-4 font-semibold text-slate-600 uppercase text-[10px]">Summary</th>
                    <th className="p-4 font-semibold text-slate-600 uppercase text-[10px]">AI Score</th>
                    <th className="p-4 font-semibold text-slate-600 uppercase text-[10px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myReports.map(report => (
                    <tr key={report.reportId} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {report.rawInput.type === 'text' ? <FileText size={14} className="text-blue-500"/> : <ImageIcon size={14} className="text-purple-500"/>}
                          <span className="capitalize font-medium">{report.rawInput.type}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 max-w-xs truncate">{report.translatedSummary}</td>
                      <td className="p-4">
                        <Badge variant={report.priorityScore >= 8 ? 'danger' : 'success'}>{report.priorityScore}</Badge>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <UserCheck size={14} className="text-ngo-success" />
                          {report.assignedTo ? 'Assigned' : 'Reviewing'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {myReports.length === 0 && (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-400">You haven't submitted any reports yet.</td></tr>
                  )}
                </tbody>
              </table>
            </Card>
          </section>
        </div>

        <div className="space-y-8">
          {/* Quick Stats */}
          <Card className="p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl group-hover:bg-primary-500/20 transition-all"></div>
            <h3 className="text-primary-300 text-[10px] font-bold uppercase mb-6 tracking-widest flex items-center gap-2">
              <Award size={14} /> Your Civic Wallet
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 flex items-center justify-center border border-amber-400/30">
                  <motion.div
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <span className="text-2xl">🪙</span>
                  </motion.div>
                </div>
                <div>
                  <div className="text-3xl font-black text-amber-400">{(myReports.length * 10) + (assignedTasks.filter(t => t.status === 'completed').length * 50)}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Civic Coins</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <div className="text-xl font-bold text-white">{myReports.length}</div>
                  <div className="text-[10px] text-slate-400">Field Reports</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">{assignedTasks.filter(t => t.status === 'completed').length}</div>
                  <div className="text-[10px] text-slate-400">Tasks Resolved</div>
                </div>
              </div>
            </div>
          </Card>


          {/* Guidelines */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-slate-900">Submission Tips</h2>
            <Card className="p-4 space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex-shrink-0 flex items-center justify-center text-green-600 font-bold text-xs">01</div>
                <p className="text-xs text-slate-600 leading-relaxed">Be specific about the location and number of people affected.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 font-bold text-xs">02</div>
                <p className="text-xs text-slate-600 leading-relaxed">Images should be clear and show the immediate need or hazard.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Modal open={reportModalOpen} onOpenChange={setReportModalOpen} title="Submit Field Report">
        {submittingStatus === 'idle' ? (
          <Tabs.Root defaultValue="text" className="mt-4">
            <Tabs.List className="flex border-b border-slate-200 mb-6">
              <Tabs.Trigger value="text" className="px-6 py-3 text-sm font-medium text-slate-400 data-[state=active]:text-primary-600 data-[state=active]:border-b-2 data-[state=active]:border-primary-600 flex items-center gap-2"><FileText size={16}/> Text</Tabs.Trigger>
              <Tabs.Trigger value="image" className="px-6 py-3 text-sm font-medium text-slate-400 data-[state=active]:text-primary-600 data-[state=active]:border-b-2 data-[state=active]:border-primary-600 flex items-center gap-2"><ImageIcon size={16}/> Image</Tabs.Trigger>
              <Tabs.Trigger value="audio" className="px-6 py-3 text-sm font-medium text-slate-400 data-[state=active]:text-primary-600 data-[state=active]:border-b-2 data-[state=active]:border-primary-600 flex items-center gap-2"><Mic size={16}/> Audio</Tabs.Trigger>
            </Tabs.List>
            
            <Tabs.Content value="text" className="space-y-4">
              <textarea 
                className="w-full h-40 bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                placeholder="Describe the situation in detail... Example: 'Found 20 people needing food at Sector 5 underpass.'"
                value={textReport}
                onChange={(e) => setTextReport(e.target.value)}
              />
              <Button onClick={submitTextReport} className="w-full h-12 rounded-xl">Submit Text Report</Button>
            </Tabs.Content>
            
            <Tabs.Content value="image" className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:bg-slate-50 transition-colors group cursor-pointer">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:text-primary-500 transition-colors">
                  <ImageIcon size={24} />
                </div>
                <p className="text-sm text-slate-500 font-medium">Click to upload or drag & drop</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
              </div>
              <Button className="w-full h-12 rounded-xl" disabled>Select Image</Button>
            </Tabs.Content>
            
            <Tabs.Content value="audio" className="space-y-4 text-center">
               <div className="py-12 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Mic size={32} />
                </div>
                <p className="font-bold text-slate-900">Recording Audio...</p>
                <p className="text-xs text-slate-500 mt-1">Speak clearly into your microphone</p>
               </div>
               <Button variant="danger" className="w-full h-12 rounded-xl">Stop & Transcribe</Button>
            </Tabs.Content>
          </Tabs.Root>
        ) : (

          <AnimatePresence mode="wait">

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="py-20 flex flex-col items-center text-center px-6"
            >
              {submittingStatus === 'submitting' && (
                <motion.div 
                  key="submitting"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-primary-100 rounded-full" />
                    <motion.div 
                      className="absolute top-0 left-0 w-24 h-24 border-4 border-primary-500 rounded-full border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Send size={24} className="text-primary-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Sending Report...</h3>
                    <p className="text-slate-500 max-w-xs mx-auto">We are securely transmitting your field data to the coordination hub.</p>
                  </div>
                </motion.div>
              )}

              {submittingStatus === 'analyzing' && (
                <motion.div 
                  key="analyzing"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex gap-2 justify-center mb-4">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-4 h-4 bg-ngo-accent rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Gemini AI Analyzing...</h3>
                    <p className="text-slate-500 max-w-xs mx-auto">Extracting critical needs and calculating urgency scores using state-of-the-art AI.</p>
                  </div>
                </motion.div>
              )}

              {submittingStatus === 'success' && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <motion.div 
                    className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-100"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle2 size={48} />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Report Successfully Filed!</h3>
                    <p className="text-slate-500 mb-6">Your data has been prioritized. An NGO project has been automatically created.</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-bold">
                      Impact Point +10 Awarded
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

      </Modal>

    </DashboardLayout>
  )
}

