import React from 'react';

export const NeuButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'danger' | 'default' }> = ({ 
  children, 
  className = '', 
  variant = 'default',
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-in-out transform active:scale-95 outline-none";
  
  const variants = {
    default: "bg-neu-base text-neu-text shadow-neu-btn active:shadow-neu-btn-active hover:text-neu-accent",
    primary: "bg-neu-base text-neu-accent shadow-neu-btn active:shadow-neu-btn-active border border-transparent hover:border-neu-accent/10",
    danger: "bg-neu-base text-red-500 shadow-neu-btn active:shadow-neu-btn-active hover:text-red-600",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const NeuInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => {
  return (
    <input 
      className={`w-full bg-neu-base text-neu-text px-4 py-3 rounded-xl shadow-neu-in outline-none focus:ring-2 focus:ring-neu-accent/20 transition-all ${className}`}
      {...props}
    />
  );
};

export const NeuCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`bg-neu-base rounded-2xl shadow-neu-out p-6 ${className}`}>
      {children}
    </div>
  );
};

export const NeuIconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }> = ({ 
  children, 
  className = '', 
  active = false,
  ...props 
}) => {
  return (
    <button 
      className={`p-3 rounded-full transition-all duration-300 outline-none ${
        active 
          ? 'bg-neu-base text-neu-accent shadow-neu-btn-active' 
          : 'bg-neu-base text-neu-text shadow-neu-btn hover:text-neu-accent'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};