import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { GoogleMapView } from '../../components/map/GoogleMapView'
import { Badge } from '../../components/ui/Badge'
import client from '../../api/client'
import { useAuthStore } from '../../store/useAuthStore'

export default function NGODashboard() {
  const [stats, setStats] = useState({ total_volunteers: 0, total_activities: 0, resolved_activities: 0 })
  const [mapData, setMapData] = useState([])
  const [priorityNeeds, setPriorityNeeds] = useState<any[]>([])
  const { user } = useAuthStore()

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user) return
      // We get NGO ID by finding it, or we assume it's attached.
      // For simplicity in this demo, let's just use user.uid since user registers as NGO.
      const ngoId = user.uid 
      try {
        const statsRes = await client.get(`/api/dashboard/${ngoId}/stats`)
        setStats(statsRes.data)
        const mapRes = await client.get(`/api/dashboard/${ngoId}/map-data`)
        setMapData(mapRes.data)
        const needsRes = await client.get(`/api/dashboard/${ngoId}/priority-needs`)
        setPriorityNeeds(needsRes.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchDashboard()
  }, [user])

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">NGO Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <h3 className="text-gray-400 text-sm font-medium">Total Volunteers</h3>
          <div className="text-3xl font-bold mt-2">{stats.total_volunteers}</div>
        </Card>
        <Card className="p-4">
          <h3 className="text-gray-400 text-sm font-medium">Active Projects</h3>
          <div className="text-3xl font-bold mt-2">{stats.total_activities - stats.resolved_activities}</div>
        </Card>
        <Card className="p-4">
          <h3 className="text-gray-400 text-sm font-medium">Issues Resolved</h3>
          <div className="text-3xl font-bold mt-2 text-green-400">{stats.resolved_activities}</div>
        </Card>
        <Card className="p-4">
          <h3 className="text-gray-400 text-sm font-medium">Avg Priority Score</h3>
          <div className="text-3xl font-bold mt-2 text-orange-400">7.2</div>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Live Activity Map</h2>
        <GoogleMapView activities={mapData} />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Priority Needs</h2>
        <Card className="overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-dark-bg">
              <tr>
                <th className="p-4 font-medium text-gray-400">Title</th>
                <th className="p-4 font-medium text-gray-400">Region</th>
                <th className="p-4 font-medium text-gray-400">Priority Score</th>
                <th className="p-4 font-medium text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {priorityNeeds.map(need => (
                <tr key={need.activityId}>
                  <td className="p-4">{need.title}</td>
                  <td className="p-4">{need.region}</td>
                  <td className="p-4">
                    <Badge variant={need.priorityScore >= 8 ? 'danger' : need.priorityScore >= 5 ? 'warning' : 'success'}>
                      {need.priorityScore}
                    </Badge>
                  </td>
                  <td className="p-4">{need.status}</td>
                </tr>
              ))}
              {priorityNeeds.length === 0 && (
                <tr><td colSpan={4} className="p-4 text-center text-gray-500">No active priority needs.</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </DashboardLayout>
  )
}
