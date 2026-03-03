import type { Metadata } from "next";
import { CtaLink } from "@/components/cta-link";
import { LeadForm } from "@/components/lead-form";
import { SectionHeading } from "@/components/section-heading";
import { brandSettings, ctaConfigs, eventPackages, faqItems } from "@/lib/site-data";

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
  const whatsappWedding = ctaConfigs.find((item) => item.id === "whatsapp-casamento");

  return (
    <div className="container-pad py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SectionHeading
        eyebrow="Eventos & Casamentos"
        title="Sofisticação e personalização para impressionar"
        subtitle="Solução completa para noivas, cerimonialistas e empresas que querem doces com identidade visual."
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-brand border border-rose-100 bg-white p-6 shadow-soft">
            <h3 className="font-serifBrand text-2xl text-cocoa-800">Soluções para cada tipo de evento</h3>
            <ul className="mt-3 space-y-2 text-sm text-cocoa-700">
              <li>- Casamentos: mesa de doces, caixas para padrinhos e lembranças.</li>
              <li>- Corporativo: brindes com logo e kits para eventos internos.</li>
              <li>- Datas especiais: aniversários e comemorações premium.</li>
            </ul>
          </div>

          <div className="rounded-brand border border-rose-100 bg-white p-6 shadow-soft">
            <h3 className="font-serifBrand text-2xl text-cocoa-800">Torre de macarons</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {eventPackages.map((pkg) => (
                <article key={pkg.id} className="rounded-xl border border-rose-100 p-4">
                  <h4 className="text-sm font-semibold text-cocoa-800">{pkg.title}</h4>
                  <p className="mt-1 text-xs text-cocoa-700">{pkg.details}</p>
                  <p className="mt-2 text-sm font-semibold text-cocoa-800">{pkg.price}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-brand border border-rose-100 bg-white p-6 shadow-soft">
            <h3 className="font-serifBrand text-2xl text-cocoa-800">Regras comerciais transparentes</h3>
            <ul className="mt-3 space-y-2 text-sm text-cocoa-700">
              <li>- Antecedência mínima: {brandSettings.minOrderNoticeDays} dias.</li>
              <li>- Mínimos variam por item, cor e sabor.</li>
              <li>- Atendimento em {brandSettings.coverage}.</li>
            </ul>
            {whatsappWedding ? (
              <div className="mt-4">
                <CtaLink
                  label={whatsappWedding.label}
                  message={whatsappWedding.message}
                  eventName="click_whatsapp"
                  className="bg-cocoa-700 text-white hover:bg-cocoa-800"
                />
              </div>
            ) : null}
          </div>
        </div>

        <LeadForm sourcePage="eventos" />
      </div>
    </div>
  );
}
