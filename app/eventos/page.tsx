import type { Metadata } from "next";
import { LeadForm } from "@/components/lead-form";
import { SectionHeading } from "@/components/section-heading";
import { faqItems } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Eventos e Casamentos",
  description:
    "Macarons personalizados para casamentos e eventos corporativos em Londrina e região. Solicite seu briefing."
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer
    }
  }))
};

export default function EventosPage() {

  return (
    <div className="container-pad py-14 font-sanfrancisco font-bold tracking-tight leading-relaxed">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SectionHeading
        eyebrow="Eventos & Casamentos"
        title="Experiências Doces e Exclusivas"
        subtitle="Identidade visual e sofisticação para Casamentos, Eventos Corporativos e Celebrações Premium."
      />

      <div className="mt-6 space-y-6">
        <p className="text-sm text-cocoa-700 font-sansBrand font-normal tracking-tight">
          Briefing rápido do evento: conte-nos o tipo de ocasião, número de convidados e cores/temas desejados para que possamos
          antecipar combinações e personalizações exclusivas.
        </p>

        <div className="space-y-6">
          <LeadForm sourcePage="eventos" />

          <section className="space-y-4">
            <section className="grid gap-4 md:grid-cols-3">
              <article className="rounded-lg border border-rose-100 bg-white/70 p-5 text-sm text-cocoa-700 shadow-soft">
                <p className="font-serifBrand text-lg text-cocoa-900">Casamentos</p>
          <p className="mt-3 text-sm font-normal tracking-tight">
                  Mesa de doces e mimos para padrinhos, embalagens coordenadas e detalhes florais que refletem a paleta da
                  celebração.
                </p>
              </article>
              <article className="rounded-lg border border-rose-100 bg-white/70 p-5 text-sm text-cocoa-700 shadow-soft">
                <p className="font-serifBrand text-lg text-cocoa-900">Corporativo</p>
            <p className="mt-3 text-sm font-normal tracking-tight">Brindes personalizados com sua logomarca e acabamentos premium para eventos internos.</p>
              </article>
              <article className="rounded-lg border border-rose-100 bg-white/70 p-5 text-sm text-cocoa-700 shadow-soft">
                <p className="font-serifBrand text-lg text-cocoa-900">Celebrações</p>
            <p className="mt-3 text-sm font-normal tracking-tight">Aniversários e momentos especiais com toque artesanal e combinações sensoriais únicas.</p>
              </article>
            </section>

            <section className="rounded-lg border border-rose-100 bg-white/80 p-5 text-sm text-cocoa-700 shadow-soft">
              <h3 className="font-serifBrand text-2xl text-cocoa-900">Personalize seu evento</h3>
            <p className="mt-3 font-normal tracking-tight">
                Conte-nos os detalhes e receba uma proposta sob medida para doces, macarons, torres e brindes com acabamento premium.
              </p>
            <p className="mt-2 text-sm font-semibold text-cocoa-900 tracking-tight">
                Personalize seu evento: Conte-nos os detalhes e receba uma proposta sob medida.
              </p>
            </section>
          </section>
        </div>
      </div>
    </div>
  );
}
