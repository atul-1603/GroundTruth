import React from 'react'

export const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`rounded-xl border border-dark-border bg-dark-card text-white shadow-sm ${className}`}>
      {children}
    </div>
  )
}
