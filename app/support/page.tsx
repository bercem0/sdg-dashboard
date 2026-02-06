/* Deze pagina draait in de browser (client-side), niet op de server */
"use client";

/* Next.js Image component gebruiken voor snellere afbeeldingen */
import Image from "next/image";

/* useState om te onthouden welke FAQ open is */
import { useState } from "react";

/* Herbruikbare UI componenten voor kaarten */
import { Card, CardContent } from "@/components/ui/Card";

/* Array met FAQ vragen en antwoorden */
const faqs = [
  {
    question: "Wat zijn Duurzame Ontwikkelingsdoelen (SDG's)?",
    answer:
      "De SDG's zijn 17 mondiale doelen die in 2015 door alle lidstaten van de Verenigde Naties zijn aangenomen als een universele oproep tot actie om armoede te beëindigen, de planeet te beschermen en welvaart voor iedereen te waarborgen tegen 2030.",
  },
  {
    question: "Hoe gebruik ik de filters op SDG detailpagina's?",
    answer:
      'Gebruik de filterbalk om een regio, land en jaarbereik te selecteren. Klik op "Filters toepassen" om de grafieken en gegevens bij te werken. U kunt filters op elk moment resetten met de "Reset" knop.',
  },
  {
    question: "Kan ik mijn favoriete SDG opslaan?",
    answer:
      'Ja! Log in op uw account en klik op de knop "Toevoegen aan Favorieten" op elke SDG detailpagina.',
  },
  {
    question: "Hoe vaak worden de gegevens bijgewerkt?",
    answer:
      "Gegevens zijn afkomstig van officiële VN-databases en gerenommeerde internationale organisaties. We streven ernaar de database elk kwartaal bij te werken met de nieuwste beschikbare statistieken.",
  },
  {
    question: "Kan ik de gegevens exporteren?",
    answer:
      'Ja, elke SDG detailpagina bevat een gegevenstabel met een "Exporteer CSV" knop.',
  },
  {
    question: "Welke SDG's zijn momenteel beschikbaar?",
    answer: "Momenteel hebben we dashboards voor SDG 3, 4, 7 en 11.",
  },
  {
    question: "Is dit dashboard mobielvriendelijk?",
    answer: "Ja, het dashboard werkt goed op mobiel, tablet en desktop.",
  },
  {
    question: "Hoe kan ik bijdragen aan dit project?",
    answer: "Dit is een educatief project. Neem contact op via de Contactpagina.",
  },
];

/* Hoofdcomponent van de Support & FAQ pagina */
export default function SupportPage() {

  /* openIndex onthoudt welke FAQ open is (null = geen open FAQ) */
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  /* Container van de hele pagina */
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">

        {/* Hero sectie met titel links en afbeelding rechts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
          {/* Titel en korte uitleg */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
              Ondersteuning &amp; FAQ
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Vind antwoorden op veelgestelde vragen over het SDG Dashboard
            </p>
            {/* Knop naar contactpagina */}
            <a
              href="/contact"
              className="inline-block px-6 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors font-medium"
            >
              Neem contact op
            </a>
          </div>

          {/* Afbeelding rechts */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] rounded-full overflow-hidden">
              {/* Afbeelding automatisch schalen en snel laden */}
              <Image
                src="/images/support.png"
                alt="Sustainable Development Goals illustration"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Kaarten sectie met functies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Kaart 1: dashboards bekijken */}
          <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-none shadow-none">
            <CardContent className="p-6">
              <div className="text-2xl mb-3">📊</div>
              <h3 className="font-semibold mb-2">Bekijk Dashboards</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gedetailleerde statistieken per SDG
              </p>
            </CardContent>
          </Card>

          {/* Kaart 2: data filteren */}
          <Card className="bg-cyan-50 dark:bg-cyan-900/20 border-none shadow-none">
            <CardContent className="p-6">
              <div className="text-2xl mb-3">🔍</div>
              <h3 className="font-semibold mb-2">Filter Gegevens</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Verfijn op regio en periode
              </p>
            </CardContent>
          </Card>

          {/* Kaart 3: data downloaden */}
          <Card className="bg-sky-50 dark:bg-sky-900/20 border-none shadow-none">
            <CardContent className="p-6">
              <div className="text-2xl mb-3">📁</div>
              <h3 className="font-semibold mb-2">Exporteer CSV</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Download datasets
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Titel FAQ sectie */}
        <h2 className="text-2xl font-bold mb-6">Veelgestelde Vragen</h2>

        {/* FAQ kaarten maken met map */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              {/* Klik om FAQ open/dicht te zetten */}
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full text-left"
              >
                <CardContent className="p-6">
                  {/* Vraag en plus/min teken */}
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{faq.question}</h3>
                    <span className="text-xl">
                      {openIndex === index ? "−" : "+"}
                    </span>
                  </div>

                  {/* Antwoord alleen tonen als deze open is */}
                  {openIndex === index && (
                    <p className="mt-3 text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  )}
                </CardContent>
              </button>
            </Card>
          ))}
        </div>

        {/* CTA onderaan pagina */}
        <Card className="mt-12 bg-gray-50 dark:bg-gray-900/40 border-none">
          <CardContent className="p-10 text-center">
            {/* Titel CTA */}
            <h3 className="text-xl font-bold mb-2">
              Heeft u nog steeds hulp nodig?
            </h3>
            {/* Korte uitleg */}
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Neem contact op met ons ondersteuningsteam
            </p>
            {/* Knop naar contactpagina */}
            <a
              href="/contact"
              className="inline-block px-6 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Contact opnemen
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}