"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { brandSettings } from "@/lib/site-data";
import { assetPath } from "@/lib/asset-path";

type Bolo = {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  imageUrl: string;
};

type DocinhoProduct = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

type DocinhoFlavor = {
  id: string;
  label: string;
  price: number;
};

type BombomProduct = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

type BombomMode = {
  id: "unidades" | "caixa2" | "caixa4";
  label: string;
  price: number;
  minQty: number;
};

type BombomFlavor = {
  id: string;
  label: string;
};

type CentoProduct = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  unitPrice: number;
};

type CentoFlavor = {
  id: string;
  label: string;
};

type BarraProduct = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

type BarraSizeOption = {
  id: "mini-30g" | "barra-130g" | "barra-200g";
  label: string;
  price: number;
};

type BarraChocolateOption = {
  id: "ao-leite" | "branco" | "meio-amargo" | "branco-limao-lavanda";
  label: string;
};

type MacaronProduct = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

type MacaronFlavor = {
  id: string;
  label: string;
  price: number;
};

type Decoration = {
  id: string;
  label: string;
  extraPrice: number | null;
};

type CartItem = {
  category: "bolo" | "docinho" | "bombom" | "cento" | "barra" | "macaron";
  productId: string;
  productName: string;
  basePrice: number;
  quantity: number;
  decorationIds: string[];
  decorationLabels: string[];
  decorationTotal: number;
  lineTotal: number;
  detailLines: string[];
  bombomModeLabel?: string;
  bombomFlavorLabel?: string;
  bombomTheme?: string;
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
    label: "Doces finos",
    title: "Doces finos",
    description: "Pedidos por cento. Sabores exclusivos para sua festa.",
    isReady: true
  },
  {
    id: "macarons",
    label: "Macarons",
    title: "Macarons",
    description: "Macarons artesanais por unidade.",
    isReady: true
  },
  {
    id: "barras",
    label: "Barras de chocolate",
    title: "Barras de chocolate",
    description: "Barras decoradas e personalizadas para presentes e eventos.",
    isReady: true
  },
  {
    id: "kits",
    label: "Kits para festa",
    title: "Kits para festa",
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
    imageUrl: assetPath("/images/bolos/nb.jpeg")
  },
  {
    id: "ninho-morangos",
    name: "Ninho com morangos",
    basePrice: 89.9,
    description: "Massa branca e recheio cremoso de leite ninho com morangos frescos ou geleia de morango artesanal",
    imageUrl: assetPath("/images/bolos/nm.jpeg")
  },
  {
    id: "abacaxi-coco",
    name: "Abacaxi com coco",
    basePrice: 79.9,
    description: "Massa branca e recheio de creme 4 leites (leite condensado, creme de leite, leite de coco e leite Ninho) com compota artesanal de abacaxi e beijinho cremoso",
    imageUrl: assetPath("/images/bolos/ac.jpeg")
  },
  {
    id: "limao-frutas-vermelhas",
    name: "Limão siciliano e frutas vermelhas",
    basePrice: 89.9,
    description: "Massa branca com recheio cremoso de brigadeiro de limão siciliano e geleia artesanal de frutas vermelhas",
    imageUrl: assetPath("/images/bolos/lv.jpeg")
  },
  {
    id: "morango-choc-branco",
    name: "Morango com chocolate branco",
    basePrice: 99.9,
    description: "Massa branca com recheio de trufa de chocolate branco e morangos frescos ou geleia de morango artesanal",
    imageUrl: assetPath("/images/bolos/mcb.jpeg")
  },
  {
    id: "brigadeiro",
    name: "Brigadeiro",
    basePrice: 84.9,
    description: "Massa de chocolate e duas camadas de brigadeiro cremoso",
    imageUrl: assetPath("/images/bolos/bb.jpeg")
  },
  {
    id: "maracuja-chocolate",
    name: "Maracujá com chocolate",
    basePrice: 87.9,
    description: "Massa de chocolate com recheio de brigadeiro de maracujá e trufado de chocolate",
    imageUrl: assetPath("/images/bolos/mcc.jpeg")
  },
  {
    id: "prestigio",
    name: "Prestígio",
    basePrice: 83.9,
    description: "Massa de chocolate com recheio trufado de chocolate e beijinho cremoso",
    imageUrl: assetPath("/images/bolos/pp.jpeg")
  },
  {
    id: "ninho-nutella",
    name: "Ninho com Nutella",
    basePrice: 89.9,
    description: "Massa branca com recheio de creme de leite Ninho e creme de Nutella",
    imageUrl: assetPath("/images/bolos/nnn.jpeg")
  },
  {
    id: "kinder-bueno",
    name: "Kinder Bueno",
    basePrice: 95.9,
    description: "Massa branca com recheio de creme Kinder Bueno e creme de Nutella",
    imageUrl: assetPath("/images/bolos/kbz.jpeg")
  },
  {
    id: "chocolate-caramelo",
    name: "Chocolate com Caramelo",
    basePrice: 99.9,
    description: "Massa dark com recheio de trufa de chocolate e caramelo com flor de sal",
    imageUrl: assetPath("/images/bolos/cc.jpeg")
  },
  {
    id: "red-velvet",
    name: "Red Velvet",
    basePrice: 99.9,
    description: "Massa amanteigada de iogurte com recheio de mousse de cream cheese e geleia de frutas vermelhas",
    imageUrl: assetPath("/images/bolos/rv.jpeg")
  },
  {
    id: "nozes-caramelizadas",
    name: "Nozes caramelizadas",
    basePrice: 97.9,
    description: "Massa branca com recheio  trufado de chocolate branco com praliné de nozes caramelizadas",
    imageUrl: assetPath("/images/bolos/nz.jpeg")
  },
  {
    id: "surpresa-uva",
    name: "Surpresa de uva",
    basePrice: 86.9,
    description: "Massa branca com recheio de leite Ninho e uvas verdes sem sementes",
    imageUrl: assetPath("/images/bolos/suv.jpeg")
  },
  {
    id: "morango-chocolate",
    name: "Morango com Chocolate",
    basePrice: 92.9,
    description: "Massa de chocolate com recheio de trufa de chocolate e morangos frescos ou geleia de morango artesanal",
    imageUrl: assetPath("/images/bolos/mmc.jpeg")
  },
  {
    id: "brigadeiro-morangos",
    name: "Brigadeiro com morangos",
    basePrice: 87.9,
    description: "Massa de chocolate com recheio de brigadeiro e brigadeiro branco com morangos frescos",
    imageUrl: assetPath("/images/bolos/bv.jpeg")
  }
];

const DECORATIONS: Decoration[] = [
  { id: "flores", label: "Flores comestíveis", extraPrice: 25 },
  { id: "macarons", label: "6 macarons minis ou 4 médios", extraPrice: 25 },
  { id: "macarons-flores", label: "6 macarons + Flores", extraPrice: 40 },
  { id: "topo-chocolate", label: "Topo de chocolate personalizado", extraPrice: 30 },
  { id: "topo-papel", label: "Topo de papel (valor a consultar)", extraPrice: null },
  {
    id: "decoracao-foto",
    label: "Decoração personalizada (envie a foto para orçamento)",
    extraPrice: null
  }
];

const DOCINHO_MIN_QTY = 15;

const DOCINHO_PRODUCT: DocinhoProduct = {
  id: "docinho-gourmet-25g",
  name: "Docinho Gourmet 25g",
  description:
    "Peso: 25 gramas. Observação: todos acompanham forma marrom número 4 + 4 pétalas brancas padrão. Feitos com chocolate nobre.",
  imageUrl: assetPath("/images/bolos/doces-finos.jpeg")
};

const DOCINHO_FLAVORS: DocinhoFlavor[] = [
  { id: "damasco", label: "Damasco", price: 3.5 },
  { id: "brigadeiro-branco", label: "Brigadeiro branco", price: 2.5 },
  { id: "brigadeiro-gourmet", label: "Brigadeiro gourmet", price: 2.5 },
  { id: "beijinho", label: "Beijinho", price: 2.4 },
  { id: "casadinho", label: "Casadinho", price: 2.4 },
  { id: "coco-amendoas", label: "Coco com Amêndoas", price: 3.5 },
  { id: "churros", label: "Churros", price: 2.9 },
  { id: "ninho-nutella", label: "Ninho com Nutella", price: 3.0 },
  { id: "pacoca", label: "Paçoca", price: 2.4 },
  { id: "surpresa-uva", label: "Surpresa de uva", price: 3.0 },
  { id: "nozes", label: "Nozes", price: 3.0 },
  { id: "brigadeiro-belga", label: "Brigadeiro belga", price: 3.8 }
];

const BOMBOM_PRODUCT: BombomProduct = {
  id: "bombons-personalizados",
  name: "Bombons personalizados",
  description:
    "Bombons finos e personalizados para eventos e presentes. Feitos com chocolate nobre e acabamento artístico.",
  imageUrl: assetPath("/images/bolos/ipiranga2.jpeg")
};

const BOMBOM_MODES: BombomMode[] = [
  { id: "unidades", label: "Encomenda solta (mín. 35 un)", price: 5, minQty: 35 },
  { id: "caixa2", label: "Caixinha com 2 unidades", price: 12, minQty: 1 },
  { id: "caixa4", label: "Caixinha com 4 unidades", price: 24, minQty: 1 }
];

const BOMBOM_FLAVORS: BombomFlavor[] = [
  { id: "frutas-secas", label: "Frutas secas" },
  { id: "castanhas", label: "Castanhas" },
  { id: "raspas-limao", label: "Raspas de limão" }
];

const CENTO_13G_PRODUCT: CentoProduct = {
  id: "cento-docinhos-13g",
  name: "Cento de Docinhos 13g",
  description:
    "Tamanho ideal para festas. O valor de R$ 150,00 é por sabor (cada sabor selecionado corresponde a 100 unidades).",
  imageUrl: assetPath("/images/bolos/brigadeiro.jpeg"),
  unitPrice: 150
};

const CENTO_13G_FLAVORS: CentoFlavor[] = [
  { id: "brigadeiro", label: "Brigadeiro" },
  { id: "beijinho", label: "Beijinho" },
  { id: "casadinho", label: "Casadinho" },
  { id: "ninho-nutella", label: "Ninho com Nutella" },
  { id: "pacoca", label: "Paçoca" },
  { id: "churros", label: "Churros" },
  { id: "brigadeiro-branco", label: "Brigadeiro branco" }
];

const CENTO_18G_PRODUCT: CentoProduct = {
  id: "cento-docinhos-18g",
  name: "Cento de Docinhos 18g",
  description:
    "Docinhos em tamanho tradicional (18g). O valor de R$ 200,00 é por sabor (cada sabor selecionado corresponde a 100 unidades).",
  imageUrl: assetPath("/images/bolos/doces-finos2.jpeg"),
  unitPrice: 200
};

const CENTO_18G_FLAVORS: CentoFlavor[] = [
  { id: "brigadeiro", label: "Brigadeiro" },
  { id: "beijinho", label: "Beijinho" },
  { id: "casadinho", label: "Casadinho" },
  { id: "ninho-nutella", label: "Ninho com Nutella" },
  { id: "pacoca", label: "Paçoca" },
  { id: "churros", label: "Churros" },
  { id: "brigadeiro-branco", label: "Brigadeiro branco" },
  { id: "uva", label: "Uva" }
];

function getCentoFlavors(productId: string): CentoFlavor[] {
  if (productId === CENTO_18G_PRODUCT.id) return CENTO_18G_FLAVORS;
  return CENTO_13G_FLAVORS;
}

const BARRAS_FLORIDAS_PRODUCT: BarraProduct = {
  id: "barras-floridas",
  name: "Barras Floridas",
  description:
    "Barras de chocolate decoradas com flores comestíveis e pedacinhos de macaron. (Observação: a decoração florida não se aplica à barra de limão siciliano com lavanda, que possui receita própria.)",
  imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
};

const BARRAS_FLORIDAS_SIZES: BarraSizeOption[] = [
  { id: "mini-30g", label: "Mini barra (30 gramas)", price: 8 },
  { id: "barra-130g", label: "Barra de 130 gramas", price: 28 },
  { id: "barra-200g", label: "Barras de 200 gramas", price: 40 }
];

const BARRAS_FLORIDAS_CHOCOLATES: BarraChocolateOption[] = [
  { id: "ao-leite", label: "Ao leite" },
  { id: "branco", label: "Branco" },
  { id: "meio-amargo", label: "Meio amargo" },
  { id: "branco-limao-lavanda", label: "Branco com limao siciliano e lavanda" }
];

const MACARON_PRODUCT: MacaronProduct = {
  id: "macarons",
  name: "Macarons",
  description:
    "Macarons artesanais por unidade. Pedido mínimo: 10 a 19 unidades: até 2 sabores e 1 cor. Acima de 20 unidades: até 4 sabores e 2 cores.",
  imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
};

const MACARON_FLAVORS: MacaronFlavor[] = [
  { id: "chocolate-branco", label: "Chocolate branco", price: 7 },
  { id: "brigadeiro-meio-amargo", label: "Brigadeiro meio amargo", price: 7 },
  { id: "casadinho", label: "Casadinho", price: 7 },
  { id: "pacoca", label: "Paçoca", price: 7 },
  { id: "baunilha", label: "Baunilha", price: 7.5 },
  { id: "frutas-vermelhas", label: "Frutas vermelhas", price: 7.5 },
  { id: "maracuja", label: "Maracujá", price: 7 },
  { id: "limao-siciliano", label: "Limão siciliano", price: 7 },
  { id: "ninho-nutella", label: "Ninho com Nutella", price: 7 }
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
  const [selectedDocinho, setSelectedDocinho] = useState<DocinhoProduct | null>(null);
  const [selectedBombom, setSelectedBombom] = useState<BombomProduct | null>(null);
  const [selectedCento, setSelectedCento] = useState<CentoProduct | null>(null);
  const [selectedBarra, setSelectedBarra] = useState<BarraProduct | null>(null);
  const [selectedMacaron, setSelectedMacaron] = useState<MacaronProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedDecorationIds, setSelectedDecorationIds] = useState<string[]>([]);
  const [docinhoQuantity, setDocinhoQuantity] = useState(DOCINHO_MIN_QTY);
  const [selectedFlavorId, setSelectedFlavorId] = useState("");
  const [docinhoQuantityInput, setDocinhoQuantityInput] = useState(DOCINHO_MIN_QTY.toString());
  const [docinhoQuantityError, setDocinhoQuantityError] = useState("");
  const [selectedBombomModeId, setSelectedBombomModeId] = useState<BombomMode["id"]>("unidades");
  const [selectedBombomFlavorId, setSelectedBombomFlavorId] = useState(BOMBOM_FLAVORS[0]?.id ?? "");
  const [bombomQuantity, setBombomQuantity] = useState(BOMBOM_MODES[0]?.minQty ?? 35);
  const [bombomQuantityInput, setBombomQuantityInput] = useState((BOMBOM_MODES[0]?.minQty ?? 35).toString());
  const [bombomQuantityError, setBombomQuantityError] = useState("");
  const [bombomTheme, setBombomTheme] = useState("");
  const [centoQuantity, setCentoQuantity] = useState(1);
  const [centoQuantityInput, setCentoQuantityInput] = useState("1");
  const [selectedCentoFlavorIds, setSelectedCentoFlavorIds] = useState<string[]>([]);
  const [centoError, setCentoError] = useState("");
  const [selectedBarraSizeId, setSelectedBarraSizeId] = useState<BarraSizeOption["id"]>(
    BARRAS_FLORIDAS_SIZES[0]?.id ?? "mini-30g"
  );
  const [selectedBarraChocolateId, setSelectedBarraChocolateId] = useState<BarraChocolateOption["id"]>(
    BARRAS_FLORIDAS_CHOCOLATES[0]?.id ?? "ao-leite"
  );
  const [barraQuantity, setBarraQuantity] = useState(1);
  const [barraQuantityInput, setBarraQuantityInput] = useState("1");
  const [barraQuantityError, setBarraQuantityError] = useState("");
  const [macaronQuantity, setMacaronQuantity] = useState(10);
  const [macaronQuantityInput, setMacaronQuantityInput] = useState("10");
  const [macaronQuantityError, setMacaronQuantityError] = useState("");
  const [selectedMacaronFlavorId, setSelectedMacaronFlavorId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [submitError, setSubmitError] = useState("");
  const activeTabInfo = categoryConfigs.find((tab) => tab.id === activeTab) ?? categoryConfigs[0];
  const minDocinhoPrice = useMemo(
    () => Math.min(...DOCINHO_FLAVORS.map((flavor) => flavor.price)),
    []
  );
  const minBombomPrice = useMemo(
    () => Math.min(...BOMBOM_MODES.map((mode) => mode.price)),
    []
  );
  const minBarraPrice = useMemo(
    () => Math.min(...BARRAS_FLORIDAS_SIZES.map((size) => size.price)),
    []
  );
  const minMacaronPrice = useMemo(
    () => Math.min(...MACARON_FLAVORS.map((flavor) => flavor.price)),
    []
  );

  useEffect(() => {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as CartItem[];
      const isValid =
        Array.isArray(parsed) &&
        parsed.every(
          (item) =>
            (item.category === "bolo" ||
              item.category === "docinho" ||
              item.category === "bombom" ||
              item.category === "cento" ||
              item.category === "barra" ||
              item.category === "macaron") &&
            Array.isArray(item.decorationIds) &&
            Array.isArray(item.decorationLabels) &&
            Array.isArray(item.detailLines)
        );
      if (isValid) {
        setCart(parsed);
      } else {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const isModalOpen = Boolean(
    selectedBolo || selectedDocinho || selectedBombom || selectedCento || selectedBarra || selectedMacaron
  );

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const selectedDecorations = useMemo(
    () => DECORATIONS.filter((option) => selectedDecorationIds.includes(option.id)),
    [selectedDecorationIds]
  );

  const selectedDecorationTotal = useMemo(
    () =>
      selectedDecorations.reduce((acc, item) => acc + (item.extraPrice ?? 0), 0),
    [selectedDecorations]
  );

  const modalTotal = useMemo(() => {
    if (!selectedBolo) return 0;
    return selectedBolo.basePrice * quantity + selectedDecorationTotal;
  }, [selectedBolo, quantity, selectedDecorationTotal]);

  const selectedFlavor = useMemo(
    () => DOCINHO_FLAVORS.find((flavor) => flavor.id === selectedFlavorId) ?? null,
    [selectedFlavorId]
  );
  const selectedMacaronFlavor = useMemo(
    () => MACARON_FLAVORS.find((flavor) => flavor.id === selectedMacaronFlavorId) ?? null,
    [selectedMacaronFlavorId]
  );

  const selectedBombomMode = useMemo(
    () => BOMBOM_MODES.find((mode) => mode.id === selectedBombomModeId) ?? BOMBOM_MODES[0],
    [selectedBombomModeId]
  );

  const selectedBombomFlavor = useMemo(
    () => BOMBOM_FLAVORS.find((flavor) => flavor.id === selectedBombomFlavorId) ?? BOMBOM_FLAVORS[0],
    [selectedBombomFlavorId]
  );

  const docinhoTotal = useMemo(() => {
    if (!selectedFlavor) return 0;
    return selectedFlavor.price * docinhoQuantity;
  }, [selectedFlavor, docinhoQuantity]);

  const bombomTotal = useMemo(() => {
    if (!selectedBombomMode) return 0;
    return selectedBombomMode.price * bombomQuantity;
  }, [selectedBombomMode, bombomQuantity]);

  const centoTotal = useMemo(() => {
    if (!selectedCento) return 0;
    const flavorsCount = selectedCentoFlavorIds.length;
    if (flavorsCount === 0) return 0;
    return selectedCento.unitPrice * centoQuantity * flavorsCount;
  }, [selectedCento, centoQuantity, selectedCentoFlavorIds.length]);

  const selectedBarraSize = useMemo(
    () => BARRAS_FLORIDAS_SIZES.find((size) => size.id === selectedBarraSizeId) ?? BARRAS_FLORIDAS_SIZES[0],
    [selectedBarraSizeId]
  );

  const selectedBarraChocolate = useMemo(
    () =>
      BARRAS_FLORIDAS_CHOCOLATES.find((chocolate) => chocolate.id === selectedBarraChocolateId) ??
      BARRAS_FLORIDAS_CHOCOLATES[0],
    [selectedBarraChocolateId]
  );

  const barraTotal = useMemo(() => {
    if (!selectedBarraSize) return 0;
    return selectedBarraSize.price * barraQuantity;
  }, [selectedBarraSize, barraQuantity]);

  const macaronTotal = useMemo(() => {
    if (!selectedMacaronFlavor) return 0;
    return selectedMacaronFlavor.price * macaronQuantity;
  }, [selectedMacaronFlavor, macaronQuantity]);

  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.lineTotal, 0),
    [cart]
  );

  const badgeCount = useMemo(() => cart.length, [cart]);

  const broadcastCartState = useCallback(
    (open: boolean, count: number) => {
      if (typeof window === "undefined") return;
      window.dispatchEvent(
        new CustomEvent("csg:cart-state", {
          detail: { isOpen: open, badgeCount: count }
        })
      );
    },
    []
  );

  useEffect(() => {
    broadcastCartState(isCartOpen, badgeCount);
  }, [isCartOpen, badgeCount, broadcastCartState]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleExternalToggle = () => setIsCartOpen((prev) => !prev);
    window.addEventListener("csg:toggle-cart", handleExternalToggle);
    return () => window.removeEventListener("csg:toggle-cart", handleExternalToggle);
  }, []);

  const openModal = (bolo: Bolo) => {
    setSelectedDocinho(null);
    setSelectedBombom(null);
    setSelectedCento(null);
    setSelectedBarra(null);
    setSelectedBolo(bolo);
    setQuantity(1);
    setSelectedDecorationIds([]);
  };

  const openDocinhoModal = (docinho: DocinhoProduct) => {
    setSelectedBolo(null);
    setSelectedBombom(null);
    setSelectedCento(null);
    setSelectedBarra(null);
    setSelectedDocinho(docinho);
    setDocinhoQuantity(DOCINHO_MIN_QTY);
    setDocinhoQuantityInput(DOCINHO_MIN_QTY.toString());
    setDocinhoQuantityError("");
    setSelectedFlavorId("");
  };

  const openBombomModal = (bombom: BombomProduct) => {
    setSelectedBolo(null);
    setSelectedDocinho(null);
    setSelectedCento(null);
    setSelectedBarra(null);
    setSelectedBombom(bombom);
    setSelectedBombomModeId("unidades");
    setSelectedBombomFlavorId(BOMBOM_FLAVORS[0]?.id ?? "");
    setBombomQuantity(BOMBOM_MODES[0]?.minQty ?? 35);
    setBombomQuantityInput((BOMBOM_MODES[0]?.minQty ?? 35).toString());
    setBombomQuantityError("");
    setBombomTheme("");
  };

  const openCentoModal = (cento: CentoProduct) => {
    setSelectedBolo(null);
    setSelectedDocinho(null);
    setSelectedBombom(null);
    setSelectedBarra(null);
    setSelectedCento(cento);
    setCentoQuantity(1);
    setCentoQuantityInput("1");
    setSelectedCentoFlavorIds([]);
    setCentoError("");
  };

  const openBarraModal = (barra: BarraProduct) => {
    setSelectedBolo(null);
    setSelectedDocinho(null);
    setSelectedBombom(null);
    setSelectedCento(null);
    setSelectedBarra(barra);
    setSelectedMacaron(null);
    setSelectedBarraSizeId(BARRAS_FLORIDAS_SIZES[0]?.id ?? "mini-30g");
    setSelectedBarraChocolateId(BARRAS_FLORIDAS_CHOCOLATES[0]?.id ?? "ao-leite");
    setBarraQuantity(1);
    setBarraQuantityInput("1");
    setBarraQuantityError("");
  };

  const openMacaronModal = (macaron: MacaronProduct) => {
    setSelectedBolo(null);
    setSelectedDocinho(null);
    setSelectedBombom(null);
    setSelectedCento(null);
    setSelectedBarra(null);
    setSelectedMacaron(macaron);
    setSelectedMacaronFlavorId(MACARON_FLAVORS[0]?.id ?? "");
    setMacaronQuantity(10);
    setMacaronQuantityInput("10");
    setMacaronQuantityError("");
  };

  const toggleDecoration = (id: string) => {
    setSelectedDecorationIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const validateDocinhoQuantity = useCallback(() => {
    const parsed = Number.parseInt(docinhoQuantityInput, 10);
    if (Number.isNaN(parsed) || parsed < DOCINHO_MIN_QTY) {
      setDocinhoQuantity(DOCINHO_MIN_QTY);
      setDocinhoQuantityInput(DOCINHO_MIN_QTY.toString());
      setDocinhoQuantityError("Pedido mínimo de 15 unidades por sabor");
      return DOCINHO_MIN_QTY;
    }
    setDocinhoQuantity(parsed);
    setDocinhoQuantityError("");
    return parsed;
  }, [docinhoQuantityInput]);

  const validateBombomQuantity = useCallback(
    (mode: BombomMode) => {
      const parsed = Number.parseInt(bombomQuantityInput, 10);
      if (Number.isNaN(parsed) || parsed < mode.minQty) {
        setBombomQuantity(mode.minQty);
        setBombomQuantityInput(mode.minQty.toString());
        if (mode.id === "unidades") {
          setBombomQuantityError("Pedido mínimo de 35 unidades por sabor");
        } else {
          setBombomQuantityError("Pedido mínimo de 1 caixinha");
        }
        return mode.minQty;
      }
      setBombomQuantity(parsed);
      setBombomQuantityError("");
      return parsed;
    },
    [bombomQuantityInput]
  );

  const validateCentoQuantity = useCallback(() => {
    const parsed = Number.parseInt(centoQuantityInput, 10);
    if (Number.isNaN(parsed) || parsed < 1) {
      setCentoQuantity(1);
      setCentoQuantityInput("1");
      return 1;
    }
    setCentoQuantity(parsed);
    return parsed;
  }, [centoQuantityInput]);

  const validateBarraQuantity = useCallback(() => {
    const parsed = Number.parseInt(barraQuantityInput, 10);
    if (Number.isNaN(parsed) || parsed < 1) {
      setBarraQuantity(1);
      setBarraQuantityInput("1");
      setBarraQuantityError("Quantidade minima de 1 unidade.");
      return 1;
    }
    setBarraQuantity(parsed);
    setBarraQuantityError("");
    return parsed;
  }, [barraQuantityInput]);

  const validateMacaronQuantity = useCallback(() => {
    const parsed = Number.parseInt(macaronQuantityInput, 10);
    if (Number.isNaN(parsed) || parsed < 10) {
      setMacaronQuantity(10);
      setMacaronQuantityInput("10");
      setMacaronQuantityError("Quantidade minima de 10 unidades.");
      return 10;
    }
    setMacaronQuantity(parsed);
    setMacaronQuantityError("");
    return parsed;
  }, [macaronQuantityInput]);

  const closeModal = () => {
    setSelectedBolo(null);
    setSelectedDocinho(null);
    setSelectedBombom(null);
    setSelectedCento(null);
    setSelectedBarra(null);
    setSelectedMacaron(null);
  };

  const addToCart = () => {
    if (!selectedBolo) return;

    const lineTotal = selectedBolo.basePrice * quantity + selectedDecorationTotal;
    const decorationIds = selectedDecorations.map((item) => item.id).sort();
    const decorationLabels = selectedDecorations.map((item) => item.label);
    const newItem: CartItem = {
      category: "bolo",
      productId: selectedBolo.id,
      productName: selectedBolo.name,
      basePrice: selectedBolo.basePrice,
      quantity,
      decorationIds,
      decorationLabels,
      decorationTotal: selectedDecorationTotal,
      lineTotal,
      detailLines: [`Decoração: ${decorationLabels.length ? decorationLabels.join(", ") : "Nenhuma"}`]
    };

    setCart((prev) => {
      const decorationKey = decorationIds.join("|");
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.decorationIds.join("|") === decorationKey
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
        lineTotal: existing.basePrice * mergedQuantity + existing.decorationTotal
      };
      return updated;
    });

    closeModal();
  };

  const addDocinhoToCart = () => {
    if (!selectedDocinho || !selectedFlavor) return;
    const safeQuantity = validateDocinhoQuantity();
    const lineTotal = selectedFlavor.price * safeQuantity;
    const newItem: CartItem = {
      category: "docinho",
      productId: selectedDocinho.id,
      productName: selectedDocinho.name,
      basePrice: selectedFlavor.price,
      quantity: safeQuantity,
      decorationIds: [selectedFlavor.id],
      decorationLabels: [selectedFlavor.label],
      decorationTotal: 0,
      lineTotal,
      detailLines: [`Sabor: ${selectedFlavor.label}`]
    };

    setCart((prev) => {
      const decorationKey = newItem.decorationIds.join("|");
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.decorationIds.join("|") === decorationKey
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
        lineTotal: existing.basePrice * mergedQuantity
      };
      return updated;
    });

    closeModal();
  };

  const addBombomToCart = () => {
    if (!selectedBombom || !selectedBombomMode || !selectedBombomFlavor) return;
    const safeQuantity = validateBombomQuantity(selectedBombomMode);
    const lineTotal = selectedBombomMode.price * safeQuantity;
    const newItem: CartItem = {
      category: "bombom",
      productId: selectedBombom.id,
      productName: selectedBombom.name,
      basePrice: selectedBombomMode.price,
      quantity: safeQuantity,
      decorationIds: [selectedBombomMode.id, selectedBombomFlavor.id],
      decorationLabels: [selectedBombomMode.label, selectedBombomFlavor.label],
      decorationTotal: 0,
      lineTotal,
      detailLines: [
        `Modalidade: ${selectedBombomMode.label}`,
        `Sabor: ${selectedBombomFlavor.label}`
      ],
      bombomModeLabel: selectedBombomMode.label,
      bombomFlavorLabel: selectedBombomFlavor.label,
      bombomTheme: bombomTheme.trim() || undefined
    };

    setCart((prev) => {
      const decorationKey = newItem.decorationIds.join("|");
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.decorationIds.join("|") === decorationKey &&
          item.bombomTheme === newItem.bombomTheme
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
        lineTotal: existing.basePrice * mergedQuantity
      };
      return updated;
    });

    closeModal();
  };

  const addCentoToCart = () => {
    if (!selectedCento) return;
    const safeQuantity = validateCentoQuantity();
    const selectedFlavors = getCentoFlavors(selectedCento.id).filter((flavor) =>
      selectedCentoFlavorIds.includes(flavor.id)
    );
    if (selectedFlavors.length === 0) {
      setCentoError("Selecione ao menos 1 sabor.");
      return;
    }

    setCentoError("");

    const flavorIds = selectedFlavors.map((flavor) => flavor.id).sort();
    const flavorLabels = selectedFlavors.map((flavor) => flavor.label);
    const lineTotal = selectedCento.unitPrice * safeQuantity * selectedFlavors.length;
    const newItem: CartItem = {
      category: "cento",
      productId: selectedCento.id,
      productName: selectedCento.name,
      basePrice: selectedCento.unitPrice,
      quantity: safeQuantity,
      decorationIds: flavorIds,
      decorationLabels: flavorLabels,
      decorationTotal: 0,
      lineTotal,
      detailLines: [`Sabores: ${flavorLabels.join(", ")}`, `Quantidade por sabor: ${safeQuantity} cento(s)`]
    };

    setCart((prev) => {
      const decorationKey = newItem.decorationIds.join("|");
      const existingIndex = prev.findIndex(
        (item) => item.productId === newItem.productId && item.decorationIds.join("|") === decorationKey
      );
      if (existingIndex === -1) {
        return [...prev, newItem];
      }
      const updated = [...prev];
      const existing = updated[existingIndex];
      const mergedQuantity = existing.quantity + newItem.quantity;
      const flavorsCount = existing.decorationIds.length || 1;
      updated[existingIndex] = {
        ...existing,
        quantity: mergedQuantity,
        lineTotal: existing.basePrice * mergedQuantity * flavorsCount
      };
      return updated;
    });

    closeModal();
  };

  const addBarraToCart = () => {
    if (!selectedBarra || !selectedBarraSize || !selectedBarraChocolate) return;
    const safeQuantity = validateBarraQuantity();
    const lineTotal = selectedBarraSize.price * safeQuantity;
    const newItem: CartItem = {
      category: "barra",
      productId: selectedBarra.id,
      productName: selectedBarra.name,
      basePrice: selectedBarraSize.price,
      quantity: safeQuantity,
      decorationIds: [selectedBarraSize.id, selectedBarraChocolate.id],
      decorationLabels: [selectedBarraSize.label, selectedBarraChocolate.label],
      decorationTotal: 0,
      lineTotal,
      detailLines: [`Tamanho: ${selectedBarraSize.label}`, `Chocolate: ${selectedBarraChocolate.label}`]
    };

    setCart((prev) => {
      const decorationKey = newItem.decorationIds.join("|");
      const existingIndex = prev.findIndex(
        (item) => item.productId === newItem.productId && item.decorationIds.join("|") === decorationKey
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
        lineTotal: existing.basePrice * mergedQuantity
      };
      return updated;
    });

    closeModal();
  };

  const addMacaronToCart = () => {
    if (!selectedMacaron || !selectedMacaronFlavor) return;
    const safeQuantity = validateMacaronQuantity();
    const lineTotal = selectedMacaronFlavor.price * safeQuantity;
    const newItem: CartItem = {
      category: "macaron",
      productId: selectedMacaron.id,
      productName: selectedMacaron.name,
      basePrice: selectedMacaronFlavor.price,
      quantity: safeQuantity,
      decorationIds: [selectedMacaronFlavor.id],
      decorationLabels: [selectedMacaronFlavor.label],
      decorationTotal: 0,
      lineTotal,
      detailLines: [`Sabor: ${selectedMacaronFlavor.label}`]
    };

    setCart((prev) => {
      const decorationKey = newItem.decorationIds.join("|");
      const existingIndex = prev.findIndex(
        (item) => item.productId === newItem.productId && item.decorationIds.join("|") === decorationKey
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
        lineTotal: existing.basePrice * mergedQuantity
      };
      return updated;
    });

    closeModal();
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
      .map((item) => {
        if (item.category === "bombom") {
          const line1 = `${item.quantity}x ${item.bombomModeLabel} - Bombons personalizados.`;
          const line2 = `Sabor: ${item.bombomFlavorLabel}.`;
          const line3 = item.bombomTheme ? `Tema: ${item.bombomTheme}.` : "";
          return [line1, line2, line3].filter(Boolean).join("\n");
        }
        if (item.category === "barra") {
          const details = item.detailLines.map((line) => `- ${line}`).join("\n");
          return `${item.quantity}x ${item.productName}\n${details}`;
        }
        const itemName =
          item.category === "bolo"
            ? `Bolo ${item.productName}`
            : item.category === "macaron"
              ? "Macarons"
              : item.productName;
        const details = item.detailLines.length ? item.detailLines.join("\n  ") : "";
        return `- ${item.quantity}x ${itemName}${details ? `\n  ${details}` : ""}`;
      })
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
      <div className="mx-auto mt-4 mb-10 h-0.5 max-w-3xl rounded-full bg-gradient-to-r from-transparent via-rose-400/80 to-transparent" />

    {activeTab === "bolos" ? (
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {BOLOS.map((bolo) => (
          <button
            key={bolo.id}
            type="button"
            onClick={() => openModal(bolo)}
            className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-white/90 text-left shadow-panel transition duration-500 md:hover:-translate-y-1 md:hover:shadow-2xl"
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
        ))}
      </section>
    ) : null}

    {activeTab === "docinhos" ? (
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <button
          type="button"
          onClick={() => openDocinhoModal(DOCINHO_PRODUCT)}
          className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-white/90 text-left shadow-panel transition duration-500 md:hover:-translate-y-1 md:hover:shadow-2xl"
        >
          <div className="relative h-60 w-full overflow-hidden rounded-t-lg">
            <Image
              src={DOCINHO_PRODUCT.imageUrl}
              alt={`Imagem do ${DOCINHO_PRODUCT.name}`}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h2 className="font-serifDisplay text-2xl text-cocoa-900">{DOCINHO_PRODUCT.name}</h2>
            <p className="mt-2 text-lg text-cocoa-700">{DOCINHO_PRODUCT.description}</p>
            <p className="mt-4 text-lg font-semibold text-cocoa-900">
              A partir de {formatCurrency(minDocinhoPrice)} / unidade
            </p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => openCentoModal(CENTO_18G_PRODUCT)}
          className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-white/90 text-left shadow-panel transition duration-500 md:hover:-translate-y-1 md:hover:shadow-2xl"
        >
          <div className="relative h-60 w-full overflow-hidden rounded-t-lg">
            <Image
              src={CENTO_18G_PRODUCT.imageUrl}
              alt={`Imagem do ${CENTO_18G_PRODUCT.name}`}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h2 className="font-serifDisplay text-2xl text-cocoa-900">{CENTO_18G_PRODUCT.name}</h2>
            <p className="mt-2 text-lg text-cocoa-700">{CENTO_18G_PRODUCT.description}</p>
            <p className="mt-4 text-lg font-semibold text-cocoa-900">{formatCurrency(CENTO_18G_PRODUCT.unitPrice)} / cento (por sabor)</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => openCentoModal(CENTO_13G_PRODUCT)}
          className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-white/90 text-left shadow-panel transition duration-500 md:hover:-translate-y-1 md:hover:shadow-2xl"
        >
          <div className="relative h-60 w-full overflow-hidden rounded-t-lg">
            <Image
              src={CENTO_13G_PRODUCT.imageUrl}
              alt={`Imagem do ${CENTO_13G_PRODUCT.name}`}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h2 className="font-serifDisplay text-2xl text-cocoa-900">{CENTO_13G_PRODUCT.name}</h2>
            <p className="mt-2 text-lg text-cocoa-700">{CENTO_13G_PRODUCT.description}</p>
            <p className="mt-4 text-lg font-semibold text-cocoa-900">
              {formatCurrency(CENTO_13G_PRODUCT.unitPrice)} / cento (por sabor)
            </p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => openBombomModal(BOMBOM_PRODUCT)}
          className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-white/90 text-left shadow-panel transition duration-500 md:hover:-translate-y-1 md:hover:shadow-2xl"
        >
          <div className="relative h-60 w-full overflow-hidden rounded-t-lg">
            <Image
              src={BOMBOM_PRODUCT.imageUrl}
              alt={`Imagem do ${BOMBOM_PRODUCT.name}`}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h2 className="font-serifDisplay text-2xl text-cocoa-900">{BOMBOM_PRODUCT.name}</h2>
            <p className="mt-2 text-lg text-cocoa-700">{BOMBOM_PRODUCT.description}</p>
            <p className="mt-4 text-lg font-semibold text-cocoa-900">A partir de {formatCurrency(minBombomPrice)} / unidade</p>
          </div>
        </button>
      </section>
    ) : null}

    {activeTab === "macarons" ? (
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <button
          type="button"
          onClick={() => openMacaronModal(MACARON_PRODUCT)}
          className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-white/90 text-left shadow-panel transition duration-500 md:hover:-translate-y-1 md:hover:shadow-2xl"
        >
          <div className="relative h-60 w-full overflow-hidden rounded-t-lg">
            <Image
              src={MACARON_PRODUCT.imageUrl}
              alt={`Imagem do ${MACARON_PRODUCT.name}`}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h2 className="font-serifDisplay text-2xl text-cocoa-900">{MACARON_PRODUCT.name}</h2>
            <p className="mt-2 text-lg text-cocoa-700">Macarons artesanais por unidade.</p>
            <p className="mt-2 text-lg text-cocoa-700">Pedido mínimo</p>
            <p className="text-lg text-cocoa-700">10 a 19 unidades: até 2 sabores e 1 cor.</p>
            <p className="text-lg text-cocoa-700">Acima de 20 unidades: até 4 sabores e 2 cores.</p>
            <p className="mt-4 text-lg font-semibold text-cocoa-900">
              A partir de {formatCurrency(minMacaronPrice)} / unidade
            </p>
          </div>
        </button>
      </section>
    ) : null}

    {activeTab === "barras" ? (
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <button
          type="button"
          onClick={() => openBarraModal(BARRAS_FLORIDAS_PRODUCT)}
          className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-white/90 text-left shadow-panel transition duration-500 md:hover:-translate-y-1 md:hover:shadow-2xl"
        >
          <div className="relative h-60 w-full overflow-hidden rounded-t-lg">
            <Image
              src={BARRAS_FLORIDAS_PRODUCT.imageUrl}
              alt={`Imagem do ${BARRAS_FLORIDAS_PRODUCT.name}`}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h2 className="font-serifDisplay text-2xl text-cocoa-900">{BARRAS_FLORIDAS_PRODUCT.name}</h2>
            <p className="mt-2 text-lg text-cocoa-700">{BARRAS_FLORIDAS_PRODUCT.description}</p>
            <p className="mt-4 text-lg font-semibold text-cocoa-900">
              A partir de {formatCurrency(minBarraPrice)} / unidade
            </p>
          </div>
        </button>
      </section>
    ) : null}

    {activeTab !== "bolos" &&
    activeTab !== "docinhos" &&
    activeTab !== "barras" &&
    activeTab !== "macarons" ? (
      <section className="rounded-lg bg-white/70 p-12 text-center text-sm text-cocoa-700 shadow-panel">
        <p className="font-serifBrand text-2xl text-cocoa-900">{activeTabInfo.title}</p>
        <p className="mt-3 text-lg">Estamos preparando novidades exclusivas. Em breve!</p>
      </section>
    ) : null}

      {isCartOpen ? (
        <aside className="fixed right-4 top-24 z-30 h-[min(85vh,calc(100vh-7rem))] w-[min(92vw,380px)] rounded-lg bg-white/95 p-5 shadow-soft backdrop-blur">
          <div className="flex h-full flex-col">
            <div className="relative z-10">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-serifDisplay text-2xl text-cocoa-900">Resumo do pedido</h3>
                <span className="text-sm font-semibold text-cocoa-700">{cart.length} itens</span>
              </div>
            </div>
            <div className="relative z-0 mt-4 flex-1 max-h-[50vh] overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <p className="text-sm text-cocoa-700">Seu carrinho está vazio.</p>
              ) : (
                <ul className="space-y-4 pb-6">
                  {cart.map((item, index) => (
                    <li
                      key={`${item.productId}-${item.decorationIds.join("|")}-${index}`}
                      className="rounded-xl bg-white shadow-md border border-gray-100 p-3"
                    >
                      <p className="text-sm font-semibold text-cocoa-900">
                      {item.quantity}x{" "}
                      {item.category === "bolo"
                        ? `Bolo ${item.productName}`
                        : item.category === "macaron"
                          ? "Macarons"
                          : item.productName}
                      </p>
                      {item.detailLines.map((line) => (
                        <p key={line} className="mt-1 text-xs text-cocoa-700">
                          {line}
                        </p>
                      ))}
                      <p className="mt-1 text-xs text-cocoa-700">Subtotal: {formatCurrency(item.lineTotal)}</p>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-rose-600 md:hover:text-rose-700"
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-4 border-t border-rose-100 pt-4 pb-4">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-cocoa-900">Total geral: {formatCurrency(cartTotal)}</p>
                <label className="block text-base font-bold text-cocoa-900">
                  Nome de quem vai receber o pedido
                  <input
                    type="text"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Digite o nome completo"
                    className="mt-1 h-14 w-full rounded-lg border border-rose-200 px-6 text-lg font-normal placeholder:text-base placeholder:font-normal outline-none ring-cocoa-700/30 focus:ring"
                  />
                </label>
                <label className="block text-base font-bold text-cocoa-900">
                  Data da Retirada / Evento
                  <input
                    type="date"
                    value={eventDate}
                    min={todayISODate()}
                    onChange={(event) => setEventDate(event.target.value)}
                    placeholder="Quando você precisa do pedido?"
                    className="mt-1 h-14 w-[calc(100%-0.5rem)] ml-2 rounded-lg border border-rose-200 px-6 py-2 text-lg leading-none outline-none ring-cocoa-700/30 focus:ring"
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
                  className="inline-flex h-12 md:h-14 w-full items-center justify-center rounded-lg bg-gradient-to-br from-cocoa-700 to-cocoa-900 px-6 text-base md:text-lg font-semibold uppercase tracking-[0.2em] text-white transition md:enabled:hover:from-cocoa-800 md:enabled:hover:to-cocoa-950 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Finalizar pedido
                </button>
              </div>
            </div>
          </div>
        </aside>
      ) : null}

      {selectedBolo ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-cocoa-900/50 p-4">
          <div className="flex w-full max-w-[520px] max-h-[90vh] flex-col rounded-lg bg-white p-6 shadow-soft sm:p-8">
            <div className="flex-1 overflow-y-auto">
              <div className="modal-body flex w-full flex-col gap-4 [&>*]:w-full">
                <div className="relative h-56 w-full overflow-hidden rounded-lg">
                <Image
                  src={selectedBolo.imageUrl}
                  alt={`Imagem do bolo ${selectedBolo.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 540px"
                />
                </div>
                <h2 className="font-serifDisplay text-3xl text-cocoa-900">{selectedBolo.name}</h2>
                <p className="text-lg text-cocoa-700">{selectedBolo.description}</p>
                <p className="text-lg font-semibold text-cocoa-900">
                  Preço base: {formatCurrency(selectedBolo.basePrice)} / 1kg
                </p>

                <label className="block text-base font-bold text-cocoa-700">
                  Quantidade (kg)
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                    className="mt-1 h-14 w-full box-border rounded-lg border border-rose-200 px-6 py-2 text-lg leading-none outline-none ring-cocoa-700/30 focus:ring"
                  />
                </label>

                <div className="text-base font-bold text-cocoa-900">
                  Decoração personalizada
                  <div className="decoracoes mt-3 flex w-full flex-col gap-[10px] pb-5">
                    {DECORATIONS.map((option) => (
                      <label
                        key={option.id}
                        className="decoracao-item w-full text-sm font-normal text-cocoa-700"
                      >
                        <input
                          type="checkbox"
                          checked={selectedDecorationIds.includes(option.id)}
                          onChange={() => toggleDecoration(option.id)}
                          className="decoracao-checkbox h-[18px] w-[18px] shrink-0 rounded border-rose-200 text-cocoa-800 focus:ring-cocoa-700/30"
                        />
                        <span className="flex w-full flex-col">
                          <span className="text-sm font-semibold leading-tight text-cocoa-800">{option.label}</span>
                          {option.extraPrice !== null ? (
                            <span className="mt-0.5 text-xs text-cocoa-600">+ {formatCurrency(option.extraPrice)}</span>
                          ) : null}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-lg font-semibold text-cocoa-900">Total: {formatCurrency(modalTotal)}</p>
              <div className="modal-actions mt-4 flex w-full items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-lg border border-rose-200 px-4 text-base font-semibold uppercase tracking-[0.12em] text-cocoa-800 md:hover:bg-rose-50"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={addToCart}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-lg bg-gradient-to-br from-cocoa-700 to-cocoa-900 px-4 text-base font-semibold uppercase tracking-[0.12em] text-white md:hover:from-cocoa-800 md:hover:to-cocoa-950"
                >
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedDocinho ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-cocoa-900/50 p-4">
          <div className="w-full max-w-lg max-h-[95vh] rounded-lg bg-white p-6 sm:p-8 shadow-soft flex flex-col">
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="relative mb-4 h-56 w-full overflow-hidden rounded-lg">
                <Image
                  src={selectedDocinho.imageUrl}
                  alt={`Imagem do ${selectedDocinho.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 540px"
                />
              </div>
              <h2 className="font-serifDisplay text-3xl text-cocoa-900">{selectedDocinho.name}</h2>
              <p className="mt-2 text-lg text-cocoa-700">{selectedDocinho.description}</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-base font-bold text-cocoa-700">
                  Quantidade (unidades)
                  <input
                    type="number"
                    min={DOCINHO_MIN_QTY}
                    value={docinhoQuantityInput}
                    onChange={(event) => {
                      setDocinhoQuantityInput(event.target.value);
                      setDocinhoQuantityError("");
                    }}
                    onBlur={validateDocinhoQuantity}
                    className="mt-1 h-14 w-[calc(100%-0.5rem)] ml-2 rounded-lg border border-rose-200 px-6 py-2 text-lg leading-none outline-none ring-cocoa-700/30 focus:ring"
                  />
                  {docinhoQuantityError ? (
                    <p className="mt-1 text-xs font-semibold text-rose-700">{docinhoQuantityError}</p>
                  ) : (
                    <p className="mt-1 text-xs font-normal text-cocoa-600">
                      Mínimo de {DOCINHO_MIN_QTY} unidades por pedido.
                    </p>
                  )}
                </label>
                <div className="text-base font-bold text-cocoa-700">
                  Seleção de sabor
                  <div className="mt-3 space-y-2 pb-4">
                    {DOCINHO_FLAVORS.map((flavor) => (
                      <label key={flavor.id} className="flex items-start gap-3 text-sm font-normal text-cocoa-700">
                        <input
                          type="radio"
                          name="docinho-flavor"
                          checked={selectedFlavorId === flavor.id}
                          onChange={() => setSelectedFlavorId(flavor.id)}
                          className="mt-0.5 h-4 w-4 border-rose-200 text-cocoa-800 focus:ring-cocoa-700/30"
                        />
                        <span className="flex flex-col">
                          <span className="text-sm font-semibold text-cocoa-800">{flavor.label}</span>
                          <span className="text-xs text-cocoa-600">{formatCurrency(flavor.price)} / unidade</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-lg font-semibold text-cocoa-900">Total: {formatCurrency(docinhoTotal)}</p>
              <div className="mt-4 flex flex-row gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-lg border border-rose-200 px-4 text-base font-semibold uppercase tracking-[0.12em] text-cocoa-800 md:hover:bg-rose-50"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={addDocinhoToCart}
                  disabled={!selectedFlavor}
                  className="inline-flex h-12 flex-[2] items-center justify-center rounded-lg bg-gradient-to-br from-cocoa-700 to-cocoa-900 px-4 text-base font-semibold uppercase tracking-[0.12em] text-white md:hover:from-cocoa-800 md:hover:to-cocoa-950 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedBombom ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-cocoa-900/50 p-4">
          <div className="w-full max-w-lg max-h-[95vh] rounded-lg bg-white p-6 sm:p-8 shadow-soft flex flex-col">
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="relative mb-4 h-56 w-full overflow-hidden rounded-lg">
                <Image
                  src={selectedBombom.imageUrl}
                  alt={`Imagem do ${selectedBombom.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 540px"
                />
              </div>
              <h2 className="font-serifDisplay text-3xl text-cocoa-900">{selectedBombom.name}</h2>
              <p className="mt-2 text-lg text-cocoa-700">{selectedBombom.description}</p>

              <div className="mt-4 space-y-3">
                <div className="text-base font-bold text-cocoa-700">
                  Modalidade de compra
                  <div className="mt-3 space-y-2">
                    {BOMBOM_MODES.map((mode) => (
                      <label key={mode.id} className="flex items-start gap-3 text-sm font-normal text-cocoa-700">
                        <input
                          type="radio"
                          name="bombom-mode"
                          checked={selectedBombomModeId === mode.id}
                          onChange={() => {
                            setSelectedBombomModeId(mode.id);
                            setBombomQuantity(mode.minQty);
                            setBombomQuantityInput(mode.minQty.toString());
                            setBombomQuantityError("");
                          }}
                          className="mt-0.5 h-4 w-4 border-rose-200 text-cocoa-800 focus:ring-cocoa-700/30"
                        />
                        <span className="flex flex-col">
                          <span className="text-sm font-semibold text-cocoa-800">{mode.label}</span>
                          <span className="text-xs text-cocoa-600">{formatCurrency(mode.price)} por unidade/caixa</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <label className="block text-base font-bold text-cocoa-700">
                  Quantidade
                  <input
                    type="number"
                    min={selectedBombomMode.minQty}
                    value={bombomQuantityInput}
                    onChange={(event) => {
                      setBombomQuantityInput(event.target.value);
                      setBombomQuantityError("");
                    }}
                    onBlur={() => validateBombomQuantity(selectedBombomMode)}
                    className="mt-1 h-14 w-[calc(100%-0.5rem)] ml-2 rounded-lg border border-rose-200 px-6 py-2 text-lg leading-none outline-none ring-cocoa-700/30 focus:ring"
                  />
                  {bombomQuantityError ? (
                    <p className="mt-1 text-xs font-semibold text-rose-700">{bombomQuantityError}</p>
                  ) : (
                    <p className="mt-1 text-xs font-normal text-cocoa-600">
                      {selectedBombomMode.id === "unidades"
                        ? "Mínimo de 35 unidades para encomenda solta."
                        : "Mínimo de 1 caixa por pedido."}
                    </p>
                  )}
                </label>

                <div className="text-base font-bold text-cocoa-700">
                  Seleção de sabor
                  <div className="mt-3 space-y-2">
                    {BOMBOM_FLAVORS.map((flavor) => (
                      <label key={flavor.id} className="flex items-start gap-3 text-sm font-normal text-cocoa-700">
                        <input
                          type="radio"
                          name="bombom-flavor"
                          checked={selectedBombomFlavorId === flavor.id}
                          onChange={() => setSelectedBombomFlavorId(flavor.id)}
                          className="mt-0.5 h-4 w-4 border-rose-200 text-cocoa-800 focus:ring-cocoa-700/30"
                        />
                        <span className="text-sm font-semibold text-cocoa-800">{flavor.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <label className="block text-base font-bold text-cocoa-700">
                  Tema da personalização
                  <textarea
                    value={bombomTheme}
                    onChange={(event) => setBombomTheme(event.target.value)}
                    placeholder="Descreva o tema para personalização"
                    className="mt-1 min-h-[96px] w-[calc(100%-0.5rem)] ml-2 rounded-lg border border-rose-200 px-6 py-3 text-base outline-none ring-cocoa-700/30 focus:ring resize-none"
                  />
                </label>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-lg font-semibold text-cocoa-900">Total: {formatCurrency(bombomTotal)}</p>
              <p className="mt-1 text-xs text-cocoa-600">Consulte valores para quantidades maiores</p>
              <div className="mt-4 flex flex-row gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-lg border border-rose-200 px-4 text-base font-semibold uppercase tracking-[0.12em] text-cocoa-800 md:hover:bg-rose-50"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={addBombomToCart}
                  className="inline-flex h-12 flex-[2] items-center justify-center rounded-lg bg-gradient-to-br from-cocoa-700 to-cocoa-900 px-4 text-base font-semibold uppercase tracking-[0.12em] text-white md:hover:from-cocoa-800 md:hover:to-cocoa-950"
                >
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedCento ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-cocoa-900/50 p-4">
          <div className="w-full max-w-lg max-h-[95vh] rounded-lg bg-white p-6 sm:p-8 shadow-soft flex flex-col">
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="relative mb-4 h-56 w-full overflow-hidden rounded-lg">
                <Image
                  src={selectedCento.imageUrl}
                  alt={`Imagem do ${selectedCento.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 540px"
                />
              </div>
              <h2 className="font-serifDisplay text-3xl text-cocoa-900">{selectedCento.name}</h2>
              <p className="mt-2 text-lg text-cocoa-700">{selectedCento.description}</p>

              <div className="mt-4 space-y-3">
                <label className="block text-base font-bold text-cocoa-700">
                  Quantidade (centos por sabor)
                  <input
                    type="number"
                    min={1}
                    value={centoQuantityInput}
                    onChange={(event) => {
                      setCentoQuantityInput(event.target.value);
                      setCentoError("");
                    }}
                    onBlur={validateCentoQuantity}
                    className="mt-1 h-14 w-[calc(100%-0.5rem)] ml-2 rounded-lg border border-rose-200 px-6 py-2 text-lg leading-none outline-none ring-cocoa-700/30 focus:ring"
                  />
                  <p className="mt-1 text-xs font-normal text-cocoa-600">Cada sabor selecionado corresponde a 100 unidades.</p>
                </label>

                <div className="text-base font-bold text-cocoa-700">
                  Seleção de sabores (até 4)
                  <div className="mt-3 space-y-2 pb-4">
                    {getCentoFlavors(selectedCento.id).map((flavor) => {
                      const checked = selectedCentoFlavorIds.includes(flavor.id);
                      const isAtLimit = selectedCentoFlavorIds.length >= 4;
                      return (
                        <label key={flavor.id} className="flex items-start gap-3 text-sm font-normal text-cocoa-700">
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={!checked && isAtLimit}
                            onChange={() => {
                              setSelectedCentoFlavorIds((prev) => {
                                if (prev.includes(flavor.id)) {
                                  return prev.filter((item) => item !== flavor.id);
                                }
                                if (prev.length >= 4) return prev;
                                return [...prev, flavor.id];
                              });
                              setCentoError("");
                            }}
                            className="mt-0.5 h-4 w-4 rounded border-rose-200 text-cocoa-800 focus:ring-cocoa-700/30 disabled:opacity-50"
                          />
                          <span className="text-sm font-semibold text-cocoa-800">{flavor.label}</span>
                        </label>
                      );
                    })}
                  </div>
                  {centoError ? <p className="text-xs font-semibold text-rose-700">{centoError}</p> : null}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-lg font-semibold text-cocoa-900">Total: {formatCurrency(centoTotal)}</p>
              <div className="mt-4 flex flex-row gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-lg border border-rose-200 px-4 text-base font-semibold uppercase tracking-[0.12em] text-cocoa-800 md:hover:bg-rose-50"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={addCentoToCart}
                  className="inline-flex h-12 flex-[2] items-center justify-center rounded-lg bg-gradient-to-br from-cocoa-700 to-cocoa-900 px-4 text-base font-semibold uppercase tracking-[0.12em] text-white md:hover:from-cocoa-800 md:hover:to-cocoa-950"
                >
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedBarra ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-cocoa-900/50 p-4">
          <div className="w-full max-w-lg max-h-[95vh] rounded-lg bg-white p-6 sm:p-8 shadow-soft flex flex-col">
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="relative mb-4 h-56 w-full overflow-hidden rounded-lg">
                <Image
                  src={selectedBarra.imageUrl}
                  alt={`Imagem do ${selectedBarra.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 540px"
                />
              </div>
              <h2 className="font-serifDisplay text-3xl text-cocoa-900">{selectedBarra.name}</h2>
              <p className="mt-2 text-lg text-cocoa-700">{selectedBarra.description}</p>

              <div className="mt-4 space-y-3 pb-4">
                <div className="text-base font-bold text-cocoa-700">
                  Seleção de tamanho
                  <div className="mt-3 space-y-2">
                    {BARRAS_FLORIDAS_SIZES.map((size) => (
                      <label key={size.id} className="flex items-start gap-3 text-sm font-normal text-cocoa-700">
                        <input
                          type="radio"
                          name="barra-size"
                          checked={selectedBarraSizeId === size.id}
                          onChange={() => setSelectedBarraSizeId(size.id)}
                          className="mt-0.5 h-4 w-4 border-rose-200 text-cocoa-800 focus:ring-cocoa-700/30"
                        />
                        <span className="flex flex-col">
                          <span className="text-sm font-semibold text-cocoa-800">{size.label}</span>
                          <span className="text-xs text-cocoa-600">{formatCurrency(size.price)} / unidade</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="text-base font-bold text-cocoa-700">
                  Seleção de chocolate
                  <div className="mt-3 space-y-2">
                    {BARRAS_FLORIDAS_CHOCOLATES.map((chocolate) => (
                      <label
                        key={chocolate.id}
                        className="flex items-start gap-3 text-sm font-normal text-cocoa-700"
                      >
                        <input
                          type="radio"
                          name="barra-chocolate"
                          checked={selectedBarraChocolateId === chocolate.id}
                          onChange={() => setSelectedBarraChocolateId(chocolate.id)}
                          className="mt-0.5 h-4 w-4 border-rose-200 text-cocoa-800 focus:ring-cocoa-700/30"
                        />
                        <span className="text-sm font-semibold text-cocoa-800">{chocolate.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <label className="block text-base font-bold text-cocoa-700">
                  Quantidade
                  <input
                    type="number"
                    min={1}
                    value={barraQuantityInput}
                    onChange={(event) => {
                      setBarraQuantityInput(event.target.value);
                      setBarraQuantityError("");
                    }}
                    onBlur={validateBarraQuantity}
                    className="mt-1 h-14 w-[calc(100%-0.5rem)] ml-2 rounded-lg border border-rose-200 px-6 py-2 text-lg leading-none outline-none ring-cocoa-700/30 focus:ring"
                  />
                  {barraQuantityError ? (
                    <p className="mt-1 text-xs font-semibold text-rose-700">{barraQuantityError}</p>
                  ) : null}
                </label>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-lg font-semibold text-cocoa-900">Total: {formatCurrency(barraTotal)}</p>
              <div className="mt-4 flex flex-row gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-lg border border-rose-200 px-4 text-base font-semibold uppercase tracking-[0.12em] text-cocoa-800 md:hover:bg-rose-50"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={addBarraToCart}
                  className="inline-flex h-12 flex-[2] items-center justify-center rounded-lg bg-gradient-to-br from-cocoa-700 to-cocoa-900 px-4 text-base font-semibold uppercase tracking-[0.12em] text-white md:hover:from-cocoa-800 md:hover:to-cocoa-950"
                >
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
