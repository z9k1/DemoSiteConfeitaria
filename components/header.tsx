import Image from "next/image";
import Link from "next/link";
import { brandSettings } from "@/lib/site-data";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/cardapio", label: "Cardápio" },
  { href: "/eventos", label: "Eventos & Casamentos" }
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-rose-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-wide text-cocoa-700 sm:text-base">
          <Image src="/gallery/logo.jpg" alt="Logo Cristiane Santos Gastronomia" width={32} height={32} className="rounded-lg" />
          <span>{brandSettings.businessName}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-cocoa-700 hover:text-cocoa-900">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
