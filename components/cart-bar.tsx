"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";

const CART_STORAGE_KEY = "csg_cardapio_bolos_cart_v1";
const CART_STATE_EVENT = "csg:cart-state";
const CART_TOGGLE_EVENT = "csg:toggle-cart";

function getBadgeCountFromStorage() {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return 0;
    return parsed.reduce((acc, item) => {
      const qty = typeof item?.quantity === "number" ? item.quantity : 0;
      return acc + (Number.isFinite(qty) ? qty : 0);
    }, 0);
  } catch {
    return 0;
  }
}

export function CartBar() {
  const pathname = usePathname();
  const [badgeCount, setBadgeCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
  const isCardapioPage =
    pathname === "/cardapio" ||
    pathname === "/cardapio/" ||
    (basePath !== "" && (pathname === `${basePath}/cardapio` || pathname === `${basePath}/cardapio/`));

  useEffect(() => {
    setBadgeCount(getBadgeCountFromStorage());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleCartState = (event: Event) => {
      const detail = (event as CustomEvent<{ isOpen?: boolean; badgeCount?: number }>).detail;
      setIsCartOpen(detail?.isOpen ?? false);
      if (typeof detail?.badgeCount === "number") setBadgeCount(detail.badgeCount);
    };
    window.addEventListener(CART_STATE_EVENT, handleCartState);
    return () => window.removeEventListener(CART_STATE_EVENT, handleCartState);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== CART_STORAGE_KEY) return;
      setBadgeCount(getBadgeCountFromStorage());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const label = useMemo(() => {
    if (badgeCount === 1) return "Ver carrinho (1 item)";
    return `Ver carrinho (${badgeCount} itens)`;
  }, [badgeCount]);

  const openCart = () => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event(CART_TOGGLE_EVENT));
  };

  if (!isCardapioPage) return null;
  if (isCartOpen) return null;
  if (badgeCount <= 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 md:hidden">
      <button
        type="button"
        onClick={openCart}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-br from-cocoa-800 to-cocoa-900 px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-2xl transition duration-300 ease-out active:scale-[0.99]"
        aria-label="Ver carrinho"
      >
        <ShoppingCart size={18} strokeWidth={2.25} aria-hidden="true" />
        <span>{label}</span>
        <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-bold leading-none text-white">
          {badgeCount}
        </span>
      </button>
    </div>
  );
}

