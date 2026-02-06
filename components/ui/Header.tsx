'use client'

/* Link component van Next.js om naar andere pagina's te gaan */
import Link from 'next/link'

/* usePathname geeft het huidige pad (URL) */
import { usePathname } from 'next/navigation'

/* Knop component die we eerder hebben gemaakt */
import { Button } from './Button'

/* Props voor Header component: optioneel user object */
interface HeaderProps {
  user?: {
    name?: string | null
    email?: string | null
  } | null
}

/* Header component */
export function Header({ user }: HeaderProps) {

  /* Huidige pad van de URL */
  const pathname = usePathname()
  
  /* Functie om te checken of link actief is */
  const isActive = (path: string) => pathname === path

  return (
    /* Header element bovenaan de pagina */
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      
      {/* Navigatie container */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Flex container voor logo en menu items */}
        <div className="flex justify-between h-16 items-center">
          
          {/* Linkerkant: logo en navigatie links */}
          <div className="flex items-center gap-8">
            
            {/* Logo: link naar overzichtpagina */}
            <Link href="/overview" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              SDG Dashboard
            </Link>
            
            {/* Menu links: alleen zichtbaar op medium schermen en groter */}
            <div className="hidden md:flex gap-6">
              
              {/* Link naar Overzicht pagina */}
              <Link
                href="/overview"
                className={`text-sm font-medium transition-colors ${
                  isActive('/overview')
                    ? 'text-blue-600 dark:text-blue-400' /* Actieve link */
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400' /* Normale link */
                }`}
              >
                Overzicht
              </Link>

              {/* Link naar Contact pagina */}
              <Link
                href="/contact"
                className={`text-sm font-medium transition-colors ${
                  isActive('/contact')
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Contact
              </Link>

              {/* Link naar Support pagina */}
              <Link
                href="/support"
                className={`text-sm font-medium transition-colors ${
                  isActive('/support')
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Ondersteuning
              </Link>
            </div>
          </div>

          {/* Rechterkant: login / user info */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Toon user naam of email */}
                <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:inline">
                  {user.name || user.email}
                </span>

                {/* Formulier voor uitloggen */}
                <form action="/api/auth/signout" method="POST">
                  <Button type="submit" variant="outline" size="sm">
                    Uitloggen
                  </Button>
                </form>
              </>
            ) : (
              /* Als geen user: login knop tonen */
              <Link href="/login">
                <Button variant="primary" size="sm">
                  Inloggen
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}