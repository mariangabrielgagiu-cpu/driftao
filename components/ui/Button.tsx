import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#E17E8D] hover:bg-[#d66d7d] text-black focus:ring-[#E17E8D]",
    secondary: "bg-white text-black hover:bg-gray-100 focus:ring-gray-200",
    outline: "border border-zinc-700 text-zinc-300 hover:bg-zinc-800 focus:ring-zinc-700",
    ghost: "text-zinc-400 hover:text-white hover:bg-white/10"
  };

  const sizes = "px-6 py-3 text-base";
  const width = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes} ${width} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};