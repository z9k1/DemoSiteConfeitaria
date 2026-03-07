import type { Metadata } from "next";
import "./globals.css";
import { AnalyticsScripts } from "@/components/analytics-scripts";
import { CartBar } from "@/components/cart-bar";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { brandSettings } from "@/lib/site-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brandSettings.businessName} | Macarons em Londrina`,
    template: `%s | ${brandSettings.businessName}`
  },
  description: brandSettings.summary,
  keywords: [
    "macarons em Londrina",
    "doces para casamento Londrina",
    "brindes corporativos doces",
    "confeitaria artesanal Londrina"
  ],
  openGraph: {
    title: brandSettings.businessName,
    description: brandSettings.summary,
    url: siteUrl,
    locale: "pt_BR",
    type: "website"
  },
  alternates: {
    canonical: siteUrl
  }
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: brandSettings.businessName,
  description: brandSettings.summary,
  telephone: brandSettings.phoneDisplay,
  address: brandSettings.address,
  areaServed: brandSettings.coverage,
  sameAs: [brandSettings.instagramUrl]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AnalyticsScripts />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFab />
        <CartBar />
      </body>
    </html>
  );
}
