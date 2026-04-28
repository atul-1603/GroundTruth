import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'

import { Card } from '../../components/ui/Card'
import { GoogleMapView } from '../../components/map/GoogleMapView'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import client from '../../api/client'

import { useAuthStore } from '../../store/useAuthStore'
import { FileText, Image as ImageIcon, ShieldCheck, User, AlertCircle, Briefcase, MapPin, ChevronRight } from 'lucide-react'



export default function NGODashboard() {
  const [stats, setStats] = useState({ total_volunteers: 0, total_activities: 0, resolved_activities: 0 })
  const [mapData, setMapData] = useState([])
  const [priorityNeeds, setPriorityNeeds] = useState<any[]>([])
  const [ngo, setNgo] = useState<any>(null)
  const { user } = useAuthStore()

  const [recentReports, setRecentReports] = useState<any[]>([])

  const fetchDashboard = async () => {
    if (!user) return
    const ngoId = user.uid 
    try {
      const ngoRes = await client.get(`/api/ngo/${ngoId}`)
      setNgo(ngoRes.data)
      
      const statsRes = await client.get(`/api/dashboard/${ngoId}/stats`)
      setStats(statsRes.data)
      const mapRes = await client.get(`/api/dashboard/${ngoId}/map-data`)
      setMapData(mapRes.data)
      const needsRes = await client.get(`/api/dashboard/${ngoId}/priority-needs`)
      setPriorityNeeds(needsRes.data)
      
      const reportsRes = await client.get(`/api/report/ngo/${ngoId}`)
      setRecentReports(reportsRes.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [user])

  const handleDispatch = async (activityId: string) => {
    try {
      await client.post(`/api/activity/${activityId}/dispatch`)
      alert('Activity dispatched to all volunteers!')
      fetchDashboard()
    } catch (err) {
      alert('Dispatch failed')
    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">NGO Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 border-l-4 border-l-primary-500">
          <h3 className="text-slate-500 text-sm font-medium">Total Volunteers</h3>
          <div className="text-3xl font-bold mt-2 text-slate-900">{stats.total_volunteers}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-primary-400">
          <h3 className="text-slate-500 text-sm font-medium">Active Projects</h3>
          <div className="text-3xl font-bold mt-2 text-slate-900">{stats.total_activities - stats.resolved_activities}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-ngo-success">
          <h3 className="text-slate-500 text-sm font-medium">Issues Resolved</h3>
          <div className="text-3xl font-bold mt-2 text-ngo-success">{stats.resolved_activities}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-ngo-accent">
          <h3 className="text-slate-500 text-sm font-medium">Avg Priority Score</h3>
          <div className="text-3xl font-bold mt-2 text-ngo-accent">7.2</div>
        </Card>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Critical Alerts / High Priority Reports */}
          {recentReports.filter(r => r.priorityScore >= 8).length > 0 && (
            <section className="bg-red-50/50 border border-red-100 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-red-900 font-outfit">
                  <AlertCircle className="text-red-600 animate-pulse" size={24} />
                  Critical Field Alerts
                </h2>
                <Badge variant="danger" className="animate-bounce">Action Required</Badge>
              </div>
              <div className="space-y-4">
                {recentReports.filter(r => r.priorityScore >= 8).slice(0, 3).map(report => (
                  <div key={report.reportId} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-red-100 shadow-sm hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 font-bold shrink-0">
                      {report.priorityScore}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{report.translatedSummary}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin size={10} /> {report.extractedData.location} • {new Date(report.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <Link to="/ngo/reports">
                      <Button size="sm" variant="danger" className="rounded-xl px-4 py-1.5 h-auto text-[10px] font-bold">Details</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div>

            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900">
              <span className="w-1.5 h-6 bg-primary-500 rounded-full"></span>
              Live Activity Map
            </h2>
            <GoogleMapView activities={mapData} ngo={ngo} height="400px" />
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900">
              <span className="w-1.5 h-6 bg-ngo-accent rounded-full"></span>
              Priority Needs
            </h2>
            <Card className="overflow-hidden border border-slate-200 shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-4 font-semibold text-slate-600 uppercase tracking-wider text-[10px]">Title</th>
                    <th className="p-4 font-semibold text-slate-600 uppercase tracking-wider text-[10px]">Region</th>
                    <th className="p-4 font-semibold text-slate-600 uppercase tracking-wider text-[10px]">Priority</th>
                    <th className="p-4 font-semibold text-slate-600 uppercase tracking-wider text-[10px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {priorityNeeds.map(need => (
                    <tr key={need.activityId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-medium text-slate-900">{need.title}</td>
                      <td className="p-4 text-slate-600">{need.region}</td>
                      <td className="p-4">
                        <Badge variant={need.priorityScore >= 8 ? 'danger' : need.priorityScore >= 5 ? 'warning' : 'success'}>
                          {need.priorityScore}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button size="sm" onClick={() => handleDispatch(need.activityId)}>Dispatch All</Button>
                      </td>
                    </tr>
                  ))}
                  {priorityNeeds.length === 0 && (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-400 font-medium">No active priority needs.</td></tr>
                  )}
                </tbody>
              </table>
            </Card>
          </div>


          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
              Recent Volunteer Reports
            </h2>
            <Card className="p-4 space-y-4 max-h-[300px] overflow-y-auto border border-slate-200 shadow-sm bg-white">
              {recentReports.map(report => (
                <div key={report.reportId} className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${report.rawInput.type === 'text' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'}`}>
                    {report.rawInput.type === 'text' ? <FileText size={18}/> : <ImageIcon size={18}/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 text-sm">#{report.reportId.slice(-4)}</span>
                      <Badge variant={report.priorityScore >= 8 ? 'danger' : 'success'}>Score {report.priorityScore}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1 group-hover:line-clamp-none transition-all">{report.translatedSummary}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 bg-slate-100 rounded-full">{report.extractedData.location}</span>
                      <span className="text-[10px] text-slate-400">{new Date(report.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))}
              {recentReports.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                    <FileText size={24} />
                  </div>
                  <p className="text-slate-400 text-sm font-medium">No reports submitted yet.</p>
                </div>
              )}
            </Card>
          </div>
        </div>



        <div className="space-y-8">
          <Card className="p-6 bg-slate-900 text-white rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck size={80} />
            </div>
            <h3 className="text-primary-400 text-[10px] font-bold uppercase tracking-widest mb-4">Organization Impact</h3>
            <div className="space-y-4 relative z-10">
              <div>
                <div className="text-4xl font-black text-white">1,240</div>
                <p className="text-[10px] text-slate-400 font-medium">Lives Impacted this Month</p>
              </div>
              <div className="flex items-center gap-2 text-ngo-success text-xs font-bold">
                <span className="flex h-2 w-2 rounded-full bg-ngo-success animate-ping"></span>
                +12% from last week
              </div>
            </div>
          </Card>

          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900">
              <span className="w-1.5 h-6 bg-primary-500 rounded-full"></span>
              Live Coordination Feed
            </h2>
            <Card className="p-0 overflow-hidden border border-slate-200 shadow-sm">
              <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-100">
                {recentReports.slice(0, 5).map((report, i) => (
                  <div key={i} className="p-4 flex gap-3 items-start hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                      <User size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-900"><span className="font-bold">Volunteer</span> submitted a new <span className="font-bold capitalize">{report.rawInput.type}</span> report.</p>
                      <p className="text-[10px] text-slate-500 mt-1">{new Date(report.createdAt).toLocaleTimeString()} • {report.extractedData.location}</p>
                    </div>
                  </div>
                ))}
                {priorityNeeds.slice(0, 3).map((need, i) => (
                  <div key={`need-${i}`} className="p-4 flex gap-3 items-start hover:bg-slate-50 transition-colors bg-amber-50/30">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                      <Briefcase size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-900">New high-priority project <span className="font-bold">"{need.title}"</span> created.</p>
                      <p className="text-[10px] text-slate-500 mt-1">Automatic Dispatch pending</p>
                    </div>
                  </div>
                ))}
                {recentReports.length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-xs">Waiting for live activity...</div>
                )}
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                <button className="text-[10px] font-bold text-primary-600 hover:text-primary-700 uppercase tracking-widest">View Full Audit Log</button>
              </div>
            </Card>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 text-slate-900">Quick Actions</h2>
            <Card className="p-4 space-y-3">
              <Link to="/ngo/projects">
                <button className="w-full text-left px-4 py-3 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors font-medium flex items-center justify-between group">
                  Add New Project
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>
              </Link>
              <Link to="/ngo/volunteers">
                <button className="w-full text-left px-4 py-3 rounded-xl bg-ngo-warm text-ngo-accent hover:bg-amber-100 transition-colors font-medium flex items-center justify-between group">
                  Invite Volunteers
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>
              </Link>
            </Card>
          </div>
        </div>

      </div>

    </DashboardLayout>
  )
}
