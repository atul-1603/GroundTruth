import React, { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { FileText, Image as ImageIcon, Search, Filter, Clock, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react'

import client from '../../api/client'
import { useAuthStore } from '../../store/useAuthStore'

export default function NGOReports() {
  const { user } = useAuthStore()
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) return
      try {
        const res = await client.get(`/api/report/ngo/${user.uid}`)
        setReports(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [user])

  const filteredReports = reports.filter(r => 
    (r.translatedSummary || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.extractedData?.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const convertToProject = async (report: any) => {

    try {
      await client.post(`/api/report/${report.reportId}/convert`, {
        title: `Task: ${report.extractedData.location}`,
        description: report.translatedSummary,
        region: report.extractedData.location,
        priorityScore: report.priorityScore,
        activityType: report.activityType
      })
      alert("Project created and AI notified!")
      window.location.reload()
    } catch (err) {
      alert("Failed to convert report")
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 font-outfit">Field Reports</h1>
        <p className="text-slate-500 mt-1">Review and manage all incoming data from field volunteers.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Search and Filters */}
        <Card className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search reports by summary or location..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={16} /> Filters
          </button>
        </Card>

        {/* Reports List */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading reports...</div>
          ) : filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <Card key={report.reportId} className="hover:border-primary-200 hover:shadow-md transition-all group">
                <div className="p-5 flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                    {report.rawInput.type === 'text' ? <FileText size={24} /> : <ImageIcon size={24} />}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-bold text-slate-900 line-clamp-1">{report.translatedSummary}</h3>
                      <Badge variant={report.priorityScore >= 8 ? 'danger' : report.priorityScore >= 5 ? 'warning' : 'success'}>
                        Score: {report.priorityScore}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {report.extractedData.location}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {new Date(report.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="flex-1 md:flex-none">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                       <p className="text-xs font-bold text-slate-700">{report.activityId ? 'Project Created' : 'Pending Review'}</p>
                    </div>
                    {!report.activityId && (
                      <button 
                        onClick={() => convertToProject(report)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-100"
                      >
                        Create Project
                      </button>
                    )}
                    {report.activityId && (
                      <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-20 text-center border-dashed bg-slate-50/50">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <FileText size={32} />
              </div>
              <h3 className="text-slate-900 font-bold">No reports found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your search or filters.</p>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

