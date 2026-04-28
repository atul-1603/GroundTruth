import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import React from 'react'

export const LandingNavbar = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary-600">
          CivicPulse
        </Link>

        <div className="flex gap-4">
          <Link to="/ngo/login">
            <Button variant="secondary">NGO Login</Button>
          </Link>
          <Link to="/volunteer/login">
            <Button>Volunteer Login</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
