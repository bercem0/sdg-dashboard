import React from 'react'

// --- Props type voor Input component ---
// label = tekst boven het input veld
// extends React.InputHTMLAttributes = alle standaard HTML input props
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

// --- Input component ---
export function Input({ label, error, className = '', id, ...props }: InputProps) {
  // Als er geen id is, maak er één op basis van label
  const inputId = id || `input-${label?.toLowerCase().replace(/\s/g, '-')}`

  return (
    <div className="w-full">
      {/* Label boven het input veld, als label is meegegeven */}
      {label && (
        <label
          htmlFor={inputId} // verbind label met input
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}

      {/* Input veld zelf */}
      <input
        id={inputId} // id zodat label erbij hoort
        className={`
          w-full px-3 py-2 border rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed 
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
          ${error ? 'border-red-500' : ''}  // rood als error
          ${className}  // extra styling als je className meegeeft
        `}
        {...props} // alle andere props doorgeven, bv placeholder, type, value, onChange
      />

      {/* Foutmelding onder input, als error bestaat */}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}