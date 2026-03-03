import { CtaLink } from "@/components/cta-link";
import { SectionHeading } from "@/components/section-heading";
import { brandSettings, ctaConfigs, faqItems, productCategories, testimonials } from "@/lib/site-data";

export default function HomePage() {
  const whatsappPrimary = ctaConfigs.find((item) => item.id === "whatsapp-principal");
  const whatsappWedding = ctaConfigs.find((item) => item.id === "whatsapp-casamento");
  const ifoodCta = ctaConfigs.find((item) => item.id === "external-ifood");

  return (
    <div>
      <section className="container-pad py-16 sm:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="inline-flex rounded-full bg-rose-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cocoa-700">
              Premium artesanal em Londrina-PR
            </p>
            <h1 className="mt-5 font-serifBrand text-4xl text-cocoa-900 sm:text-5xl">{brandSettings.tagline}</h1>
            <p className="mt-5 max-w-xl text-base text-cocoa-700 sm:text-lg">{brandSettings.summary}</p>
            <p className="mt-4 text-sm text-cocoa-700">
              Antecedência mínima de {brandSettings.minOrderNoticeDays} dias para encomendas sob medida.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {whatsappPrimary ? (
                <CtaLink
                  label={whatsappPrimary.label}
                  message={whatsappPrimary.message}
                  eventName="click_whatsapp"
                  className="bg-cocoa-700 text-white hover:bg-cocoa-800"
                />
              ) : null}
              {ifoodCta ? (
                <CtaLink
                  label={ifoodCta.label}
                  href={ifoodCta.href}
                  className="border border-cocoa-200 bg-white text-cocoa-700 hover:border-cocoa-700"
                />
              ) : null}
            </div>
          </div>

          <div className="rounded-brand bg-gradient-to-br from-rose-100 to-rose-200 p-8 shadow-soft">
            <h2 className="font-serifBrand text-2xl text-cocoa-800">Especialidade em macarons</h2>
            <p className="mt-3 text-sm text-cocoa-700">
              Personalização de cores, iniciais e logos para casamentos, eventos corporativos e presentes especiais.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-cocoa-700">
              <li>- Paleta alinhada ao evento</li>
              <li>- Embalagens elegantes para convites e brindes</li>
              <li>- Torres de macarons para mesa de doces</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container-pad py-12">
        <SectionHeading
          eyebrow="Categorias"
          title="Oferta estruturada para converter melhor"
        subtitle="Separação clara entre encomendas premium, kits especiais e pedidos rápidos."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {productCategories.map((category) => (
            <article key={category.id} className="rounded-brand border border-rose-100 bg-white p-6 shadow-soft">
              <h3 className="font-serifBrand text-2xl text-cocoa-800">{category.name}</h3>
              <p className="mt-3 text-sm text-cocoa-700">{category.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-pad py-12">
        <SectionHeading
          eyebrow="Como funciona"
          title="Processo simples para encomendar"
          subtitle="Rapidez no primeiro contato e briefing completo para proposta assertiva."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
            "1. Envie sua ideia no WhatsApp ou briefing",
            "2. Receba recomendação de sabores, formato e quantidades",
            "3. Confirme o pedido e acompanhe os detalhes finais"
          ].map((step) => (
            <div key={step} className="rounded-brand border border-rose-100 bg-white p-5 text-sm text-cocoa-700 shadow-soft">
              {step}
            </div>
          ))}
        </div>
      </section>

      <section className="container-pad py-12">
        <SectionHeading eyebrow="Confiança" title="Clientes que recomendam" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote key={item.id} className="rounded-brand border border-rose-100 bg-white p-6 shadow-soft">
              <p className="text-sm text-cocoa-700">&ldquo;{item.text}&rdquo;</p>
              <footer className="mt-4 text-sm font-semibold text-cocoa-800">
                {item.author}
                <span className="block text-xs font-normal text-cocoa-700">{item.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="container-pad py-12">
        <SectionHeading eyebrow="FAQ" title="Perguntas frequentes" />
        <div className="mt-8 space-y-4">
          {faqItems.map((item) => (
            <details key={item.id} className="rounded-brand border border-rose-100 bg-white p-5 shadow-soft">
              <summary className="cursor-pointer text-sm font-semibold text-cocoa-800">{item.question}</summary>
              <p className="mt-3 text-sm text-cocoa-700">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="container-pad py-14">
        <div className="rounded-brand bg-cocoa-700 p-8 text-white">
          <h2 className="font-serifBrand text-3xl">Pronto para elevar seu evento?</h2>
          <p className="mt-3 max-w-xl text-sm text-white/90">
            Fale com a equipe e receba um orçamento personalizado para casamento, corporativo ou comemoração especial.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {whatsappWedding ? (
              <CtaLink
                label={whatsappWedding.label}
                message={whatsappWedding.message}
                eventName="click_whatsapp"
                className="bg-white text-cocoa-700 hover:bg-rose-50"
              />
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
