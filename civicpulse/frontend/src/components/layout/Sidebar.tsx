import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { LogOut, Home, Users, Briefcase, Settings, FileText, LayoutDashboard } from 'lucide-react'
import React from 'react'

export const Sidebar = () => {
  const { role, logout } = useAuthStore()
  const location = useLocation()
  
  const ngoLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/ngo/dashboard' },
    { icon: Briefcase, label: 'Projects', path: '/ngo/projects' },
    { icon: Users, label: 'Volunteers', path: '/ngo/volunteers' },
    { icon: FileText, label: 'Field Reports', path: '/ngo/reports' },
    { icon: Settings, label: 'Settings', path: '/ngo/settings' },
  ]
  
  const volLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/volunteer/dashboard' },
    { icon: Briefcase, label: 'My Tasks', path: '/volunteer/tasks' },
  ]


  const links = role === 'ngo' ? ngoLinks : volLinks

  return (
    <aside className="w-64 border-r border-slate-200 bg-white hidden md:flex flex-col h-screen fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <span className="text-xl font-bold text-primary-600">CivicPulse</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const active = location.pathname.startsWith(link.path)
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${active ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              <link.icon size={20} />
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-slate-100">
        <Link to={`/${role}/profile`}>
          <div className="flex items-center gap-3 px-3 py-4 mb-2 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border border-primary-200 group-hover:scale-105 transition-transform">
              {role === 'ngo' ? 'N' : 'V'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate capitalize">{role} Account</p>
              <p className="text-[10px] text-slate-500 truncate hover:text-primary-600">View Profile</p>
            </div>
          </div>
        </Link>
        <button onClick={() => { logout(); window.location.href='/' }} className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 w-full rounded-lg transition-all group">
          <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>

    </aside>


  )
}
