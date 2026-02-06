/* React importeren voor componenten */
import React from 'react';

/* Props interface voor Button component */
/* Props = informatie die je aan de knop geeft, bv. tekst, grootte, kleur */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /* Variant = kleur / stijl van de knop: primary, secondary, outline, danger */
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  /* Size = grootte van de knop: sm, md, lg */
  size?: 'sm' | 'md' | 'lg';
  /* Children = tekst of inhoud in de knop */
  children: React.ReactNode;
}

/* Button component maken */
/* Dit is de knop die je kan gebruiken in de website */
export function Button({
  variant = 'primary', // standaard kleur is blauw (primary)
  size = 'md',         // standaard grootte is medium
  className = '',      // extra CSS klassen
  children,            // tekst in de knop
  ...props             // andere opties zoals onClick, disabled
}: ButtonProps) {
  /* Basis stijl voor alle knoppen */
  const baseStyles =
    'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  /* Variant specifieke stijlen voor kleur */
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline:
      'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  /* Size specifieke stijlen voor padding en tekst */
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  /* Render de knop met alle stijlen en props */
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children} {/* Tekst of inhoud in de knop */}
    </button>
  );
}
