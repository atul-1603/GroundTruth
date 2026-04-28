import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import client from '../../api/client'
import { useAuthStore } from '../../store/useAuthStore'
import { Settings as SettingsIcon, Save } from 'lucide-react'

export default function NGOSettings() {
  const [ngoData, setNgoData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()

  useEffect(() => {
    const fetchNgo = async () => {
      if (!user) return
      try {
        const res = await client.get(`/api/ngo/${user.uid}`)
        setNgoData(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchNgo()
  }, [user])

  const handleSave = async () => {
    // Implement save logic
  }

  if (loading) return <DashboardLayout>Loading...</DashboardLayout>

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <SettingsIcon size={24} /> Organization Settings
      </h1>

      <div className="max-w-2xl">
        <Card className="p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">NGO Name</label>
              <Input value={ngoData?.name} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Office Address</label>
              <Input value={ngoData?.address} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Region</label>
                <Input value={ngoData?.region} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Organization Type</label>
                <Input value={ngoData?.type} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Email Domain Whitelist (Comma separated)</label>
              <Input value={ngoData?.websiteDomainEmails?.join(', ')} placeholder="e.g. ngo.org, volunteers.ngo.org" />
            </div>
            
            <div className="pt-4">
              <Button onClick={handleSave} className="w-full h-12 rounded-xl flex items-center justify-center gap-2">
                <Save size={18} /> Save Changes
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )

}
