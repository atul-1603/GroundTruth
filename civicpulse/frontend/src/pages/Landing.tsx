import React from 'react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Link } from 'react-router-dom'
import { Activity, Users, FileText } from 'lucide-react'
import { LandingNavbar } from '../components/layout/LandingNavbar'

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <LandingNavbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <Badge variant="success" className="mb-6 px-4 py-1 text-sm">Now Live in 500+ Cities</Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Connecting Communities <br className="hidden md:block"/> to <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">Care</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            AI-powered volunteer coordination for NGOs across India. Streamline field operations, prioritize needs with Gemini AI, and act faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/ngo/register">
              <Button className="w-full sm:w-auto h-12 px-8 text-lg">Register NGO</Button>
            </Link>
            <Link to="/ngo/login">
              <Button variant="secondary" className="w-full sm:w-auto h-12 px-8 text-lg">NGO Login</Button>
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 border-y border-dark-border bg-dark-card/50">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div><div className="text-4xl font-bold text-primary-400 mb-2">500+</div><div className="text-gray-400">NGOs</div></div>
          <div><div className="text-4xl font-bold text-primary-400 mb-2">12,000+</div><div className="text-gray-400">Volunteers</div></div>
          <div><div className="text-4xl font-bold text-primary-400 mb-2">89%</div><div className="text-gray-400">Resolution Rate</div></div>
          <div><div className="text-4xl font-bold text-primary-400 mb-2">24/7</div><div className="text-gray-400">AI Processing</div></div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-400">
                <FileText size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">1. NGOs Report Needs</h3>
              <p className="text-gray-400">Volunteers submit multi-modal reports (text, image, audio) directly from the field.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-400">
                <Activity size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">2. AI Prioritizes</h3>
              <p className="text-gray-400">Gemini AI extracts structured data, detects urgency, and assigns priority scores instantly.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-400">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Volunteers Act</h3>
              <p className="text-gray-400">Smart routing on live maps guides volunteers to high-priority areas efficiently.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
