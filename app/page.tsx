"use client";

import Image from "next/image";
import { useEffect } from "react";
import { CtaLink } from "@/components/cta-link";
import { BackToTop } from "@/components/back-to-top";
import { Gallery } from "@/components/gallery";
import { Reveal } from "@/components/reveal";

export default function HomePage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/DemoSiteConfeitaria";
  const cardapioPath = `${basePath.replace(/\/$/, "")}/cardapio`;

  return (
    <div>
      <BackToTop />

      {/* Hero minimalista */}
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 text-center lg:px-6">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-500">Cristiane Santos Gastronomia</p>
        </Reveal>
        <Reveal delay={80}>
          <div className="mx-auto flex max-w-xs flex-col items-center justify-center gap-4">
            <Image src="/gallery/logo.jpg" alt="Logo Cristiane Santos Gastronomia" width={180} height={180} className="rounded-lg object-cover" />
            <h1 className="font-serifDisplay text-4xl text-cocoa-900 leading-tight sm:text-5xl">
              Confeitaria artesanal que constrói sonhos em forma de doces
            </h1>
          </div>
          <p className="mt-4 text-lg text-cocoa-700">
            Doces, macarons e bolos personalizados para eventos, festas e ocasiões especiais. Sabor e arte em cada mordida
          </p>
        </Reveal>
        <Reveal delay={160}>
          <div className="flex flex-col items-center gap-3">
            <CtaLink label="Ver cardápio" href={cardapioPath} eventName="click_ifood" className="px-8 py-3" external={false} />
            <CtaLink
              label="Briefing de eventos"
              href="/eventos"
              eventName="click_event_briefing"
              className="bg-teal-500 px-8 py-3 text-white hover:bg-teal-600"
              external={false}
            />
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
