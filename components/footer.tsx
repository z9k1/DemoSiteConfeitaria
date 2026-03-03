import Link from "next/link";
import { brandSettings } from "@/lib/site-data";

type IconLinkProps = {
  href: string;
  label: string;
  children: React.ReactNode;
};

function IconLink({ href, label, children }: IconLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-transparent bg-white/80 text-cocoa-700 transition hover:border-cocoa-700 hover:text-cocoa-900"
      aria-label={label}
    >
      {children}
      <span className="sr-only">{label}</span>
    </a>
  );
}

const Icon = ({ path }: { path: string }) => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d={path} />
  </svg>
);

export function Footer() {
  return (
    <footer className="mt-16 border-t border-rose-100 bg-rose-50/60">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="text-lg font-semibold text-cocoa-800">{brandSettings.businessName}</p>
          <p className="mt-2 text-sm text-cocoa-700">{brandSettings.summary}</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cocoa-700">Contato</p>
          <ul className="mt-2 space-y-1 text-sm text-cocoa-700">
            <li>{brandSettings.phoneDisplay}</li>
            <li>{brandSettings.address}</li>
            <li>Cobertura: {brandSettings.coverage}</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cocoa-700">Links</p>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-cocoa-700">
            <IconLink href={brandSettings.instagramUrl} label="Instagram">
              <Icon path="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 2 .3 2.5.5.6.3 1 .7 1.4 1.4.2.5.4 1.2.5 2.5.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 2-.5 2.5-.3.6-.7 1-1.4 1.4-.5.2-1.2.4-2.5.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-2-.3-2.5-.5-.6-.3-1-.7-1.4-1.4-.2-.5-.4-1.2-.5-2.5C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-2 .5-2.5.3-.6.7-1 1.4-1.4.5-.2 1.2-.4 2.5-.5C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 .1-1.6.2-2 .4-.5.2-.9.5-1.1 1-.2.4-.4 1-.4 2-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1 .2 1.6.4 2 .2.5.6.8 1.1 1 .4.2 1 .3 2 .4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1-.1 1.6-.2 2-.4.5-.2.9-.5 1.1-1 .2-.4.4-1 .4-2 .1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1-.2-1.6-.4-2-.2-.5-.6-.8-1.1-1-.4-.2-1-.3-2-.4-1.2-.1-1.6-.1-4.7-.1zM12 5.8a6.2 6.2 0 1 1 0 12.4 6.2 6.2 0 0 1 0-12.4zm0 1.8a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8zm6-1.5a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z" />
            </IconLink>
            <IconLink href={brandSettings.ifoodUrl} label="Pedido rápido">
              <Icon path="M4 3h3.2l1.7 6.1h8.6l2.5-4.8H9.7L8.3 3H4zm3.8 9a2.2 2.2 0 1 0 2.2 2.2A2.2 2.2 0 0 0 7.8 12zm9 0a2.2 2.2 0 1 0 2.2 2.2A2.2 2.2 0 0 0 16.8 12zM2 2h2l2.4 8.4A3.8 3.8 0 0 0 9.9 14h6.6a3.8 3.8 0 0 0 3.5-2.6l2-6.7a.4.4 0 0 0-.4-.6H10.7L9.3 2H2z" />
            </IconLink>
            <IconLink href={brandSettings.menuPdfUrl} label="Catálogo PDF">
              <Icon path="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8zM13 3.5 17.5 8H13zM6 20V4h6v5h5v11z" />
            </IconLink>
            <Link href="/politica-de-privacidade" className="flex h-10 w-10 items-center justify-center rounded-full border border-transparent bg-white/80 text-cocoa-700 transition hover:border-cocoa-700 hover:text-cocoa-900" aria-label="Política de privacidade">
              <Icon path="M12 2a9 9 0 1 0 9 9 9 9 0 0 0-9-9zm.5 13.3h-1V11h1zm0-5.9h-1V7h1z" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
