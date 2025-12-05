import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const sizeStyles = "h-12 px-6 py-2";
  
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-500/30 focus:ring-brand-500",
    secondary: "bg-white text-brand-900 hover:bg-slate-50 shadow-md focus:ring-brand-200",
    outline: "border-2 border-brand-200 text-brand-900 hover:border-brand-500 hover:bg-brand-50 focus:ring-brand-500",
    ghost: "text-brand-700 hover:bg-brand-50 hover:text-brand-900",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
      {children}
    </button>
  );
};