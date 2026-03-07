"use client";

import Image from "next/image";
import { galleryItems } from "@/lib/gallery-data";
import { Reveal } from "@/components/reveal";

export function Gallery() {
  return (
    <section className="mt-16">
      <div className="container-pad">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-500">Galeria</p>
          <h2 className="mt-2 font-serifDisplay text-3xl text-cocoa-900 sm:text-4xl">Momentos que inspiram</h2>
          <p className="mt-3 max-w-2xl text-sm text-cocoa-700">
            Fotos que mostram a textura, cor e apresentação dos doces para que você imagine a mesa perfeita.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, index) => (
            <Reveal key={item.title} delay={80 * index}>
            <article className="group relative overflow-hidden rounded-lg border border-transparent bg-cover bg-center shadow-panel">
                <div className="relative h-56 w-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    priority={index === 0}
                  />
                </div>
                <div className="bg-gradient-to-t from-black/75 via-black/35 to-transparent px-5 py-6 text-white">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-100 drop-shadow-sm sm:text-base">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/95 drop-shadow-sm">{item.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
