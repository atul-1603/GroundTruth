import React from 'react'

export const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm ${className}`}>
      {children}
    </div>

  )
}
