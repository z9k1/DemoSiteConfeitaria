import { CtaLink } from "@/components/cta-link";
import { Gallery } from "@/components/gallery";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { brandSettings, ctaConfigs, productCategories, testimonials } from "@/lib/site-data";

export default function HomePage() {
  const whatsappWedding = ctaConfigs.find((item) => item.id === "whatsapp-casamento");
  const ifoodCta = ctaConfigs.find((item) => item.id === "external-ifood");

  return (
    <div>
      {/* Hero com âncoras principais */}
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 lg:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-500">
                Premium artesanal em Londrina-PR
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="font-serifDisplay text-4xl text-cocoa-900 leading-tight sm:text-5xl">
                {brandSettings.tagline}
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-cocoa-700">{brandSettings.summary}</p>
              <p className="mt-2 text-sm text-cocoa-700">
                Antecedência mínima de {brandSettings.minOrderNoticeDays} dias para encomendas sob medida.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <div className="flex flex-wrap justify-center gap-3">
                <CtaLink label="Bolos" href="#bolos" external={false} />
                <CtaLink label="Docinhos Gourmet" href="#docinhos-gourmet" external={false} />
                <CtaLink label="Macarons" href="#macarons" external={false} />
              </div>
            </Reveal>
          </div>
          <Reveal delay={240}>
            <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-rose-100 via-sand-100 to-white px-8 py-9 shadow-panel">
              <h2 className="font-serifDisplay text-2xl text-cocoa-900">Especialidade em macarons</h2>
              <p className="mt-3 text-sm text-cocoa-700">
                Personalização de cores, iniciais e logos com acabamento premium para casamentos, eventos corporativos e
                presentes.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-cocoa-700">
                <li>- Paleta coordenada com o evento</li>
                <li>- Embalagens sensoriais e convites-pronto</li>
                <li>- Torres e composições assinadas para mesas de doces</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Categorias gerais */}
      <section className="container-pad pt-12 pb-4">
        <SectionHeading
          eyebrow="Categorias"
          title="Oferta estruturada para converter melhor"
          subtitle="Separação clara entre encomendas premium, kits especiais e pedidos rápidos."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {productCategories.map((category, idx) => (
            <Reveal key={category.id} delay={idx * 60}>
              <article className="rounded-[1.25rem] bg-white/80 p-6 shadow-panel">
                <h3 className="font-serifDisplay text-2xl text-cocoa-900">{category.name}</h3>
                <p className="mt-3 text-sm text-cocoa-700">{category.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <Gallery />

      {/* Seção Bolos */}
      <section id="bolos" className="container-pad py-12 scroll-mt-28">
        <SectionHeading
          eyebrow="Seção"
          title="Bolos sob medida"
          subtitle="Bolos artesanais personalizados com acabamentos premium."
        />
        <Reveal>
          <div className="mt-6 rounded-[1.25rem] bg-white/80 p-6 shadow-panel">
            <ul className="space-y-2 text-sm text-cocoa-700">
              <li>- Personalização de sabores, recheios e acabamentos.</li>
              <li>- Tamanhos ajustados ao número de convidados.</li>
              <li>- Coordenação de paleta para eventos sociais e corporativos.</li>
            </ul>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <CtaLink
                label="Pedir orçamento no WhatsApp"
                message="Olá! Quero orçamento de bolos sob medida."
                eventName="click_whatsapp"
              />
              {ifoodCta ? <CtaLink label="Pedido rápido" href={ifoodCta.href} eventName="click_ifood" /> : null}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Seção Docinhos Gourmet */}
      <section id="docinhos-gourmet" className="container-pad py-12 scroll-mt-28">
        <SectionHeading
          eyebrow="Seção"
          title="Docinhos Gourmet (barras & biscoitos)"
          subtitle="Barras de chocolate personalizadas e biscoitos floridos apresentados como docinhos gourmet."
        />
        <Reveal>
          <div className="mt-6 rounded-[1.25rem] bg-white/80 p-6 shadow-panel">
            <ul className="space-y-2 text-sm text-cocoa-700">
              <li>- Barras de chocolate com personalização de cores e iniciais.</li>
              <li>- Biscoitos floridos com acabamento artesanal.</li>
              <li>- Combinações prontas para presentes e mesas de doces.</li>
            </ul>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <CtaLink
                label="Pedir orçamento no WhatsApp"
                message="Olá! Quero orçamento de docinhos gourmet (barras e biscoitos)."
                eventName="click_whatsapp"
              />
              {ifoodCta ? <CtaLink label="Pedido rápido" href={ifoodCta.href} eventName="click_ifood" /> : null}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Seção Macarons */}
      <section id="macarons" className="container-pad py-12 scroll-mt-28">
        <SectionHeading
          eyebrow="Seção"
          title="Macarons artesanais"
          subtitle="Especialidade da casa com personalização de cores, iniciais e logos."
        />
        <Reveal>
          <div className="mt-6 rounded-[1.25rem] bg-white/80 p-6 shadow-panel">
            <ul className="space-y-2 text-sm text-cocoa-700">
              <li>- Paleta coordenada ao evento, incluindo cores metálicas.</li>
              <li>- Inserção de iniciais, logos curtos e personalização fina.</li>
              <li>- Pedido mínimo conforme quantidade, sabores e cores.</li>
            </ul>
            <p className="mt-3 text-sm text-cocoa-700">
              Para encomendar: use o WhatsApp para briefing rápido ou siga pelo cardápio online para opções ágeis.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <CtaLink
                label="Pedir orçamento no WhatsApp"
                message="Olá! Quero orçamento de macarons personalizados."
                eventName="click_whatsapp"
              />
              {ifoodCta ? <CtaLink label="Pedido rápido" href={ifoodCta.href} eventName="click_ifood" /> : null}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Processo */}
      <section className="container-pad py-12">
        <SectionHeading
          eyebrow="Como funciona"
          title="Processo simples para encomendar"
          subtitle="Rapidez no primeiro contato com briefing completo para proposta assertiva."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            "1. Envie sua ideia no WhatsApp ou briefing",
            "2. Receba recomendação de sabores, formato e quantidades",
            "3. Confirme o pedido e acompanhe os detalhes finais"
          ].map((step, idx) => (
            <Reveal key={step} delay={idx * 60}>
              <div className="rounded-[1.25rem] border border-transparent bg-white/80 p-6 text-sm text-cocoa-700 shadow-panel">
                {step}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Depoimentos */}
      <section className="container-pad py-12">
        <SectionHeading eyebrow="Confiança" title="Clientes que recomendam" />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {testimonials.map((item, idx) => (
            <Reveal key={item.id} delay={idx * 80}>
              <blockquote className="space-y-3 rounded-[1.25rem] bg-white/90 p-6 shadow-panel">
                <p className="text-base text-cocoa-800">&ldquo;{item.text}&rdquo;</p>
                <footer className="text-sm font-semibold text-cocoa-800">
                  {item.author}
                  <span className="block text-xs font-normal text-cocoa-700">{item.role}</span>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="container-pad py-14">
        <div className="section-surface px-6 py-10 text-center">
          <Reveal>
            <h2 className="font-serifDisplay text-3xl text-cocoa-900">Pronto para elevar seu evento?</h2>
            <p className="mt-3 max-w-2xl text-sm text-cocoa-700">
              Fale com a equipe e receba um orçamento personalizado para casamento, corporativo ou comemoração especial.
            </p>
          </Reveal>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {whatsappWedding ? (
              <CtaLink label={whatsappWedding.label} message={whatsappWedding.message} eventName="click_whatsapp" />
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
