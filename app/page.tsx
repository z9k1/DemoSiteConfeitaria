"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CtaLink } from "@/components/cta-link";
import { Gallery } from "@/components/gallery";
import { Reveal } from "@/components/reveal";
import { assetPath } from "@/lib/asset-path";

const HERO_HEADLINE = "Confeitaria que constrói sonhos em forma de doces...";

export default function HomePage() {
  const [typedHeadline, setTypedHeadline] = useState("");
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    let frameId = 0;
    let lastTime = 0;
    let index = 0;
    const CHAR_INTERVAL_MS = 32;

    const animate = (timestamp: number) => {
      if (lastTime === 0) lastTime = timestamp;
      if (timestamp - lastTime >= CHAR_INTERVAL_MS) {
        index += 1;
        setTypedHeadline(HERO_HEADLINE.slice(0, index));
        lastTime = timestamp;
      }
      if (index < HERO_HEADLINE.length) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/DemoSiteConfeitaria";
  const cardapioPath = `${basePath.replace(/\/$/, "")}/cardapio`;
  const eventosPath = `${basePath.replace(/\/$/, "")}/eventos`;

  return (
    <div>
      {/* Hero minimalista */}
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 text-center lg:px-6">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-500">Cristiane Santos Gastronomia</p>
        </Reveal>
        <Reveal delay={80}>
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-6">
            <div className="relative w-full max-w-xl overflow-hidden rounded-2xl shadow-panel">
              <div
                className={`relative aspect-[16/9] w-full transition-opacity duration-700 ease-out ${
                  heroImageLoaded ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={assetPath("/gallery/imagembonitaparainicio.jpeg")}
                  alt="Imagem de destaque da confeitaria"
                  fill
                  priority
                  className="object-cover"
                  onLoadingComplete={() => setHeroImageLoaded(true)}
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 640px, 720px"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-rose-100/18 via-rose-50/6 to-transparent mix-blend-multiply" />
              </div>
            </div>
            <h1 className="mx-auto max-w-[22ch] font-serifDisplay text-3xl leading-tight text-cocoa-900 sm:max-w-[26ch] sm:text-4xl lg:max-w-[30ch] lg:text-[2.9rem]">
              {typedHeadline}
            </h1>
          </div>
          <p className="mx-auto mt-4 max-w-xl text-base text-cocoa-700 sm:max-w-2xl sm:text-lg">
            Doces, macarons e bolos personalizados para eventos, festas e ocasiões especiais. Sabor e arte em cada mordida.
          </p>
        </Reveal>
        <Reveal delay={160}>
          <div className="flex flex-col items-center gap-3">
          <CtaLink
            label="FAÇA SEU PEDIDO AQUI!"
            href={cardapioPath}
            eventName="click_ifood"
            className="px-8 py-3 shadow-xl !from-rose-500 !to-rose-700 transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-2xl hover:!from-rose-700 hover:!to-rose-900 active:scale-[0.99] will-change-transform"
            external={false}
          />
            <CtaLink
              label="Briefing de eventos"
              href={eventosPath}
              eventName="click_event_briefing"
              className="bg-teal-500 px-8 py-3 text-white shadow-xl hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-teal-600 hover:shadow-2xl active:scale-[0.99]"
              external={false}
            />
          </div>
        </Reveal>
      </section>

      <section className="container-pad pb-10">
        <Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-lg border border-rose-100 bg-white/85 p-6 text-left shadow-panel">
              <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-cocoa-800">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8L12 3z" />
                </svg>
              </div>
              <h3 className="font-serifDisplay text-2xl text-cocoa-900">Ingredientes premium</h3>
              <p className="mt-2 text-sm text-cocoa-700">Selecionamos matérias-primas nobres para garantir sabor marcante, textura e acabamento impecável.</p>
            </article>
            <article className="rounded-lg border border-rose-100 bg-white/85 p-6 text-left shadow-panel">
              <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-cocoa-800">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 20h16" />
                  <path d="M7 20V8l5-4 5 4v12" />
                </svg>
              </div>
              <h3 className="font-serifDisplay text-2xl text-cocoa-900">Personalização para eventos</h3>
              <p className="mt-2 text-sm text-cocoa-700">Adaptamos sabores, cores e apresentação ao estilo de cada celebração para uma mesa exclusiva.</p>
            </article>
            <article className="rounded-lg border border-rose-100 bg-white/85 p-6 text-left shadow-panel">
              <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-cocoa-800">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 7h12" />
                  <path d="M8 7v10a4 4 0 0 0 8 0V7" />
                  <path d="M9 11h6" />
                </svg>
              </div>
              <h3 className="font-serifDisplay text-2xl text-cocoa-900">Produção artesanal</h3>
              <p className="mt-2 text-sm text-cocoa-700">Cada pedido é produzido em pequenos lotes com cuidado técnico e atenção aos detalhes visuais.</p>
            </article>
          </div>
        </Reveal>
      </section>

      <Gallery />

      {/* CTA final minimal */}
      <section className="container-pad py-14 text-center">
        <Reveal>
          <h2 className="font-serifDisplay text-3xl text-cocoa-900">Veja o cardápio completo</h2>
          <p className="mt-3 text-sm text-cocoa-700">Ação única para conferir opções e sabores disponíveis.</p>
        </Reveal>
        <div className="mt-6 flex justify-center">
          <CtaLink label="Ver cardápio" href="/cardapio" eventName="click_ifood" className="px-8 py-3" external={false} />
        </div>
      </section>
    </div>
  );
}
