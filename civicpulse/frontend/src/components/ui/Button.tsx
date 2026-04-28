import React from 'react'

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'danger', 
  size?: 'sm' | 'md' | 'lg',
  isLoading?: boolean 
}>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 transition-all"
    
    const variants = {
      primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm",
      secondary: "bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 shadow-sm",
      danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm"
    }

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-6 text-base"
    }

    return (
      <button 
        ref={ref} 
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} 
        disabled={isLoading || props.disabled} 
        {...props}
      >
        {isLoading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"
