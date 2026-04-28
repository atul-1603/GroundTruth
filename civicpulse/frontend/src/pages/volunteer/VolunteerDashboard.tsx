import React, { useState } from 'react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import * as Tabs from '@radix-ui/react-tabs'
import client from '../../api/client'
import { useAuthStore } from '../../store/useAuthStore'

export default function VolunteerDashboard() {
  const { user } = useAuthStore()
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [textReport, setTextReport] = useState("")

  const submitTextReport = async () => {
    try {
      await client.post('/api/report/text', {
        text: textReport,
        activityType: "SURVEY",
        activityId: "mock-activity", // in real app, select activity
        ngoId: "mock-ngo"
      })
      setReportModalOpen(false)
    } catch(err) {
      console.error(err)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Volunteer Dashboard</h1>
        <Button onClick={() => setReportModalOpen(true)}>Submit Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-2">My Tasks</h2>
          <p className="text-gray-400">You have no pending tasks today.</p>
        </Card>
      </div>

      <Modal open={reportModalOpen} onOpenChange={setReportModalOpen} title="Submit Field Report">
        <Tabs.Root defaultValue="text" className="mt-4">
          <Tabs.List className="flex border-b border-dark-border mb-4">
            <Tabs.Trigger value="text" className="px-4 py-2 text-gray-400 data-[state=active]:text-primary-500 data-[state=active]:border-b-2 data-[state=active]:border-primary-500">Text</Tabs.Trigger>
            <Tabs.Trigger value="image" className="px-4 py-2 text-gray-400 data-[state=active]:text-primary-500 data-[state=active]:border-b-2 data-[state=active]:border-primary-500">Image</Tabs.Trigger>
            <Tabs.Trigger value="audio" className="px-4 py-2 text-gray-400 data-[state=active]:text-primary-500 data-[state=active]:border-b-2 data-[state=active]:border-primary-500">Audio</Tabs.Trigger>
          </Tabs.List>
          
          <Tabs.Content value="text" className="space-y-4">
            <textarea 
              className="w-full h-32 bg-dark-bg border border-dark-border rounded-md p-3 text-white focus:outline-none focus:border-primary-500"
              placeholder="Describe the situation in the field..."
              value={textReport}
              onChange={(e) => setTextReport(e.target.value)}
            />
            <Button onClick={submitTextReport} className="w-full">Submit Text Report</Button>
          </Tabs.Content>
          <Tabs.Content value="image">
            <div className="border-2 border-dashed border-dark-border rounded-lg p-8 text-center text-gray-400">
              <p>Drag and drop image here or click to upload</p>
              <Input type="file" accept="image/*" className="mt-4" />
            </div>
            <Button className="w-full mt-4">Upload Image Report</Button>
          </Tabs.Content>
          <Tabs.Content value="audio">
            <div className="flex flex-col items-center p-8 bg-dark-bg rounded-lg border border-dark-border">
              <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4 cursor-pointer hover:bg-red-500/30">
                <span className="block w-4 h-4 bg-red-500 rounded-full"></span>
              </div>
              <p className="text-gray-400">Click to start recording</p>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </Modal>

    </DashboardLayout>
  )
}
