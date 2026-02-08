import React from 'react';

export const NeuButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'danger' | 'default' }> = ({ 
  children, 
  className = '', 
  variant = 'default',
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-in-out transform active:scale-95 outline-none relative overflow-hidden group";
  
  const variants = {
    default: "bg-neu-base text-neu-text shadow-neu-btn active:shadow-neu-btn-active hover:text-white before:absolute before:content-[''] before:top-full before:left-0 before:w-full before:h-full before:bg-neu-accent before:transition-all before:duration-500 before:ease-in-out hover:before:top-0",
    primary: "bg-neu-base text-neu-accent shadow-neu-btn active:shadow-neu-btn-active border border-transparent hover:border-neu-accent/10 hover:text-white before:absolute before:content-[''] before:top-full before:left-0 before:w-full before:h-full before:bg-neu-accent before:transition-all before:duration-500 before:ease-in-out hover:before:top-0",
    danger: "bg-neu-base text-red-500 shadow-neu-btn active:shadow-neu-btn-active hover:text-white before:absolute before:content-[''] before:top-full before:left-0 before:w-full before:h-full before:bg-red-600 before:transition-all before:duration-500 before:ease-in-out hover:before:top-0",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      <span className="relative z-10 transition-colors duration-300">{children}</span>
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