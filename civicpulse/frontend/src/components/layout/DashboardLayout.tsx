import React from 'react'
import { Sidebar } from './Sidebar'

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex">

      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 overflow-y-auto w-full h-screen">
        {children}
      </main>
    </div>
  )
}
