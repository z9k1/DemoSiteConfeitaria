"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { brandSettings } from "@/lib/site-data";
import { Reveal } from "@/components/reveal";
import { CustomSelect } from "@/components/custom-select";
import { assetPath } from "@/lib/asset-path";

type Bolo = {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  imageUrl: string;
};

type Decoration = {
  id: string;
  label: string;
  extraPrice: number;
};

type CartItem = {
  productId: string;
  productName: string;
  basePrice: number;
  quantity: number;
  decorationId: string;
  decorationLabel: string;
  decorationPrice: number;
  lineTotal: number;
};

const CART_STORAGE_KEY = "csg_cardapio_bolos_cart_v1";

const categoryConfigs = [
  {
    id: "bolos",
    label: "Bolos artesanais",
    title: "Bolos artesanais",
    description: "Cada item corresponde a 1kg e pode ser ajustado pela quantidade escolhida (para bolos).",
    isReady: true
  },
  {
    id: "docinhos",
    label: "Docinhos Gourmet",
    title: "Docinhos Gourmet",
    description: "Pedidos por cento. Sabores exclusivos para sua festa.",
    isReady: false
  },
  {
    id: "macarons",
    label: "Macarons",
    title: "Macarons",
    description: "Em breve.",
    isReady: false
  },
  {
    id: "kits",
    label: "Kits Presente",
    title: "Kits Presente",
    description: "Em breve.",
    isReady: false
  }
] as const;

type TabId = (typeof categoryConfigs)[number]["id"];

const BOLOS: Bolo[] = [
  {
    id: "ninho-abacaxi",
    name: "Ninho com abacaxi",
    basePrice: 79.9,
    description: "Massa branca e recheio cremoso de leite ninho com compota de abacaxi artesanal",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "ninho-morangos",
    name: "Ninho com morangos",
    basePrice: 89.9,
    description: "Massa branca e recheio cremoso de leite ninho com morangos frescos ou geleia de morango artesanal",
    imageUrl: assetPath("/images/bolos/ninho-com-morangos.jpeg")
  },
  {
    id: "abacaxi-coco",
    name: "Abacaxi com coco",
    basePrice: 79.9,
    description: "Massa branca e recheio de creme 4 leites (leite condensado, creme de leite, leite de coco e leite Ninho) com compota artesanal de abacaxi e beijinho cremoso",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "limao-frutas-vermelhas",
    name: "Limão siciliano e frutas vermelhas",
    basePrice: 89.9,
    description: "Massa branca com recheio cremoso de brigadeiro de limão siciliano e geleia artesanal de frutas vermelhas",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "morango-choc-branco",
    name: "Morango com chocolate branco",
    basePrice: 99.9,
    description: "Massa branca com recheio de trufa de chocolate branco e morangos frescos ou geleia de morango artesanal",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "brigadeiro",
    name: "Brigadeiro",
    basePrice: 84.9,
    description: "Massa de chocolate e duas camadas de brigadeiro cremoso",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "maracuja-chocolate",
    name: "Maracujá com chocolate",
    basePrice: 87.9,
    description: "Massa de chocolate com recheio de brigadeiro de maracujá e trufado de chocolate",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "prestigio",
    name: "Prestígio",
    basePrice: 83.9,
    description: "Massa de chocolate com recheio trufado de chocolate e beijinho cremoso",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "ninho-nutella",
    name: "Ninho com Nutella",
    basePrice: 89.9,
    description: "Massa branca com recheio de creme de leite Ninho e creme de Nutella",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "kinder-bueno",
    name: "Kinder Bueno",
    basePrice: 95.9,
    description: "Massa branca com recheio de creme Kinder Bueno e creme de Nutella",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "chocolate-caramelo",
    name: "Chocolate com Caramelo",
    basePrice: 99.9,
    description: "Massa dark com recheio de trufa de chocolate e caramelo com flor de sal",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "red-velvet",
    name: "Red Velvet",
    basePrice: 99.9,
    description: "Massa amanteigada de iogurte com recheio de mousse de cream cheese e geleia de frutas vermelhas",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "nozes-caramelizadas",
    name: "Nozes caramelizadas",
    basePrice: 97.9,
    description: "Massa branca com recheio  trufado de chocolate branco com praliné de nozes caramelizadas",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "surpresa-uva",
    name: "Surpresa de uva",
    basePrice: 86.9,
    description: "Massa branca com recheio de leite Ninho e uvas verdes sem sementes",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "morango-chocolate",
    name: "Morango com Chocolate",
    basePrice: 92.9,
    description: "Massa de chocolate com recheio de trufa de chocolate e morangos frescos ou geleia de morango artesanal",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "brigadeiro-morangos",
    name: "Brigadeiro com morangos",
    basePrice: 87.9,
    description: "Massa de chocolate com recheio de brigadeiro e brigadeiro branco com morangos frescos",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  }
];

const DECORATIONS: Decoration[] = [
  { id: "none", label: "Nenhuma", extraPrice: 0 },
  { id: "flores", label: "Flores comestíveis", extraPrice: 25 },
  { id: "macarons", label: "6 macarons minis ou 4 médios", extraPrice: 25 },
  { id: "macarons-flores", label: "6 macarons + Flores", extraPrice: 40 },
  { id: "topo-chocolate", label: "Topo de chocolate personalizado", extraPrice: 30 }
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function todayISODate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseISODate(value: string): Date {
  const [year, month, day] = value.split("-").map((part) => Number(part));
  return new Date(year, (month || 1) - 1, day || 1, 12, 0, 0, 0);
}

export default function CardapioPage() {
  const [activeTab, setActiveTab] = useState<TabId>("bolos");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedBolo, setSelectedBolo] = useState<Bolo | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [decorationId, setDecorationId] = useState(DECORATIONS[0].id);
  const [customerName, setCustomerName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [submitError, setSubmitError] = useState("");
  const activeTabInfo = categoryConfigs.find((tab) => tab.id === activeTab) ?? categoryConfigs[0];

  useEffect(() => {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as CartItem[];
      if (Array.isArray(parsed)) {
        setCart(parsed);
      }
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    document.body.style.overflow = selectedBolo ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedBolo]);

  const selectedDecoration = useMemo(
    () => DECORATIONS.find((option) => option.id === decorationId) ?? DECORATIONS[0],
    [decorationId]
  );

  const modalTotal = useMemo(() => {
    if (!selectedBolo) return 0;
    return selectedBolo.basePrice * quantity + selectedDecoration.extraPrice;
  }, [selectedBolo, quantity, selectedDecoration.extraPrice]);

  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.lineTotal, 0),
    [cart]
  );

  const badgeCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const openModal = (bolo: Bolo) => {
    setSelectedBolo(bolo);
    setQuantity(1);
    setDecorationId(DECORATIONS[0].id);
  };

  const closeModal = () => {
    setSelectedBolo(null);
  };

  const addToCart = () => {
    if (!selectedBolo) return;

    const lineTotal = selectedBolo.basePrice * quantity + selectedDecoration.extraPrice;
    const newItem: CartItem = {
      productId: selectedBolo.id,
      productName: selectedBolo.name,
      basePrice: selectedBolo.basePrice,
      quantity,
      decorationId: selectedDecoration.id,
      decorationLabel: selectedDecoration.label,
      decorationPrice: selectedDecoration.extraPrice,
      lineTotal
    };

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.decorationId === newItem.decorationId
      );
      if (existingIndex === -1) {
        return [...prev, newItem];
      }
      const updated = [...prev];
      const existing = updated[existingIndex];
      const mergedQuantity = existing.quantity + newItem.quantity;
      updated[existingIndex] = {
        ...existing,
        quantity: mergedQuantity,
        lineTotal: existing.basePrice * mergedQuantity + existing.decorationPrice
      };
      return updated;
    });

    closeModal();
    setIsCartOpen(true);
  };

  const removeItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const validateDate = (): boolean => {
    if (!eventDate) return false;
    const inputDate = parseISODate(eventDate);
    const minDate = parseISODate(todayISODate());
    return inputDate.getTime() >= minDate.getTime();
  };

  const finalizeOrder = () => {
    if (cart.length === 0) return;
    if (!customerName.trim()) {
      setSubmitError("Informe seu nome para continuar.");
      return;
    }
    if (!validateDate()) {
      setSubmitError("A data do evento não pode ser anterior à data atual.");
      return;
    }

    setSubmitError("");

    const lines = cart
      .map((item) => `- ${item.quantity}x Bolo ${item.productName}\n  Decoração: ${item.decorationLabel}`)
      .join("\n\n");

    const message = `Olá! Gostaria de fazer o seguinte pedido:\n\n${lines}\n\nTotal estimado: ${formatCurrency(
      cartTotal
    )}\n(Aguardando confirmação de disponibilidade e valor final)\n\nNome: ${customerName.trim()}\nData do evento: ${eventDate}`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${brandSettings.whatsappNumber}?text=${encoded}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="container-pad py-12">
      <header className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-500">Cardápio na palma da sua mão</p>
        <h1 className="mt-3 font-serifDisplay text-5xl text-cocoa-900">{activeTabInfo.title}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-cocoa-700">{activeTabInfo.description}</p>
      </header>

    <nav className="mb-8 flex flex-wrap justify-center gap-8 text-xl !font-medium uppercase !tracking-tight">
      {categoryConfigs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActiveTab(tab.id)}
          className={`transition pb-1 ${activeTab === tab.id ? "border-b-2 border-cocoa-900 text-cocoa-900" : "text-cocoa-600 hover:text-cocoa-900"}`}
        >
          {tab.label}
        </button>
      ))}
    </nav>

    {activeTabInfo.isReady ? (
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {BOLOS.map((bolo, idx) => (
          <Reveal key={bolo.id} delay={idx * 40}>
            <button
              type="button"
              onClick={() => openModal(bolo)}
              className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-white/90 text-left shadow-panel transition duration-500 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="relative h-60 w-full overflow-hidden rounded-t-lg">
                <Image
                  src={bolo.imageUrl}
                  alt={`Imagem do bolo ${bolo.name}`}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-serifDisplay text-2xl text-cocoa-900">{bolo.name}</h2>
                <p className="mt-2 text-lg text-cocoa-700">{bolo.description}</p>
                <p className="mt-4 text-lg font-semibold text-cocoa-900">{formatCurrency(bolo.basePrice)} / 1kg</p>
              </div>
            </button>
          </Reveal>
        ))}
      </section>
    ) : (
      <section className="rounded-lg bg-white/70 p-12 text-center text-sm text-cocoa-700 shadow-panel">
        <p className="font-serifBrand text-2xl text-cocoa-900">{activeTabInfo.title}</p>
        <p className="mt-3 text-lg">Estamos preparando novidades exclusivas. Em breve!</p>
      </section>
    )}

      <button
        type="button"
        onClick={() => setIsCartOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-3 rounded-lg bg-gradient-to-br from-cocoa-700 to-cocoa-900 px-5 py-3 text-lg font-semibold uppercase tracking-[0.2em] text-white shadow-lg transition hover:from-cocoa-800 hover:to-cocoa-950"
      >
        Carrinho
        <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-lg bg-white px-2 text-xs font-bold text-cocoa-900">
          {badgeCount}
        </span>
      </button>

      {isCartOpen ? (
        <aside className="fixed right-4 top-24 z-30 w-[min(92vw,380px)] rounded-lg bg-white/95 p-5 shadow-soft backdrop-blur">
          <h3 className="font-serifDisplay text-2xl text-cocoa-900">Resumo do pedido</h3>
          {cart.length === 0 ? (
            <p className="mt-4 text-sm text-cocoa-700">Seu carrinho está vazio.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {cart.map((item, index) => (
                <li key={`${item.productId}-${item.decorationId}-${index}`} className="rounded-lg bg-rose-50/80 p-3">
                  <p className="text-sm font-semibold text-cocoa-900">
                    {item.quantity}x {item.productName}
                  </p>
                  <p className="mt-1 text-xs text-cocoa-700">Decoração: {item.decorationLabel}</p>
                  <p className="mt-1 text-xs text-cocoa-700">Subtotal: {formatCurrency(item.lineTotal)}</p>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-rose-600 hover:text-rose-700"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-4 text-sm font-semibold text-cocoa-900">Total geral: {formatCurrency(cartTotal)}</p>

            <div className="mt-4 space-y-3">
              <input
                type="text"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Nome"
                className="h-14 w-full rounded-lg border border-rose-200 px-6 text-lg outline-none ring-cocoa-700/30 focus:ring"
              />
              <label className="block text-base font-bold text-cocoa-900">
                Data da Retirada / Evento
                <input
                  type="date"
                  value={eventDate}
                  min={todayISODate()}
                  onChange={(event) => setEventDate(event.target.value)}
                  placeholder="Quando você precisa do pedido?"
                  className="mt-1 h-14 w-full rounded-lg border border-rose-200 px-6 text-lg outline-none ring-cocoa-700/30 focus:ring"
                />
                <p className="mt-1 text-sm font-normal text-cocoa-700">
                  Lembre-se: pedidos com no mínimo 5 dias de antecedência.
                </p>
              </label>
              {submitError ? <p className="text-xs text-rose-700">{submitError}</p> : null}
              <button
                type="button"
                onClick={finalizeOrder}
                disabled={cart.length === 0}
                className="inline-flex h-12 md:h-14 w-full items-center justify-center rounded-lg bg-gradient-to-br from-cocoa-700 to-cocoa-900 px-6 text-base md:text-lg font-semibold uppercase tracking-[0.2em] text-white transition enabled:hover:from-cocoa-800 enabled:hover:to-cocoa-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Finalizar pedido
              </button>
            </div>
        </aside>
      ) : null}

      {selectedBolo ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-cocoa-900/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-8 sm:p-10 shadow-soft">
            <div className="relative mb-4 h-56 w-full overflow-hidden rounded-lg">
              <Image
                src={selectedBolo.imageUrl}
                alt={`Imagem do bolo ${selectedBolo.name}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 540px"
              />
            </div>
            <h2 className="font-serifDisplay text-3xl text-cocoa-900">{selectedBolo.name}</h2>
            <p className="mt-2 text-lg text-cocoa-700">{selectedBolo.description}</p>
            <p className="mt-3 text-lg font-semibold text-cocoa-900">
              Preço base: {formatCurrency(selectedBolo.basePrice)} / 1kg
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-base font-bold text-cocoa-700">
                Quantidade (kg)
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                  className="mt-1 h-14 w-full rounded-lg border border-rose-200 px-6 text-lg outline-none ring-cocoa-700/30 focus:ring"
                />
              </label>
              <label className="text-base font-bold text-cocoa-700">
                Decoração personalizada
                <div className="mt-1">
                  <CustomSelect
                    value={decorationId}
                    onChange={setDecorationId}
                    options={DECORATIONS.map((option) => ({
                      value: option.id,
                      label: `${option.label} (${formatCurrency(option.extraPrice)})`
                    }))}
                  />
                </div>
              </label>
            </div>

            <p className="mt-4 text-lg font-semibold text-cocoa-900">Total: {formatCurrency(modalTotal)}</p>

            <div className="mt-6 flex flex-row gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-12 flex-1 items-center justify-center rounded-lg border border-rose-200 px-4 text-base font-semibold uppercase tracking-[0.12em] text-cocoa-800 hover:bg-rose-50"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={addToCart}
                className="inline-flex h-12 flex-[2] items-center justify-center rounded-lg bg-gradient-to-br from-cocoa-700 to-cocoa-900 px-4 text-base font-semibold uppercase tracking-[0.12em] text-white hover:from-cocoa-800 hover:to-cocoa-950"
              >
                Adicionar ao carrinho
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
