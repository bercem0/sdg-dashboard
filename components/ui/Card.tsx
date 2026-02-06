/* React importeren voor componenten */
import React from 'react'
import Link from 'next/link'

/* Props interface voor Card component */
interface CardProps {
  children: React.ReactNode
  className?: string      // Extra CSS classes
  hover?: boolean         // Hover effect aan/uit
  href?: string           // Als kaart klikbaar is, link
}

/* Hoofd Card component */
export function Card({ children, className = '', hover = false, href }: CardProps) {
  /* Basis styling voor alle kaarten */
  const baseStyles = 'bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700'
  /* Extra styling als hover true is */
  const hoverStyles = hover ? 'transition-all hover:shadow-lg hover:scale-105' : ''
  /* Alles samenvoegen */
  const combinedStyles = `${baseStyles} ${hoverStyles} ${className}`

  /* Als href is opgegeven, render een Link */
  if (href) {
    return (
      <Link href={href} className={`${combinedStyles} block`}>
        {children}
      </Link>
    )
  }

  /* Anders render een gewone div */
  return <div className={combinedStyles}>{children}</div>
}

/* CardHeader component voor bovenkant van de kaart */
export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${className}`}>{children}</div>
}

/* CardContent component voor hoofdinhoud van de kaart */
export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 ${className}`}>{children}</div>
}

/* CardFooter component voor onderkant van de kaart */
export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 border-t border-gray-200 dark:border-gray-700 ${className}`}>{children}</div>
}