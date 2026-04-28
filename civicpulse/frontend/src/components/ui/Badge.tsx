import React from 'react'

export const Badge = ({ children, className, variant = 'default' }: { children: React.ReactNode, className?: string, variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' }) => {
  const variants = {
    default: "bg-slate-100 text-slate-800",
    primary: "bg-primary-100 text-primary-700 border border-primary-200",
    success: "bg-green-100 text-green-700 border border-green-200",
    warning: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    danger: "bg-red-100 text-red-700 border border-red-200"
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
