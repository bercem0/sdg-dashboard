'use client';

import { useState } from 'react';

// --- Component ContactTwoStep ---
// Dit is een contactformulier in twee stappen:
// 1. Hero scherm met afbeelding en knop
// 2. Formulier scherm
export default function ContactTwoStep() {
  // --- State variabelen ---
  const [showForm, setShowForm] = useState(false); // true = laat formulier zien
  const [submitted, setSubmitted] = useState(false); // true = formulier verstuurd
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // --- Functie als formulier wordt verstuurd ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // voorkom pagina refresh
    console.log('Contactformulier verzonden:', formData); // log data in console
    setSubmitted(true); // laat succesmelding zien

    // Reset na 3 seconden
    setTimeout(() => {
      setSubmitted(false); // verwijder succesmelding
      setFormData({ name: '', email: '', message: '' }); // leeg formulier
    }, 3000);
  };

  return (
    <div className="min-h-screen relative">

      {/* --- FASE 1: HERO --- */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          showForm ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Achtergrond afbeelding */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/contact.webp')` }}
        />
        {/* Zwarte overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Inhoud hero */}
        <div className="relative z-10 min-h-screen flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center text-center text-white px-6">
            {/* Titel en tekst */}
            <h1 className="text-5xl md:text-6xl font-light tracking-wide">CONTACT</h1>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-3xl">
              Uw reis begint hier. Wij vertellen u graag meer over dit unieke en spectaculaire project.
            </p>

            {/* Pijl knop → open formulier */}
            <button
              onClick={() => setShowForm(true)}
              aria-label="Ga verder"
              className="mt-10 group"
            >
              <div className="w-8 h-14 border-2 border-white/60 rounded-full flex items-start justify-center">
                <div className="w-1 h-4 bg-white/80 mt-2 rounded group-hover:h-6 transition-all" />
              </div>
              <span className="mt-2 block text-sm text-white/70">Ga verder</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- FASE 2: FORMULIERPANEEL --- */}
      <div
        className={`absolute inset-0 transition-all duration-700 ${
          showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Achtergrond bureau/blur */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/download.jpg')` }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="w-full max-w-lg">

            {/* Titel van formulier */}
            <div className="text-center text-white mb-6">
              <h2 className="tracking-widest text-sm">SUBLIME CONTACT FORM</h2>
              <h1 className="mt-2 text-2xl font-semibold">NEEM CONTACT OP</h1>
            </div>

            {/* Terug knop */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowForm(false)}
                className="text-white/70 hover:text-white text-sm underline underline-offset-4"
              >
                ← Terug
              </button>
            </div>

            {/* Formulier of succesmelding */}
            {submitted ? (
              <div className="bg-green-600/20 border border-green-500 text-green-200 rounded-lg p-4 text-center">
                ✓ Bedankt voor uw bericht! We nemen zo snel mogelijk contact met u op.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-black/50 border border-white/10 rounded-lg p-8 space-y-6 text-white"
              >
                {/* Naam veld */}
                <div>
                  <label className="block text-xs tracking-widest mb-2 text-white/80">
                    GEBRUIKERSNAAM
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Uw naam"
                    className="w-full bg-transparent border-b border-white/40 focus:border-white outline-none py-2 placeholder:text-white/50"
                  />
                </div>

                {/* Email veld */}
                <div>
                  <label className="block text-xs tracking-widest mb-2 text-white/80">
                    MAIL@VOORBEELD.COM
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="mail@voorbeeld.com"
                    className="w-full bg-transparent border-b border-white/40 focus:border-white outline-none py-2 placeholder:text-white/50"
                  />
                </div>

                {/* Bericht veld */}
                <div>
                  <label className="block text-xs tracking-widest mb-2 text-white/80">
                    UW BERICHT
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Schrijf uw bericht..."
                    className="w-full bg-transparent border-b border-white/40 focus:border-white outline-none py-2 placeholder:text-white/50"
                  />
                </div>

                {/* Versturen knop */}
                <button
                  type="submit"
                  className="w-full mt-2 bg-white text-black font-semibold tracking-widest py-3 rounded hover:bg-white/90 transition"
                >
                  VERSTUREN
                </button>
              </form>
            )}

            {/* Footer */}
            <div className="mt-4 text-center text-xs text-white/60">
              © 2025 Sublime Contact Form. Alle rechten voorbehouden | Design geïnspireerd door w3layouts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}