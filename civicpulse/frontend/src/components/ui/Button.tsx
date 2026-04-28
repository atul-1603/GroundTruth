import React from 'react'

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger', isLoading?: boolean }>(
  ({ className, variant = 'primary', isLoading, children, ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
    const variants = {
      primary: "bg-primary-600 text-white hover:bg-primary-700",
      secondary: "bg-dark-border text-white hover:bg-gray-700",
      danger: "bg-red-600 text-white hover:bg-red-700"
    }
    return (
      <button ref={ref} className={`${base} ${variants[variant]} ${className}`} disabled={isLoading || props.disabled} {...props}>
        {isLoading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"
