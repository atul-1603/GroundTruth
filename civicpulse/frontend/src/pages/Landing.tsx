import React from 'react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Link } from 'react-router-dom'
import { Heart, Shield, Globe, ArrowRight, CheckCircle2 } from 'lucide-react'
import { LandingNavbar } from '../components/layout/LandingNavbar'

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <Badge variant="success" className="mb-6 px-4 py-1 text-sm bg-ngo-warm text-ngo-accent border-ngo-accent/20">
              Empowering 1000+ Verified NGOs
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-slate-900">
              Technology for <span className="text-primary-600">Social Good</span>.
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-xl">
              CivicPulse provides AI-driven coordination tools for non-profits to manage volunteers, prioritize community needs, and track impact in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/ngo/register">
                <Button className="h-12 px-8 text-lg rounded-full">Get Started for Free</Button>
              </Link>
              <Link to="/volunteer/login">
                <Button variant="secondary" className="h-12 px-8 text-lg rounded-full border-primary-200">Volunteer Login</Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="/home/atuld_1603/.gemini/antigravity/brain/789cf365-0af4-4652-87cc-cb0a61f61cf9/ngo_hero_community_1777372107509.png" 
                alt="Volunteers in action" 
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-ngo-warm rounded-full flex items-center justify-center text-ngo-accent">
                  <Heart size={20} fill="currentColor" />
                </div>
                <div>
                  <div className="text-sm font-bold">Priority Care</div>
                  <div className="text-xs text-slate-500">AI-driven task assignment</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-50/50 -skew-x-12 translate-x-1/4 pointer-events-none" />
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-slate-600 text-lg">
              We believe technology should serve the most vulnerable. CivicPulse was built to bridge the gap between community needs and volunteer resources.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Shield className="text-primary-600" />, title: "Trusted Platform", desc: "Every NGO is verified through a rigorous process to ensure genuine social impact." },
              { icon: <Globe className="text-primary-600" />, title: "Community First", desc: "Built with a bottom-up approach, focusing on local field coordination and reporting." },
              { icon: <CheckCircle2 className="text-primary-600" />, title: "Data Driven", desc: "Leverage Gemini AI to turn unstructured field reports into actionable insights." }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100">
                <div className="mb-6">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <img 
              src="/home/atuld_1603/.gemini/antigravity/brain/789cf365-0af4-4652-87cc-cb0a61f61cf9/ngo_coordination_map_1777391228756.png" 
              alt="Live coordination map" 
              className="rounded-3xl shadow-xl"
            />

          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold mb-6 leading-tight">
              Real-time Field Coordination <br/> with Smart Maps
            </h2>
            <ul className="space-y-6">
              {[
                "Visualize community needs on a live, interactive map.",
                "Assign volunteers based on proximity and skill set.",
                "Track task completion and resolution rates in real-time.",
                "Identify high-priority zones using AI-powered heatmaps."
              ].map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <CheckCircle2 className="text-ngo-success mt-1" size={20} />
                  <span className="text-slate-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Link to="/ngo/register">
                <Button className="gap-2 rounded-full">
                  Learn More <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-primary-900 text-white text-center px-4">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to amplify your impact?</h2>
          <p className="text-primary-100 mb-10 text-lg">
            Join hundreds of NGOs across the country using CivicPulse to build stronger communities.
          </p>
          <Link to="/ngo/register">
            <Button className="h-14 px-10 text-lg bg-white text-primary-900 hover:bg-primary-50 rounded-full border-none">
              Register Your Organization
            </Button>
          </Link>
        </div>
      </section>
      
      <footer className="py-10 bg-slate-900 text-slate-400 text-center text-sm border-t border-slate-800">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} CivicPulse. All rights reserved. Technology for Community Welfare.
        </div>
      </footer>
    </div>
  )
}

