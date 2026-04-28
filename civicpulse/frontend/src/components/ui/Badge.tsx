import React from 'react'

export const Badge = ({ children, className, variant = 'default' }: { children: React.ReactNode, className?: string, variant?: 'default' | 'success' | 'warning' | 'danger' }) => {
  const variants = {
    default: "bg-gray-800 text-gray-100",
    success: "bg-green-900/50 text-green-300 border border-green-800",
    warning: "bg-yellow-900/50 text-yellow-300 border border-yellow-800",
    danger: "bg-red-900/50 text-red-300 border border-red-800"
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
