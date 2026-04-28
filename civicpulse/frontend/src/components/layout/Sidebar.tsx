import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { LogOut, Home, Users, Briefcase, Settings } from 'lucide-react'
import React from 'react'

export const Sidebar = () => {
  const { role, logout } = useAuthStore()
  const location = useLocation()
  
  const ngoLinks = [
    { icon: Home, label: 'Dashboard', path: '/ngo/dashboard' },
    { icon: Briefcase, label: 'Projects', path: '/ngo/projects' },
    { icon: Users, label: 'Volunteers', path: '/ngo/volunteers' },
    { icon: Settings, label: 'Settings', path: '/ngo/settings' },
  ]
  
  const volLinks = [
    { icon: Home, label: 'Dashboard', path: '/volunteer/dashboard' },
    { icon: Briefcase, label: 'My Tasks', path: '/volunteer/tasks' },
  ]

  const links = role === 'ngo' ? ngoLinks : volLinks

  return (
    <aside className="w-64 border-r border-dark-border bg-dark-card hidden md:flex flex-col h-screen fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-dark-border">
        <span className="text-xl font-bold text-primary-500">CivicPulse</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const active = location.pathname.startsWith(link.path)
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${active ? 'bg-primary-500/10 text-primary-400' : 'text-gray-400 hover:text-white hover:bg-dark-border'}`}
            >
              <link.icon size={20} />
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-dark-border">
        <button onClick={() => { logout(); window.location.href='/' }} className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-red-400 w-full rounded-md transition-colors">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  )
}
