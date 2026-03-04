"use client";

import { trackEvent } from "@/lib/analytics";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type CtaLinkProps = {
  label: string;
  message?: string;
  href?: string;
  eventName?: string;
  className?: string;
  external?: boolean;
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function withBasePath(href?: string) {
  if (!href) return href;
  if (!href.startsWith("/")) href = `/${href}`;
  if (!basePath) return href;
  const normalizedBase = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  if (href.startsWith(normalizedBase)) return href;
  return `${normalizedBase}${href}`;
}

export function CtaLink({
  label,
  message,
  href,
  eventName = "click_external_link",
  className = "",
  external = true
}: CtaLinkProps) {
  const internalHref = !external ? withBasePath(href) : href;
  const finalHref = message ? buildWhatsAppUrl(message) : internalHref ?? "#";
  const isAnchor = finalHref.startsWith("#");

  const handleClick = () => {
    trackEvent(eventName, { target: label, href: finalHref });
  };

  return (
    <a
      href={finalHref}
      onClick={handleClick}
      target={external && !isAnchor ? "_blank" : undefined}
      rel={external && !isAnchor ? "noreferrer" : undefined}
      className={`inline-flex h-14 items-center justify-center rounded-lg px-6 text-lg font-semibold uppercase tracking-[0.2em] text-white shadow-lg transition duration-300 ease-out ${className} bg-gradient-to-br from-cocoa-700 to-cocoa-900 hover:from-cocoa-800 hover:to-cocoa-950`}
    >
      {label}
    </a>
  );
}
