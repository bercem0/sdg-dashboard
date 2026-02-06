import React from 'react'

// --- Props voor Select component ---
// Extend de standaard HTML select attributes (zoals onChange, value, etc.)
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string                     // Optioneel label boven de select
  error?: string                     // Foutmelding tekst
  options: Array<{ value: string | number; label: string }> // De opties in dropdown
}

// --- Select component ---
export function Select({ label, error, options, className = '', id, ...props }: SelectProps) {

  // --- ID bepalen ---
  // Als er geen id is meegegeven, maken we er eentje op basis van label
  const selectId = id || `select-${label?.toLowerCase().replace(/\s/g, '-')}`

  return (
    <div className="w-full"> {/* Container div, full width */}

      {/* Label tonen als aanwezig */}
      {label && (
        <label 
          htmlFor={selectId} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label} {/* Label tekst, bv. "Land kiezen" */}
        </label>
      )}

      {/* --- Select dropdown --- */}
      <select
        id={selectId} 
        className={`
          w-full px-3 py-2              // Breedte en padding
          border border-gray-300 dark:border-gray-600 // Rand kleuren
          rounded-lg                   // Ronde hoeken
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent // Focus styling
          disabled:opacity-50 disabled:cursor-not-allowed // Disabled styling
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 // Background + tekst kleur
          ${error ? 'border-red-500' : ''} // Rode rand als error
          ${className}                   // Extra styling als className meegegeven
        `}
        {...props} // Alle andere props zoals onChange, value, etc.
      >
        {/* --- Opties in dropdown --- */}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label} {/* Tekst die zichtbaar is in dropdown */}
          </option>
        ))}
      </select>

      {/* Foutmelding tonen als aanwezig */}
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}