import type { Metadata } from "next";
import { CtaLink } from "@/components/cta-link";
import { MenuCatalog } from "@/components/menu-catalog";
import { SectionHeading } from "@/components/section-heading";
import { ctaConfigs, products, productCategories } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Cardápio",
  description:
    "Cardápio de macarons, kits e doces artesanais em Londrina-PR. Solicite orçamento pelo WhatsApp ou faça pedido rápido."
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: products.map((item, index) => ({
    "@type": "Product",
    position: index + 1,
    name: item.name,
    description: item.description
  }))
};

export default function CardapioPage() {
  const whatsapp = ctaConfigs.find((item) => item.id === "whatsapp-principal");
  const ifood = ctaConfigs.find((item) => item.id === "external-ifood");

  return (
    <div className="container-pad py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <SectionHeading
        eyebrow="Cardápio"
        title="Delícias artesanais para cada ocasião"
        subtitle="Use os filtros para explorar categorias e acelerar seu pedido."
      />

      <div className="mt-8">
        <MenuCatalog categories={productCategories} products={products} />
      </div>

      <div className="mt-12 rounded-brand border border-rose-100 bg-white p-6 shadow-soft">
        <h3 className="font-serifBrand text-2xl text-cocoa-800">Pedido rápido</h3>
        <p className="mt-2 text-sm text-cocoa-700">
          Para itens de pronta decisão, você pode seguir pelo cardápio online. Para eventos, recomendamos briefing.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3 w-full">
          {ifood ? (
            <CtaLink
              label={ifood.label}
              href={ifood.href}
              eventName="click_ifood"
              className="bg-cocoa-700 text-white hover:bg-cocoa-800"
            />
          ) : null}
          {whatsapp ? (
            <CtaLink
              label="Quero apoio para escolher"
              message="Olá! Quero ajuda para escolher os produtos do cardápio."
              eventName="click_whatsapp"
              className="border border-cocoa-200 bg-white text-cocoa-700 hover:border-cocoa-700"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
