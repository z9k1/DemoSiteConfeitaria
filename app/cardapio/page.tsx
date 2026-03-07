"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { brandSettings } from "@/lib/site-data";
import { assetPath } from "@/lib/asset-path";
import { generateOrderId } from "@/lib/order-id";

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
  priceLabel?: string;
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

type BiscoitoFloridoProduct = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  unitPrice: number;
  unitsPerPack: number;
  priceLabel: string;
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

type KitProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

type SimpleProduct = {
  id: string;
  name: string;
  description: string;
  unitPrice: number;
  priceLabel: string;
  imageUrl: string;
};

type CartItem = {
  category: "bolo" | "docinho" | "bombom" | "cento" | "barra" | "macaron" | "biscoito-florido" | "kit" | "simple";
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
const CART_TOAST_EVENT = "csg:cart-toast";

const categoryConfigs = [
  {
    id: "bolos",
    label: "Bolos artesanais",
    title: "Bolos artesanais",
    description: "Cada item corresponde a 1kg e pode ser ajustado pela quantidade escolhida (para bolos).",
    isReady: true
  },
  {
    id: "kits",
    label: "Kits para festa",
    title: "Kits para festa",
    description: "Combinações pensadas para celebrações pequenas e práticas.",
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
    id: "biscoitos-floridos",
    label: "Biscoitos floridos",
    title: "Biscoitos floridos",
    description: "Biscoitos de amêndoas com chocolate branco e flores comestíveis.",
    isReady: true
  },
  {
    id: "embalagens-macarons",
    label: "Embalagens para macarons",
    title: "Embalagens para macarons",
    description: "Caixas e embalagens para presentear macarons.",
    isReady: true
  },
  {
    id: "torres-macarons",
    label: "Torres de macarons",
    title: "Torres de macarons",
    description: "Torres que elevam a mesa de doces.",
    isReady: true
  }
] as const;

type TabId = (typeof categoryConfigs)[number]["id"];

const BOLOS: Bolo[] = [
  {
    id: "ninho-abacaxi",
    name: "Ninho com abacaxi",
    basePrice: 84.9,
    description: "Massa branca e recheio cremoso de leite ninho com compota de abacaxi artesanal",
    imageUrl: assetPath("/images/bolos/nb.jpeg")
  },
  {
    id: "ninho-morangos",
    name: "Ninho com morangos",
    basePrice: 94.9,
    description: "Massa branca e recheio cremoso de leite ninho com morangos frescos ou geleia de morango artesanal",
    imageUrl: assetPath("/images/bolos/nm.jpeg")
  },
  {
    id: "abacaxi-coco",
    name: "Abacaxi com coco",
    basePrice: 84.9,
    description: "Massa branca e recheio de creme 4 leites (leite condensado, creme de leite, leite de coco e leite Ninho) com compota artesanal de abacaxi e beijinho cremoso",
    imageUrl: assetPath("/images/bolos/ac.jpeg")
  },
  {
    id: "limao-frutas-vermelhas",
    name: "Limão siciliano e frutas vermelhas",
    basePrice: 94.9,
    description: "Massa branca com recheio cremoso de brigadeiro de limão siciliano e geleia artesanal de frutas vermelhas",
    imageUrl: assetPath("/images/bolos/lv.jpeg")
  },
  {
    id: "morango-choc-branco",
    name: "Morango com chocolate branco",
    basePrice: 104.9,
    description: "Massa branca com recheio de trufa de chocolate branco e morangos frescos ou geleia de morango artesanal",
    imageUrl: assetPath("/images/bolos/mcb.jpeg")
  },
  {
    id: "brigadeiro",
    name: "Brigadeiro",
    basePrice: 89.9,
    description: "Massa de chocolate e duas camadas de brigadeiro cremoso",
    imageUrl: assetPath("/images/bolos/bb.jpeg")
  },
  {
    id: "maracuja-chocolate",
    name: "Maracujá com chocolate",
    basePrice: 92.9,
    description: "Massa de chocolate com recheio de brigadeiro de maracujá e trufado de chocolate",
    imageUrl: assetPath("/images/bolos/mcc.jpeg")
  },
  {
    id: "prestigio",
    name: "Prestígio",
    basePrice: 88.9,
    description: "Massa de chocolate com recheio trufado de chocolate e beijinho cremoso",
    imageUrl: assetPath("/images/bolos/pp.jpeg")
  },
  {
    id: "ninho-nutella",
    name: "Ninho com Nutella",
    basePrice: 94.9,
    description: "Massa branca com recheio de creme de leite Ninho e creme de Nutella",
    imageUrl: assetPath("/images/bolos/nnn.jpeg")
  },
  {
    id: "kinder-bueno",
    name: "Kinder Bueno",
    basePrice: 100.9,
    description: "Massa branca com recheio de creme Kinder Bueno e creme de Nutella",
    imageUrl: assetPath("/images/bolos/kbz.jpeg")
  },
  {
    id: "chocolate-caramelo",
    name: "Chocolate com Caramelo",
    basePrice: 104.9,
    description: "Massa dark com recheio de trufa de chocolate e caramelo com flor de sal",
    imageUrl: assetPath("/images/bolos/cc.jpeg")
  },
  {
    id: "red-velvet",
    name: "Red Velvet",
    basePrice: 104.9,
    description: "Massa amanteigada de iogurte com recheio de mousse de cream cheese e geleia de frutas vermelhas",
    imageUrl: assetPath("/images/bolos/rv.jpeg")
  },
  {
    id: "nozes-caramelizadas",
    name: "Nozes caramelizadas",
    basePrice: 102.9,
    description: "Massa branca com recheio  trufado de chocolate branco com praliné de nozes caramelizadas",
    imageUrl: assetPath("/images/bolos/nz.jpeg")
  },
  {
    id: "surpresa-uva",
    name: "Surpresa de uva",
    basePrice: 91.9,
    description: "Massa branca com recheio de leite Ninho e uvas verdes sem sementes",
    imageUrl: assetPath("/images/bolos/suv.jpeg")
  },
  {
    id: "morango-chocolate",
    name: "Morango com Chocolate",
    basePrice: 97.9,
    description: "Massa de chocolate com recheio de trufa de chocolate e morangos frescos ou geleia de morango artesanal",
    imageUrl: assetPath("/images/bolos/mmc.jpeg")
  },
  {
    id: "brigadeiro-morangos",
    name: "Brigadeiro com morangos",
    basePrice: 92.9,
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
    "Tamanho ideal para festas. R$ 150,00 / cento, com escolha de até 4 sabores para 100 unidades no total.",
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
    "Docinhos em tamanho tradicional (18g). R$ 220,00 / cento, com escolha de até 4 sabores para 100 unidades no total.",
  imageUrl: assetPath("/images/bolos/doces-finos2.jpeg"),
  unitPrice: 220
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

const CENTO_MACARONS_MINI_PRODUCT: CentoProduct = {
  id: "cento-macarons-mini",
  name: "Cento de Macarons Mini",
  description:
    "Cento de Macarons em tamanho mini (aprox. 3cm cada). Escolha até 5 cores e 5 sabores do nosso cardápio artesanal.",
  imageUrl: assetPath("/images/bolos/macaronscento.jpeg"),
  unitPrice: 400,
  priceLabel: "R$ 400,00 / cento"
};

const CENTO_MACARONS_MINI_FLAVORS: CentoFlavor[] = [
  { id: "brigadeiro-choc-branco", label: "Brigadeiro de chocolate branco" },
  { id: "brigadeiro-meio-amargo", label: "Brigadeiro meio amargo" },
  { id: "coco-amendoas", label: "Coco com amêndoas" },
  { id: "capuccino", label: "Capuccino" },
  { id: "caramelo-flor-de-sal", label: "Caramelo com flor de sal" },
  { id: "creme-brulee", label: "Creme brûlée" },
  { id: "damasco-nozes", label: "Damasco com nozes" },
  { id: "frutas-vermelhas", label: "Frutas vermelhas" },
  { id: "maracuja-chocolate", label: "Maracujá com chocolate" },
  { id: "limao-lavanda", label: "Limão siciliano com lavanda" },
  { id: "morango", label: "Morango" },
  { id: "ninho-nutella", label: "Ninho com Nutella" },
  { id: "pacoca", label: "Paçoca" },
  { id: "pistache", label: "Pistache" }
];

function getCentoFlavors(productId: string): CentoFlavor[] {
  if (productId === CENTO_MACARONS_MINI_PRODUCT.id) return CENTO_MACARONS_MINI_FLAVORS;
  if (productId === CENTO_18G_PRODUCT.id) return CENTO_18G_FLAVORS;
  return CENTO_13G_FLAVORS;
}

const BARRAS_FLORIDAS_PRODUCT: BarraProduct = {
  id: "barras-floridas",
  name: "Barras Floridas",
  description:
    "Barras de chocolate decoradas com flores comestíveis e pedacinhos de macaron. (Observação: a decoração florida não se aplica à barra de limão siciliano com lavanda, que possui receita própria.)",
  imageUrl: assetPath("/images/bolos/barra.jpeg")
};

const BISCOITOS_FLORIDOS_PRODUCT = {
  id: "biscoitos-artesanalmente-floridos",
  name: "Biscoitos artesanalmente floridos",
  description:
    "Biscoitos de amêndoas cobertos com chocolate branco nobre e decorados com flores comestíveis sazonais. Embalados em saquinho. Para outras opções de embalagem, consulte valores.",
  imageUrl: assetPath("/images/bolos/biscoitos.jpeg"),
  unitPrice: 75,
  unitsPerPack: 10,
  priceLabel: "R$ 75,00 / 10 unidades"
} satisfies BiscoitoFloridoProduct;

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

const KIT_FESTA_10_PRODUCT: KitProduct = {
  id: "kit-festa-10-pessoas",
  name: "Kit festa 10 pessoas",
  description:
    "Kit festa para 10 pessoas. Bolo de 1 kg a 1,2 kg + 30 docinhos de 25g. Escolha o sabor do bolo, cobertura, sabores de docinhos e personalize a decoração.",
  price: 160,
  imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
};

const KIT_FESTA_20_PRODUCT: KitProduct = {
  id: "kit-festa-20-pessoas",
  name: "Kit festa 20 pessoas",
  description:
    "Kit festa para 20 pessoas. Bolo de 2 kg a 2,2 kg + 60 docinhos de 25 gramas. Escolha o sabor do bolo, cobertura, sabores de docinhos e personalize a decoração.",
  price: 310,
  imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
};

const KIT_FESTA_30_PRODUCT: KitProduct = {
  id: "kit-festa-30-pessoas",
  name: "Kit festa",
  description:
    "Bolo de 3 kg a 3,2 kg + 90 docinhos de 25 gramas. Escolha o sabor do bolo, cobertura, sabores de docinhos e personalize a decoração.",
  price: 460,
  imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
};

const KIT_FESTA_40_PRODUCT: KitProduct = {
  id: "kit-festa-40-pessoas",
  name: "Kit festa 40 pessoas",
  description:
    "Bolo de 4 kg a 4,2 kg + 120 docinhos de 25 gramas. Escolha o sabor do bolo, cobertura, sabores de docinhos e personalize a decoração.",
  price: 600,
  imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
};

const KIT_FESTA_50_PRODUCT: KitProduct = {
  id: "kit-festa-50-pessoas",
  name: "Kit festa 50 pessoas",
  description:
    "Bolo de 5 kg a 5,2 kg + 150 docinhos de 25 gramas. Escolha o sabor do bolo, cobertura, sabores de docinhos e personalize a decoração.",
  price: 780,
  imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
};

const EMBALAGENS_MACARONS_PRODUCTS: SimpleProduct[] = [
  {
    id: "caixa-acrilica-7x4",
    name: "Caixa acrílica (7cm x 4cm)",
    description: "Acomoda 4 mini macarons*",
    unitPrice: 18,
    priceLabel: "R$ 18,00",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "caixa-acrilica-6x6",
    name: "Caixa acrílica (6cm x 6cm)",
    description: "Acomoda 2 macarons médios",
    unitPrice: 18,
    priceLabel: "R$ 18,00",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "caixa-visor-1",
    name: "Caixa com visor",
    description: "Acomoda 1 macaron médio",
    unitPrice: 10,
    priceLabel: "R$ 10,00",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "caixa-visor-2",
    name: "Caixa com visor",
    description: "Acomoda 2 macarons médios",
    unitPrice: 18,
    priceLabel: "R$ 18,00",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "caixa-visor-3",
    name: "Caixa com visor",
    description: "Acomoda 3 macarons médios",
    unitPrice: 25,
    priceLabel: "R$ 25,00",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "caixa-visor-4",
    name: "Caixa com visor",
    description: "Acomoda 4 macarons médios",
    unitPrice: 30,
    priceLabel: "R$ 30,00",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "caixa-visor-6",
    name: "Caixa com visor",
    description: "Acomoda 6 macarons médios",
    unitPrice: 50,
    priceLabel: "R$ 50,00",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "caixa-visor-7-champanhe",
    name: "Caixa com visor",
    description: "Acomoda 7 macarons médios + champanhe à escolha",
    unitPrice: 110,
    priceLabel: "A partir de R$ 110,00",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  }
];

const TORRES_MACARONS_PRODUCTS: SimpleProduct[] = [
  {
    id: "torre-4-andares",
    name: "Torre de macarons — 4 andares",
    description: "47 macarons | Altura: 15cm | Base: 18cm",
    unitPrice: 395,
    priceLabel: "R$ 395,00",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "torre-5-andares",
    name: "Torre de macarons — 5 andares",
    description: "69 macarons | Altura: 21cm | Base: 20cm",
    unitPrice: 575,
    priceLabel: "R$ 575,00",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "torre-6-andares",
    name: "Torre de macarons — 6 andares",
    description: "95 macarons | Altura: 25cm | Base: 23cm",
    unitPrice: 745,
    priceLabel: "R$ 745,00",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "torre-8-andares",
    name: "Torre de macarons — 8 andares",
    description: "159 macarons | Altura: 35cm | Base: 28cm",
    unitPrice: 1195,
    priceLabel: "R$ 1.195,00",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  },
  {
    id: "torre-10-andares",
    name: "Torre de macarons — 10 andares",
    description: "237 macarons | Altura: 55cm | Base: 33cm",
    unitPrice: 1750,
    priceLabel: "R$ 1.750,00",
    imageUrl: assetPath("/images/bolos/bolo-placeholder.jpg")
  }
];

const KIT_CAKE_FLAVORS = [
  {
    id: "abacaxi-coco",
    label: "Abacaxi com coco",
    description:
      "Massa branca e recheio de creme 4 leites (leite condensado, creme de leite, leite de coco e leite Ninho) com compota artesanal de abacaxi e beijinho cremoso"
  },
  {
    id: "brigadeiro",
    label: "Brigadeiro",
    description: "Massa de chocolate e duas camadas de brigadeiro cremoso ao leite ou meio amargo"
  },
  {
    id: "brigadeiro-morangos",
    label: "Brigadeiro com morangos",
    description: "Massa de chocolate com recheio de brigadeiro e brigadeiro branco com morangos frescos"
  },
  {
    id: "limao-siciliano-frutas-vermelhas",
    label: "Limão siciliano com frutas vermelhas",
    description: "Massa branca com recheio cremoso de brigadeiro de limão siciliano e geleia artesanal de frutas vermelhas"
  },
  {
    id: "maracuja-chocolate",
    label: "Maracujá com chocolate",
    description: "Massa de chocolate com recheio de brigadeiro de maracujá e trufado de chocolate"
  },
  {
    id: "morango-chocolate",
    label: "Morango com Chocolate",
    description: "Massa de chocolate com recheio de trufa de chocolate e morangos frescos ou geleia de morango artesanal"
  },
  {
    id: "morango-chocolate-branco",
    label: "Morango com chocolate branco",
    description: "Massa branca com recheio de trufa de chocolate branco e morangos frescos ou geleia de morango artesanal"
  },
  {
    id: "ninho-abacaxi",
    label: "Ninho com abacaxi",
    description: "Massa branca e recheio cremoso de leite ninho com compota de abacaxi artesanal"
  },
  {
    id: "ninho-morangos",
    label: "Ninho com morangos",
    description: "Massa branca e recheio cremoso de leite ninho com morangos frescos ou geleia de morango artesanal"
  },
  {
    id: "ninho-nutella",
    label: "Ninho com Nutella",
    description: "Massa branca com recheio de creme de leite Ninho e creme de Nutella"
  },
  {
    id: "prestigio",
    label: "Prestígio",
    description: "Massa de chocolate com recheio trufado de chocolate e beijinho cremoso"
  },
  {
    id: "surpresa-uva",
    label: "Surpresa de uva",
    description: "Massa branca com recheio de leite Ninho e uvas verdes sem sementes"
  }
] as const;

type KitCakeFlavorId = (typeof KIT_CAKE_FLAVORS)[number]["id"];

const KIT_COVERINGS = [
  { id: "chantilly", label: "Chantilly" },
  { id: "chantininho", label: "Chantininho" }
] as const;

type KitCoveringId = (typeof KIT_COVERINGS)[number]["id"];

const KIT_DECORATIONS = [
  { id: "flores-comestiveis", label: "Flores comestíveis", price: 25 },
  { id: "macarons-minis", label: "6 macarons minis", price: 25 },
  { id: "macarons-medios", label: "4 macarons médios", price: 25 },
  { id: "topo-chocolate", label: "Topo de chocolate personalizado", price: 30 }
] as const;

const KIT_DOCINHO_OPTIONS = [
  { id: "brigadeiro", label: "Brigadeiro" },
  { id: "beijinho", label: "Beijinho" },
  { id: "casadinho", label: "Casadinho" },
  { id: "churros", label: "Churros" },
  { id: "ninho-nutella", label: "Ninho com Nutella" },
  { id: "pacoca", label: "Paçoca" },
  { id: "surpresa-uva", label: "Surpresa de uva" }
] as const;

const MACARON_PRODUCT: MacaronProduct = {
  id: "macarons",
  name: "Macarons",
  description:
    "Macarons artesanais por unidade.\nPedido mínimo: 10 unidades\n10 a 19 unidades: até 2 sabores e 1 cor\nAcima de 20 unidades: até 4 sabores e 2 cores.",
  imageUrl: assetPath("/images/bolos/macarons.jpeg")
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

function minimumOrderDateISO(daysAhead = 5): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
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
  const [selectedBiscoitoFlorido, setSelectedBiscoitoFlorido] = useState<BiscoitoFloridoProduct | null>(null);
  const [selectedSimpleProduct, setSelectedSimpleProduct] = useState<SimpleProduct | null>(null);
  const [selectedSimpleCategory, setSelectedSimpleCategory] = useState<"embalagens-macarons" | "torres-macarons" | null>(null);
  const [selectedKitProduct, setSelectedKitProduct] = useState<KitProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [quantityInput, setQuantityInput] = useState("1");
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
  const [centoColors, setCentoColors] = useState("");
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

  const [biscoitoFloridoQuantity, setBiscoitoFloridoQuantity] = useState(1);
  const [biscoitoFloridoQuantityInput, setBiscoitoFloridoQuantityInput] = useState("1");
  const [biscoitoFloridoQuantityError, setBiscoitoFloridoQuantityError] = useState("");
  const [simpleQuantity, setSimpleQuantity] = useState(1);
  const [simpleQuantityInput, setSimpleQuantityInput] = useState("1");
  const [simpleQuantityError, setSimpleQuantityError] = useState("");
  const [kitCakeFlavorId, setKitCakeFlavorId] = useState<KitCakeFlavorId>(KIT_CAKE_FLAVORS[0].id);
  const [kitCoveringId, setKitCoveringId] = useState<KitCoveringId>(KIT_COVERINGS[0].id);
  const [kitDecorationIds, setKitDecorationIds] = useState<string[]>([]);
  const [kitDocinhoIds, setKitDocinhoIds] = useState<string[]>([]);
  const [kitDocinhoError, setKitDocinhoError] = useState("");
  const [selectedMacaronFlavorId, setSelectedMacaronFlavorId] = useState("");
  const [cartToastMessage, setCartToastMessage] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [hasHydratedCart, setHasHydratedCart] = useState(false);
  const cartToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const minOrderDate = useMemo(() => minimumOrderDateISO(5), []);
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
    if (!raw) {
      setHasHydratedCart(true);
      return;
    }
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
              item.category === "macaron" ||
              item.category === "biscoito-florido" ||
              item.category === "kit" ||
              item.category === "simple") &&
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
    } finally {
      setHasHydratedCart(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydratedCart) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart, hasHydratedCart]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("openCart") === "1") {
      setIsCartOpen(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (cartToastTimeoutRef.current) {
        clearTimeout(cartToastTimeoutRef.current);
      }
      window.dispatchEvent(new CustomEvent(CART_TOAST_EVENT, { detail: { visible: false } }));
    };
  }, []);

  const isModalOpen = Boolean(
    selectedBolo ||
      selectedDocinho ||
      selectedBombom ||
      selectedCento ||
      selectedBarra ||
      selectedMacaron ||
      selectedBiscoitoFlorido ||
      selectedKitProduct
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

  const validateBoloQuantity = useCallback(() => {
    const parsed = Number.parseInt(quantityInput, 10);
    if (Number.isNaN(parsed) || parsed < 1) {
      setQuantity(1);
      setQuantityInput("1");
      return 1;
    }
    setQuantity(parsed);
    return parsed;
  }, [quantityInput]);

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
    const isFixedPriceCento =
      selectedCento.id === CENTO_MACARONS_MINI_PRODUCT.id ||
      selectedCento.id === CENTO_18G_PRODUCT.id ||
      selectedCento.id === CENTO_13G_PRODUCT.id;
    return selectedCento.unitPrice * centoQuantity * (isFixedPriceCento ? 1 : flavorsCount);
  }, [selectedCento, centoQuantity, selectedCentoFlavorIds.length]);

  const maxCentoFlavors = selectedCento?.id === CENTO_MACARONS_MINI_PRODUCT.id ? 5 : 4;

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

  const biscoitoFloridoTotal = useMemo(() => {
    if (!selectedBiscoitoFlorido) return 0;
    return selectedBiscoitoFlorido.unitPrice * biscoitoFloridoQuantity;
  }, [selectedBiscoitoFlorido, biscoitoFloridoQuantity]);

  const simpleTotal = useMemo(() => {
    if (!selectedSimpleProduct) return 0;
    return selectedSimpleProduct.unitPrice * simpleQuantity;
  }, [selectedSimpleProduct, simpleQuantity]);

  const selectedKitDecorations = useMemo(
    () => KIT_DECORATIONS.filter((item) => kitDecorationIds.includes(item.id)),
    [kitDecorationIds]
  );
  const selectedKitCakeFlavor = useMemo(
    () => KIT_CAKE_FLAVORS.find((item) => item.id === kitCakeFlavorId) ?? KIT_CAKE_FLAVORS[0],
    [kitCakeFlavorId]
  );
  const selectedKitCovering = useMemo(
    () => KIT_COVERINGS.find((item) => item.id === kitCoveringId) ?? KIT_COVERINGS[0],
    [kitCoveringId]
  );
  const selectedKitDocinhos = useMemo(
    () => KIT_DOCINHO_OPTIONS.filter((item) => kitDocinhoIds.includes(item.id)),
    [kitDocinhoIds]
  );
  const kitDecorationTotal = useMemo(
    () => selectedKitDecorations.reduce((sum, item) => sum + item.price, 0),
    [selectedKitDecorations]
  );
  const kitTotal = useMemo(
    () => (selectedKitProduct?.price ?? 0) + kitDecorationTotal,
    [kitDecorationTotal, selectedKitProduct]
  );

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

  const bodyScrollLockRef = useRef<{ overflow: string; paddingRight: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const body = document.body;
    const docEl = document.documentElement;

    if (isCartOpen) {
      if (!bodyScrollLockRef.current) {
        bodyScrollLockRef.current = {
          overflow: body.style.overflow,
          paddingRight: body.style.paddingRight
        };
      }

      // Prevent layout shift when the scrollbar disappears.
      const scrollbarWidth = window.innerWidth - docEl.clientWidth;
      body.style.overflow = "hidden";
      body.style.paddingRight =
        scrollbarWidth > 0 ? `${scrollbarWidth}px` : bodyScrollLockRef.current.paddingRight;
      return;
    }

    if (bodyScrollLockRef.current) {
      body.style.overflow = bodyScrollLockRef.current.overflow;
      body.style.paddingRight = bodyScrollLockRef.current.paddingRight;
      bodyScrollLockRef.current = null;
    }

    return () => {
      if (!bodyScrollLockRef.current) return;
      body.style.overflow = bodyScrollLockRef.current.overflow;
      body.style.paddingRight = bodyScrollLockRef.current.paddingRight;
      bodyScrollLockRef.current = null;
    };
  }, [isCartOpen]);

  const openModal = (bolo: Bolo) => {
    setSelectedDocinho(null);
    setSelectedBombom(null);
    setSelectedCento(null);
    setSelectedBarra(null);
    setSelectedMacaron(null);
    setSelectedBiscoitoFlorido(null);
    setSelectedSimpleProduct(null);
    setSelectedSimpleCategory(null);
    setSelectedBolo(bolo);
    setQuantity(1);
    setQuantityInput("1");
    setSelectedDecorationIds([]);
  };

  const openDocinhoModal = (docinho: DocinhoProduct) => {
    setSelectedBolo(null);
    setSelectedBombom(null);
    setSelectedCento(null);
    setSelectedBarra(null);
    setSelectedMacaron(null);
    setSelectedBiscoitoFlorido(null);
    setSelectedSimpleProduct(null);
    setSelectedSimpleCategory(null);
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
    setSelectedMacaron(null);
    setSelectedBiscoitoFlorido(null);
    setSelectedSimpleProduct(null);
    setSelectedSimpleCategory(null);
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
    setSelectedMacaron(null);
    setSelectedBiscoitoFlorido(null);
    setSelectedSimpleProduct(null);
    setSelectedSimpleCategory(null);
    setSelectedCento(cento);
    setCentoQuantity(1);
    setCentoQuantityInput("1");
    setSelectedCentoFlavorIds([]);
    setCentoError("");
    setCentoColors("");
  };

  const openBarraModal = (barra: BarraProduct) => {
    setSelectedBolo(null);
    setSelectedDocinho(null);
    setSelectedBombom(null);
    setSelectedCento(null);
    setSelectedBarra(barra);
    setSelectedMacaron(null);
    setSelectedBiscoitoFlorido(null);
    setSelectedSimpleProduct(null);
    setSelectedSimpleCategory(null);
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
    setSelectedBiscoitoFlorido(null);
    setSelectedSimpleProduct(null);
    setSelectedSimpleCategory(null);
    setSelectedMacaron(macaron);
    setSelectedMacaronFlavorId(MACARON_FLAVORS[0]?.id ?? "");
    setMacaronQuantity(10);
    setMacaronQuantityInput("10");
    setMacaronQuantityError("");
  };

  const openBiscoitoFloridoModal = (biscoito: BiscoitoFloridoProduct) => {
    setSelectedBolo(null);
    setSelectedDocinho(null);
    setSelectedBombom(null);
    setSelectedCento(null);
    setSelectedBarra(null);
    setSelectedMacaron(null);
    setSelectedSimpleProduct(null);
    setSelectedSimpleCategory(null);
    setSelectedBiscoitoFlorido(biscoito);
    setBiscoitoFloridoQuantity(1);
    setBiscoitoFloridoQuantityInput("1");
    setBiscoitoFloridoQuantityError("");
  };

  const openKitModal = (kit: KitProduct) => {
    setSelectedBolo(null);
    setSelectedDocinho(null);
    setSelectedBombom(null);
    setSelectedCento(null);
    setSelectedBarra(null);
    setSelectedMacaron(null);
    setSelectedBiscoitoFlorido(null);
    setSelectedSimpleProduct(null);
    setSelectedSimpleCategory(null);
    setSelectedKitProduct(kit);
    setKitCakeFlavorId(KIT_CAKE_FLAVORS[0].id);
    setKitCoveringId(KIT_COVERINGS[0].id);
    setKitDecorationIds([]);
    setKitDocinhoIds([]);
    setKitDocinhoError("");
  };

  const openSimpleModal = (
    product: SimpleProduct,
    category: "embalagens-macarons" | "torres-macarons"
  ) => {
    setSelectedBolo(null);
    setSelectedDocinho(null);
    setSelectedBombom(null);
    setSelectedCento(null);
    setSelectedBarra(null);
    setSelectedMacaron(null);
    setSelectedBiscoitoFlorido(null);
    setSelectedKitProduct(null);
    setSelectedSimpleProduct(product);
    setSelectedSimpleCategory(category);
    setSimpleQuantity(1);
    setSimpleQuantityInput("1");
    setSimpleQuantityError("");
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

  const validateBiscoitoFloridoQuantity = useCallback(() => {
    const parsed = Number.parseInt(biscoitoFloridoQuantityInput, 10);
    if (Number.isNaN(parsed) || parsed < 1) {
      setBiscoitoFloridoQuantity(1);
      setBiscoitoFloridoQuantityInput("1");
      setBiscoitoFloridoQuantityError("Quantidade mínima de 1 pacote.");
      return 1;
    }
    setBiscoitoFloridoQuantity(parsed);
    setBiscoitoFloridoQuantityError("");
    return parsed;
  }, [biscoitoFloridoQuantityInput]);

  const validateSimpleQuantity = useCallback(() => {
    const parsed = Number.parseInt(simpleQuantityInput, 10);
    if (Number.isNaN(parsed) || parsed < 1) {
      setSimpleQuantity(1);
      setSimpleQuantityInput("1");
      setSimpleQuantityError("Quantidade mínima de 1 unidade.");
      return 1;
    }
    setSimpleQuantity(parsed);
    setSimpleQuantityError("");
    return parsed;
  }, [simpleQuantityInput]);

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
    setSelectedBiscoitoFlorido(null);
    setSelectedSimpleProduct(null);
    setSelectedSimpleCategory(null);
    setSelectedKitProduct(null);
    setQuantity(1);
    setQuantityInput("1");
  };

  const showCartToast = (productName: string) => {
    if (cartToastTimeoutRef.current) {
      clearTimeout(cartToastTimeoutRef.current);
    }
    setCartToastMessage(`${productName} adicionado ao carrinho.`);
    window.dispatchEvent(new CustomEvent(CART_TOAST_EVENT, { detail: { visible: true } }));
    cartToastTimeoutRef.current = setTimeout(() => {
      setCartToastMessage("");
      window.dispatchEvent(new CustomEvent(CART_TOAST_EVENT, { detail: { visible: false } }));
      cartToastTimeoutRef.current = null;
    }, 1000);
  };

  const addToCart = () => {
    if (!selectedBolo) return;
    const safeQuantity = validateBoloQuantity();

    const lineTotal = selectedBolo.basePrice * safeQuantity + selectedDecorationTotal;
    const decorationIds = selectedDecorations.map((item) => item.id).sort();
    const decorationLabels = selectedDecorations.map((item) => item.label);
    const newItem: CartItem = {
      category: "bolo",
      productId: selectedBolo.id,
      productName: selectedBolo.name,
      basePrice: selectedBolo.basePrice,
      quantity: safeQuantity,
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

    showCartToast(newItem.productName);
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

    showCartToast(newItem.productName);
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

    showCartToast(newItem.productName);
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
    const isFixedPriceCento =
      selectedCento.id === CENTO_MACARONS_MINI_PRODUCT.id ||
      selectedCento.id === CENTO_18G_PRODUCT.id ||
      selectedCento.id === CENTO_13G_PRODUCT.id;
    const lineTotal = selectedCento.unitPrice * safeQuantity * (isFixedPriceCento ? 1 : selectedFlavors.length);
    const detailLines = [
      `Sabores: ${flavorLabels.join(", ")}`,
      `Quantidade: ${safeQuantity} cento(s)`
    ];
    if (selectedCento.id === CENTO_MACARONS_MINI_PRODUCT.id && centoColors.trim()) {
      detailLines.push(`Cores: ${centoColors.trim()}`);
    }

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
      detailLines
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
      const isFixedPriceCento =
        existing.productId === CENTO_MACARONS_MINI_PRODUCT.id ||
        existing.productId === CENTO_18G_PRODUCT.id ||
        existing.productId === CENTO_13G_PRODUCT.id;
      updated[existingIndex] = {
        ...existing,
        quantity: mergedQuantity,
        lineTotal: existing.basePrice * mergedQuantity * (isFixedPriceCento ? 1 : flavorsCount)
      };
      return updated;
    });

    showCartToast(newItem.productName);
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

    showCartToast(newItem.productName);
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

    showCartToast(newItem.productName);
    closeModal();
  };

  const addBiscoitoFloridoToCart = () => {
    if (!selectedBiscoitoFlorido) return;
    const safeQuantity = validateBiscoitoFloridoQuantity();
    const lineTotal = selectedBiscoitoFlorido.unitPrice * safeQuantity;

    const newItem: CartItem = {
      category: "biscoito-florido",
      productId: selectedBiscoitoFlorido.id,
      productName: selectedBiscoitoFlorido.name,
      basePrice: selectedBiscoitoFlorido.unitPrice,
      quantity: safeQuantity,
      decorationIds: [],
      decorationLabels: [],
      decorationTotal: 0,
      lineTotal,
      detailLines: [`Quantidade: ${safeQuantity} pacote(s) de ${selectedBiscoitoFlorido.unitsPerPack} unidades`]
    };

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.productId === newItem.productId);
      if (existingIndex === -1) {
        return [...prev, newItem];
      }
      const updated = [...prev];
      const existing = updated[existingIndex];
      const mergedQuantity = existing.quantity + newItem.quantity;
      updated[existingIndex] = {
        ...existing,
        quantity: mergedQuantity,
        lineTotal: existing.basePrice * mergedQuantity,
        detailLines: [`Quantidade: ${mergedQuantity} pacote(s) de ${selectedBiscoitoFlorido.unitsPerPack} unidades`]
      };
      return updated;
    });

    showCartToast(newItem.productName);
    closeModal();
  };

  const addSimpleToCart = () => {
    if (!selectedSimpleProduct || !selectedSimpleCategory) return;
    const safeQuantity = validateSimpleQuantity();
    const lineTotal = selectedSimpleProduct.unitPrice * safeQuantity;
    const categoryLabel =
      selectedSimpleCategory === "embalagens-macarons"
        ? "Embalagens para macarons"
        : "Torres de macarons";

    const newItem: CartItem = {
      category: "simple",
      productId: selectedSimpleProduct.id,
      productName: selectedSimpleProduct.name,
      basePrice: selectedSimpleProduct.unitPrice,
      quantity: safeQuantity,
      decorationIds: [selectedSimpleCategory],
      decorationLabels: [categoryLabel],
      decorationTotal: 0,
      lineTotal,
      detailLines: [`Categoria: ${categoryLabel}`]
    };

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.decorationIds.join("|") === newItem.decorationIds.join("|")
      );
      if (existingIndex === -1) return [...prev, newItem];

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

    showCartToast(newItem.productName);
    closeModal();
  };

  const addKitToCart = () => {
    if (!selectedKitProduct) return;
    if (kitDocinhoIds.length !== 3) {
      setKitDocinhoError("Selecione exatamente 3 sabores de docinhos.");
      return;
    }

    setKitDocinhoError("");
    const decorationLabels = selectedKitDecorations.map((item) => item.label);
    const docinhoLabels = selectedKitDocinhos.map((item) => item.label);
    const lineBase = selectedKitProduct.price + kitDecorationTotal;
    const lineTotal = lineBase;
    const detailLines = [
      `Sabor do bolo: ${selectedKitCakeFlavor.label}`,
      `Cobertura: ${selectedKitCovering.label}`,
      `Decoração: ${decorationLabels.length ? decorationLabels.join(", ") : "Nenhuma"}`,
      `Docinhos: ${docinhoLabels.join(", ")}`
    ];

    const configKey = [
      kitCakeFlavorId,
      kitCoveringId,
      [...kitDecorationIds].sort().join("|"),
      [...kitDocinhoIds].sort().join("|")
    ].join("::");

    const newItem: CartItem = {
      category: "kit",
      productId: selectedKitProduct.id,
      productName: selectedKitProduct.name,
      basePrice: lineBase,
      quantity: 1,
      decorationIds: [configKey],
      decorationLabels,
      decorationTotal: kitDecorationTotal,
      lineTotal,
      detailLines
    };

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === newItem.productId && item.decorationIds.join("|") === newItem.decorationIds.join("|")
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

    showCartToast(newItem.productName);
    closeModal();
  };

  const removeItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const validateDate = (): boolean => {
    if (!eventDate) return false;
    const inputDate = parseISODate(eventDate);
    const minDate = parseISODate(minOrderDate);
    return inputDate.getTime() >= minDate.getTime();
  };

  const hasValidCustomerName = (value: string): boolean => {
    const normalized = value.trim();
    if (!normalized) return false;
    return /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(normalized);
  };

  const finalizeOrder = () => {
    if (cart.length === 0) return;
    if (!hasValidCustomerName(customerName)) {
      setSubmitError("Informe um nome válido para continuar.");
      return;
    }
    if (!validateDate()) {
      setSubmitError("A data da retirada deve ter no mínimo 5 dias de antecedência.");
      return;
    }

    setSubmitError("");

    const lines = cart
      .map((item) => {
        const itemName =
          item.category === "bolo"
            ? `Bolo ${item.productName}`
            : item.category === "macaron"
              ? "Macarons"
              : item.productName;
        const quantityLabel = item.category === "bolo" ? `${item.quantity} kg` : `${item.quantity}x`;
        const optionLines = item.detailLines.filter((line) => !line.toLowerCase().startsWith("quantidade:"));
        if (item.category === "bombom" && item.bombomTheme) {
          optionLines.push(`Tema: ${item.bombomTheme}`);
        }
        const options = optionLines.length ? `\n${optionLines.map((line) => `  - ${line}`).join("\n")}` : "";
        return `\u2022 ${itemName} (${quantityLabel})${options}`;
      })
      .join("\n\n");

    const formattedEventDate = eventDate ? eventDate.split("-").reverse().join("/") : eventDate;
    const now = new Date();
    const orderId = generateOrderId(now);
    const timestamp = `${new Intl.DateTimeFormat("pt-BR").format(now)} - ${new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(now)}`;
    const message = `*[PEDIDO VIA SITE]*\nID do pedido: ${orderId}\nData do pedido: ${timestamp}\n\n*[ITENS DO PEDIDO]*\n\n${lines}\n\n------------------------------\n\n*[TOTAL ESTIMADO]*\n${formatCurrency(
      cartTotal
    )}\n(Aguardando confirmação de disponibilidade e valor final)\n\n*[DADOS DO CLIENTE]*\nNome: ${customerName.trim()}\nData da retirada/evento: ${formattedEventDate}`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${brandSettings.whatsappNumber}?text=${encoded}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="container-pad py-12">
    <header className="mb-8 min-h-[210px] text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-500">Cardápio na palma da sua mão</p>
      <h1 className="mt-3 font-serifDisplay text-5xl text-cocoa-900">Cardápio</h1>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-cocoa-700">
        Escolha seus produtos, adicione ao carrinho e finalize o pedido pelo WhatsApp.
      </p>
      <p className="mx-auto mt-3 max-w-2xl text-lg text-cocoa-700">
        Doces artesanais para festas e eventos, com pedido rápido e finalização pelo WhatsApp.
      </p>
    </header>

  <div className="mb-10">
    <div className="mx-auto mb-4 h-px max-w-3xl rounded-full bg-gradient-to-r from-transparent via-rose-400/80 to-transparent" />
    <nav className="flex flex-nowrap items-center gap-5 overflow-x-auto whitespace-nowrap px-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:justify-center md:overflow-x-visible md:whitespace-normal md:px-0">
        {categoryConfigs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 border-b-2 pb-2 text-sm font-semibold uppercase tracking-[0.08em] transition md:text-base ${
              activeTab === tab.id
                ? "border-cocoa-900 text-cocoa-900"
                : "border-transparent text-cocoa-600 hover:text-cocoa-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
    </nav>
    <div className="mx-auto mt-4 h-px max-w-3xl rounded-full bg-gradient-to-r from-transparent via-rose-400/80 to-transparent" />
  </div>

    {activeTab === "bolos" ? (
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {BOLOS.map((bolo) => (
          <button
            key={bolo.id}
            type="button"
            onClick={() => openModal(bolo)}
            className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-white/90 text-left shadow-panel transition duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70 md:hover:-translate-y-1 md:hover:shadow-2xl md:hover:ring-1 md:hover:ring-rose-200/70"
          >
            <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
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
              <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                <p className="text-lg font-semibold text-cocoa-900">{formatCurrency(bolo.basePrice)} / 1kg</p>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cocoa-600 transition group-hover:text-cocoa-900">
                  Ver detalhes {"\u2192"}
                </p>
              </div>
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
          className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-white/90 text-left shadow-panel transition duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70 md:hover:-translate-y-1 md:hover:shadow-2xl md:hover:ring-1 md:hover:ring-rose-200/70"
        >
          <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
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
            <div className="mt-auto flex items-end justify-between gap-3 pt-4">
              <p className="text-lg font-semibold text-cocoa-900">
                A partir de {formatCurrency(minDocinhoPrice)} / unidade
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cocoa-600 transition group-hover:text-cocoa-900">
                Ver detalhes {"\u2192"}
              </p>
            </div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => openCentoModal(CENTO_18G_PRODUCT)}
          className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-white/90 text-left shadow-panel transition duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70 md:hover:-translate-y-1 md:hover:shadow-2xl md:hover:ring-1 md:hover:ring-rose-200/70"
        >
          <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
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
            <div className="mt-auto flex items-end justify-between gap-3 pt-4">
              <p className="text-lg font-semibold text-cocoa-900">{formatCurrency(CENTO_18G_PRODUCT.unitPrice)} / cento</p>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cocoa-600 transition group-hover:text-cocoa-900">
                Ver detalhes {"\u2192"}
              </p>
            </div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => openCentoModal(CENTO_13G_PRODUCT)}
          className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-white/90 text-left shadow-panel transition duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70 md:hover:-translate-y-1 md:hover:shadow-2xl md:hover:ring-1 md:hover:ring-rose-200/70"
        >
          <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
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
            <div className="mt-auto flex items-end justify-between gap-3 pt-4">
              <p className="text-lg font-semibold text-cocoa-900">{formatCurrency(CENTO_13G_PRODUCT.unitPrice)} / cento</p>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cocoa-600 transition group-hover:text-cocoa-900">
                Ver detalhes {"\u2192"}
              </p>
            </div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => openBombomModal(BOMBOM_PRODUCT)}
          className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-white/90 text-left shadow-panel transition duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70 md:hover:-translate-y-1 md:hover:shadow-2xl md:hover:ring-1 md:hover:ring-rose-200/70"
        >
          <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
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
            <div className="mt-auto flex items-end justify-between gap-3 pt-4">
              <p className="text-lg font-semibold text-cocoa-900">
                A partir de {formatCurrency(minBombomPrice)} / unidade
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cocoa-600 transition group-hover:text-cocoa-900">
                Ver detalhes {"\u2192"}
              </p>
            </div>
          </div>
        </button>
      </section>
    ) : null}

    {activeTab === "macarons" ? (
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <button
          type="button"
          onClick={() => openMacaronModal(MACARON_PRODUCT)}
          className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-white/90 text-left shadow-panel transition duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70 md:hover:-translate-y-1 md:hover:shadow-2xl md:hover:ring-1 md:hover:ring-rose-200/70"
        >
          <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
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
            <p className="mt-2 whitespace-pre-line text-lg text-cocoa-700">
              {MACARON_PRODUCT.description}
            </p>
            <div className="mt-auto flex items-end justify-between gap-3 pt-4">
              <p className="text-lg font-semibold text-cocoa-900">
                A partir de {formatCurrency(minMacaronPrice)} / unidade
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cocoa-600 transition group-hover:text-cocoa-900">
                Ver detalhes {"\u2192"}
              </p>
            </div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => openCentoModal(CENTO_MACARONS_MINI_PRODUCT)}
          className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-white/90 text-left shadow-panel transition duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70 md:hover:-translate-y-1 md:hover:shadow-2xl md:hover:ring-1 md:hover:ring-rose-200/70"
        >
          <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
            <Image
              src={CENTO_MACARONS_MINI_PRODUCT.imageUrl}
              alt={`Imagem do ${CENTO_MACARONS_MINI_PRODUCT.name}`}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h2 className="font-serifDisplay text-2xl text-cocoa-900">{CENTO_MACARONS_MINI_PRODUCT.name}</h2>
            <p className="mt-2 text-lg text-cocoa-700">{CENTO_MACARONS_MINI_PRODUCT.description}</p>
            <div className="mt-auto flex items-end justify-between gap-3 pt-4">
              <p className="text-lg font-semibold text-cocoa-900">
                {CENTO_MACARONS_MINI_PRODUCT.priceLabel ??
                  `${formatCurrency(CENTO_MACARONS_MINI_PRODUCT.unitPrice)} / cento (por sabor)`}
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cocoa-600 transition group-hover:text-cocoa-900">
                Ver detalhes {"\u2192"}
              </p>
            </div>
          </div>
        </button>
      </section>
    ) : null}

    {activeTab === "barras" ? (
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <button
          type="button"
          onClick={() => openBarraModal(BARRAS_FLORIDAS_PRODUCT)}
          className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-white/90 text-left shadow-panel transition duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70 md:hover:-translate-y-1 md:hover:shadow-2xl md:hover:ring-1 md:hover:ring-rose-200/70"
        >
          <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
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
            <div className="mt-auto flex items-end justify-between gap-3 pt-4">
              <p className="text-lg font-semibold text-cocoa-900">
                A partir de {formatCurrency(minBarraPrice)} / unidade
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cocoa-600 transition group-hover:text-cocoa-900">
                Ver detalhes {"\u2192"}
              </p>
            </div>
          </div>
        </button>
      </section>
    ) : null}

    {activeTab === "biscoitos-floridos" ? (
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <button
          type="button"
          onClick={() => openBiscoitoFloridoModal(BISCOITOS_FLORIDOS_PRODUCT)}
          className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-white/90 text-left shadow-panel transition duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70 md:hover:-translate-y-1 md:hover:shadow-2xl md:hover:ring-1 md:hover:ring-rose-200/70"
        >
          <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
            <Image
              src={BISCOITOS_FLORIDOS_PRODUCT.imageUrl}
              alt={`Imagem do ${BISCOITOS_FLORIDOS_PRODUCT.name}`}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h2 className="font-serifDisplay text-2xl text-cocoa-900">{BISCOITOS_FLORIDOS_PRODUCT.name}</h2>
            <p className="mt-2 text-lg text-cocoa-700">{BISCOITOS_FLORIDOS_PRODUCT.description}</p>
            <div className="mt-auto flex items-end justify-between gap-3 pt-4">
              <p className="text-lg font-semibold text-cocoa-900">{BISCOITOS_FLORIDOS_PRODUCT.priceLabel}</p>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cocoa-600 transition group-hover:text-cocoa-900">
                Ver detalhes {"\u2192"}
              </p>
            </div>
          </div>
        </button>
      </section>
    ) : null}

    {activeTab === "embalagens-macarons" ? (
      <section className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {EMBALAGENS_MACARONS_PRODUCTS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openSimpleModal(item, "embalagens-macarons")}
              className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-white/90 text-left shadow-panel transition duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70 md:hover:-translate-y-1 md:hover:shadow-2xl md:hover:ring-1 md:hover:ring-rose-200/70"
            >
              <div className="relative h-60 w-full overflow-hidden rounded-t-lg">
                <Image
                  src={item.imageUrl}
                  alt={`Imagem da ${item.name}`}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-serifDisplay text-2xl text-cocoa-900">{item.name}</h2>
                <p className="mt-2 text-lg text-cocoa-700">{item.description}</p>
                <p className="mt-1 text-xs text-cocoa-500">*consultar valor do mini macaron</p>
                <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                  <p className="text-lg font-semibold text-cocoa-900">{item.priceLabel}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cocoa-600 transition group-hover:text-cocoa-900">
                    Ver detalhes {"\u2192"}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    ) : null}

    {activeTab === "torres-macarons" ? (
      <section className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TORRES_MACARONS_PRODUCTS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openSimpleModal(item, "torres-macarons")}
              className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-white/90 text-left shadow-panel transition duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70 md:hover:-translate-y-1 md:hover:shadow-2xl md:hover:ring-1 md:hover:ring-rose-200/70"
            >
              <div className="relative h-60 w-full overflow-hidden rounded-t-lg">
                <Image
                  src={item.imageUrl}
                  alt={`Imagem da ${item.name}`}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-serifDisplay text-2xl text-cocoa-900">{item.name}</h2>
                <p className="mt-2 text-lg text-cocoa-700">{item.description}</p>
                <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                  <p className="text-lg font-semibold text-cocoa-900">{item.priceLabel}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cocoa-600 transition group-hover:text-cocoa-900">
                    Ver detalhes {"\u2192"}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    ) : null}

    {activeTab === "kits" ? (
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[KIT_FESTA_10_PRODUCT, KIT_FESTA_20_PRODUCT, KIT_FESTA_30_PRODUCT, KIT_FESTA_40_PRODUCT, KIT_FESTA_50_PRODUCT].map((kit) => (
          <button
            key={kit.id}
            type="button"
            onClick={() => openKitModal(kit)}
            className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-white/90 text-left shadow-panel transition duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70 md:hover:-translate-y-1 md:hover:shadow-2xl md:hover:ring-1 md:hover:ring-rose-200/70"
          >
            <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
              <Image
                src={kit.imageUrl}
                alt={`Imagem do ${kit.name}`}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h2 className="font-serifDisplay text-2xl text-cocoa-900">{kit.name}</h2>
              <p className="mt-2 text-lg text-cocoa-700">{kit.description}</p>
              <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                <p className="text-lg font-semibold text-cocoa-900">{formatCurrency(kit.price)}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cocoa-600 transition group-hover:text-cocoa-900">
                  Ver detalhes {"\u2192"}
                </p>
              </div>
            </div>
          </button>
        ))}
      </section>
    ) : null}

    {activeTab !== "bolos" &&
    activeTab !== "docinhos" &&
    activeTab !== "barras" &&
    activeTab !== "macarons" &&
    activeTab !== "biscoitos-floridos" &&
    activeTab !== "embalagens-macarons" &&
    activeTab !== "torres-macarons" &&
    activeTab !== "kits" ? (
      <section className="rounded-lg bg-white/70 p-12 text-center text-sm text-cocoa-700 shadow-panel">
        <p className="font-serifBrand text-2xl text-cocoa-900">{activeTabInfo.title}</p>
        <p className="mt-3 text-lg">Estamos preparando novidades exclusivas. Em breve!</p>
      </section>
    ) : null}

      {isCartOpen ? (
        <aside className="fixed inset-0 z-10 h-screen w-screen overflow-hidden bg-white/95 px-5 pb-5 shadow-soft backdrop-blur sm:px-6 sm:pb-6">
          <div className="flex h-full flex-col pt-14">
            <div className="relative z-10 pt-3">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-serifDisplay text-2xl text-cocoa-900">Resumo do pedido</h3>
                <span className="text-sm font-semibold text-cocoa-700">
                  {cart.length} {cart.length === 1 ? "item" : "itens"}
                </span>
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
                      {item.category === "bolo" ? (
                        <div>
                          <p className="text-sm font-semibold text-cocoa-900">{`Bolo ${item.productName}`}</p>
                          <p className="mt-0.5 text-xs font-semibold text-cocoa-700">{`${item.quantity} kg`}</p>
                        </div>
                      ) : (
                        <p className="text-sm font-semibold text-cocoa-900">
                          {`${item.quantity}x ${item.category === "macaron" ? "Macarons" : item.productName}`}
                        </p>
                      )}
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
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cocoa-700">Total geral</p>
                  <p className="mt-1 text-2xl font-bold leading-none text-cocoa-900">{formatCurrency(cartTotal)}</p>
                </div>
                <label className="block text-base font-bold text-cocoa-900">
                  Nome de quem vai retirar o pedido
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
                    min={minOrderDate}
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
                    value={quantityInput}
                    onChange={(event) => setQuantityInput(event.target.value)}
                    onBlur={validateBoloQuantity}
                    className="mt-1 h-14 w-full box-border rounded-lg border border-rose-200 px-6 py-2 text-lg leading-none outline-none ring-cocoa-700/20 focus:ring-1"
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

            <div className="mt-4 shrink-0 border-t border-rose-100 bg-white pt-4">
              <p className="text-2xl font-bold tracking-tight text-cocoa-900 sm:text-[1.75rem]">Total: {formatCurrency(modalTotal)}</p>
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
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-lg bg-gradient-to-br from-cocoa-700 to-cocoa-900 px-4 py-2 text-center text-sm font-semibold uppercase leading-tight tracking-[0.08em] text-white whitespace-normal sm:h-12 sm:py-0 sm:text-base sm:whitespace-nowrap sm:tracking-[0.12em] md:hover:from-cocoa-800 md:hover:to-cocoa-950"
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
                    className="mt-1 h-14 w-full box-border rounded-lg border border-rose-200 px-6 py-2 text-lg leading-none outline-none ring-cocoa-700/20 focus:ring-1"
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

            <div className="mt-4 shrink-0 border-t border-rose-100 bg-white pt-4">
              <p className="text-2xl font-bold tracking-tight text-cocoa-900 sm:text-[1.75rem]">Total: {formatCurrency(docinhoTotal)}</p>
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
                  className="inline-flex min-h-[48px] flex-[2] items-center justify-center rounded-lg bg-gradient-to-br from-cocoa-700 to-cocoa-900 px-4 py-2 text-center text-sm font-semibold uppercase leading-tight tracking-[0.08em] text-white whitespace-normal sm:h-12 sm:py-0 sm:text-base sm:whitespace-nowrap sm:tracking-[0.12em] md:hover:from-cocoa-800 md:hover:to-cocoa-950 disabled:cursor-not-allowed disabled:opacity-50"
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
                    className="mt-1 h-14 w-full box-border rounded-lg border border-rose-200 px-6 py-2 text-lg leading-none outline-none ring-cocoa-700/20 focus:ring-1"
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

            <div className="mt-4 shrink-0 border-t border-rose-100 bg-white pt-4">
              <p className="text-2xl font-bold tracking-tight text-cocoa-900 sm:text-[1.75rem]">Total: {formatCurrency(bombomTotal)}</p>
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
                  className="inline-flex min-h-[48px] flex-[2] items-center justify-center rounded-lg bg-gradient-to-br from-cocoa-700 to-cocoa-900 px-4 py-2 text-center text-sm font-semibold uppercase leading-tight tracking-[0.08em] text-white whitespace-normal sm:h-12 sm:py-0 sm:text-base sm:whitespace-nowrap sm:tracking-[0.12em] md:hover:from-cocoa-800 md:hover:to-cocoa-950"
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
                  Quantidade (centos)
                  <input
                    type="number"
                    min={1}
                    value={centoQuantityInput}
                    onChange={(event) => {
                      setCentoQuantityInput(event.target.value);
                      setCentoError("");
                    }}
                    onBlur={validateCentoQuantity}
                    className="mt-1 h-14 w-full box-border rounded-lg border border-rose-200 px-6 py-2 text-lg leading-none outline-none ring-cocoa-700/20 focus:ring-1"
                  />
                  <p className="mt-1 text-xs font-normal text-cocoa-600">Cada pedido corresponde a 100 unidades no total.</p>
                </label>

                <div className="text-base font-bold text-cocoa-700">
                  Seleção de sabores (até {maxCentoFlavors})
                  <div className="mt-3 space-y-2 pb-4">
                    {getCentoFlavors(selectedCento.id).map((flavor) => {
                      const checked = selectedCentoFlavorIds.includes(flavor.id);
                      const isAtLimit = selectedCentoFlavorIds.length >= maxCentoFlavors;
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
                                if (prev.length >= maxCentoFlavors) return prev;
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
                  {selectedCento.id === CENTO_MACARONS_MINI_PRODUCT.id ? (
                    <label className="mt-2 block text-base font-bold text-cocoa-700">
                      Cores (até 5)
                      <input
                        type="text"
                        value={centoColors}
                        onChange={(event) => setCentoColors(event.target.value)}
                        placeholder="Ex: rosa, branco, verde, dourado, lilás"
                        className="mt-1 h-14 w-full box-border rounded-lg border border-rose-200 px-6 py-2 text-lg leading-none outline-none ring-cocoa-700/20 focus:ring-1"
                      />
                    </label>
                  ) : null}
                  {centoError ? <p className="text-xs font-semibold text-rose-700">{centoError}</p> : null}
                </div>
              </div>
            </div>

            <div className="mt-4 shrink-0 border-t border-rose-100 bg-white pt-4">
              <p className="text-2xl font-bold tracking-tight text-cocoa-900 sm:text-[1.75rem]">Total: {formatCurrency(centoTotal)}</p>
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
                  className="inline-flex min-h-[48px] flex-[2] items-center justify-center rounded-lg bg-gradient-to-br from-cocoa-700 to-cocoa-900 px-4 py-2 text-center text-sm font-semibold uppercase leading-tight tracking-[0.08em] text-white whitespace-normal sm:h-12 sm:py-0 sm:text-base sm:whitespace-nowrap sm:tracking-[0.12em] md:hover:from-cocoa-800 md:hover:to-cocoa-950"
                >
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedMacaron ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-cocoa-900/50 p-4">
          <div className="w-full max-w-lg max-h-[95vh] rounded-lg bg-white p-6 sm:p-8 shadow-soft flex flex-col">
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="relative mb-4 h-56 w-full overflow-hidden rounded-lg">
                <Image
                  src={selectedMacaron.imageUrl}
                  alt={`Imagem do ${selectedMacaron.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 540px"
                />
              </div>
              <h2 className="font-serifDisplay text-3xl text-cocoa-900">{selectedMacaron.name}</h2>
              <div className="mt-3 rounded-lg bg-rose-50/70 px-4 py-3 text-sm text-cocoa-700 space-y-1">
                <p className="font-semibold text-cocoa-900">Macarons artesanais por unidade.</p>
                <p>Pedido mínimo: 10 unidades</p>
                <p>10 a 19 unidades: até 2 sabores e 1 cor</p>
                <p>Acima de 20 unidades: até 4 sabores e 2 cores.</p>
              </div>

              <div className="mt-4 space-y-3">
                <label className="block text-base font-bold text-cocoa-700">
                  Quantidade (unidades)
                  <input
                    type="number"
                    min={10}
                    value={macaronQuantityInput}
                    onChange={(event) => {
                      setMacaronQuantityInput(event.target.value);
                      setMacaronQuantityError("");
                    }}
                    onBlur={validateMacaronQuantity}
                    className="mt-1 h-14 w-full box-border rounded-lg border border-rose-200 px-6 py-2 text-lg leading-none outline-none ring-cocoa-700/20 focus:ring-1"
                  />
                  {macaronQuantityError ? (
                    <p className="mt-1 text-xs font-semibold text-rose-700">{macaronQuantityError}</p>
                  ) : null}
                </label>

                <div className="text-base font-bold text-cocoa-700">
                  Sabores disponíveis
                  <div className="mt-3 space-y-2 pb-2">
                    {MACARON_FLAVORS.map((flavor) => (
                      <label key={flavor.id} className="flex items-start gap-3 text-sm font-normal text-cocoa-700">
                        <input
                          type="radio"
                          name="macaron-flavor"
                          checked={selectedMacaronFlavorId === flavor.id}
                          onChange={() => setSelectedMacaronFlavorId(flavor.id)}
                          className="mt-0.5 h-4 w-4 rounded-full border-rose-200 text-cocoa-800 focus:ring-cocoa-700/30"
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

            <div className="mt-4 shrink-0 border-t border-rose-100 bg-white pt-4">
              <p className="text-2xl font-bold tracking-tight text-cocoa-900 sm:text-[1.75rem]">Total: {formatCurrency(macaronTotal)}</p>
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
                  onClick={addMacaronToCart}
                  disabled={Boolean(macaronQuantityError) || !selectedMacaronFlavor}
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-lg bg-gradient-to-br from-cocoa-700 to-cocoa-900 px-4 py-2 text-center text-xs font-semibold uppercase leading-tight tracking-[0.08em] text-white whitespace-normal transition sm:h-12 sm:py-0 sm:text-sm sm:whitespace-nowrap sm:tracking-[0.12em] md:hover:from-cocoa-800 md:hover:to-cocoa-950 disabled:cursor-not-allowed disabled:opacity-50"
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
                    className="mt-1 h-14 w-full box-border rounded-lg border border-rose-200 px-6 py-2 text-lg leading-none outline-none ring-cocoa-700/20 focus:ring-1"
                  />
                  {barraQuantityError ? (
                    <p className="mt-1 text-xs font-semibold text-rose-700">{barraQuantityError}</p>
                  ) : null}
                </label>
              </div>
            </div>

            <div className="mt-4 shrink-0 border-t border-rose-100 bg-white pt-4">
              <p className="text-2xl font-bold tracking-tight text-cocoa-900 sm:text-[1.75rem]">Total: {formatCurrency(barraTotal)}</p>
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
                  className="inline-flex min-h-[48px] flex-[2] items-center justify-center rounded-lg bg-gradient-to-br from-cocoa-700 to-cocoa-900 px-4 py-2 text-center text-sm font-semibold uppercase leading-tight tracking-[0.08em] text-white whitespace-normal sm:h-12 sm:py-0 sm:text-base sm:whitespace-nowrap sm:tracking-[0.12em] md:hover:from-cocoa-800 md:hover:to-cocoa-950"
                >
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedBiscoitoFlorido ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-cocoa-900/50 p-4">
          <div className="w-full max-w-lg max-h-[95vh] rounded-lg bg-white p-6 sm:p-8 shadow-soft flex flex-col">
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="relative mb-4 h-56 w-full overflow-hidden rounded-lg">
                <Image
                  src={selectedBiscoitoFlorido.imageUrl}
                  alt={`Imagem do ${selectedBiscoitoFlorido.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 540px"
                />
              </div>
              <h2 className="font-serifDisplay text-3xl text-cocoa-900">{selectedBiscoitoFlorido.name}</h2>
              <p className="mt-2 text-lg text-cocoa-700">{selectedBiscoitoFlorido.description}</p>

              <div className="mt-4 space-y-3 pb-4">
                <label className="block text-base font-bold text-cocoa-700">
                  Quantidade (pacotes)
                  <input
                    type="number"
                    min={1}
                    value={biscoitoFloridoQuantityInput}
                    onChange={(event) => {
                      setBiscoitoFloridoQuantityInput(event.target.value);
                      setBiscoitoFloridoQuantityError("");
                    }}
                    onBlur={validateBiscoitoFloridoQuantity}
                    className="mt-1 h-14 w-full box-border rounded-lg border border-rose-200 px-6 py-2 text-lg leading-none outline-none ring-cocoa-700/20 focus:ring-1"
                  />
                  {biscoitoFloridoQuantityError ? (
                    <p className="mt-1 text-xs font-semibold text-rose-700">{biscoitoFloridoQuantityError}</p>
                  ) : (
                    <p className="mt-1 text-xs font-normal text-cocoa-600">Cada pacote corresponde a 10 unidades.</p>
                  )}
                </label>
              </div>
            </div>

            <div className="mt-4 shrink-0 border-t border-rose-100 bg-white pt-4">
              <p className="text-2xl font-bold tracking-tight text-cocoa-900 sm:text-[1.75rem]">Total: {formatCurrency(biscoitoFloridoTotal)}</p>
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
                  onClick={addBiscoitoFloridoToCart}
                  className="inline-flex min-h-[48px] flex-[2] items-center justify-center rounded-lg bg-gradient-to-br from-cocoa-700 to-cocoa-900 px-4 py-2 text-center text-sm font-semibold uppercase leading-tight tracking-[0.08em] text-white whitespace-normal sm:h-12 sm:py-0 sm:text-base sm:whitespace-nowrap sm:tracking-[0.12em] md:hover:from-cocoa-800 md:hover:to-cocoa-950"
                >
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedSimpleProduct ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-cocoa-900/50 p-4">
          <div className="w-full max-w-lg max-h-[95vh] rounded-lg bg-white p-6 sm:p-8 shadow-soft flex flex-col">
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="relative mb-4 h-56 w-full overflow-hidden rounded-lg">
                <Image
                  src={selectedSimpleProduct.imageUrl}
                  alt={`Imagem do ${selectedSimpleProduct.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 540px"
                />
              </div>
              <h2 className="font-serifDisplay text-3xl text-cocoa-900">{selectedSimpleProduct.name}</h2>
              <p className="mt-2 text-lg text-cocoa-700">{selectedSimpleProduct.description}</p>
              <p className="mt-2 text-lg font-semibold text-cocoa-900">{selectedSimpleProduct.priceLabel}</p>
              {selectedSimpleCategory === "embalagens-macarons" ? (
                <div className="mt-3 rounded-lg bg-rose-50/35 p-4 text-sm text-cocoa-700">
                  <p className="font-semibold text-cocoa-900">Informações importantes</p>
                  <p className="mt-2 text-sm">
                    Presenteie seus funcionários ou componha a caixa de convite de padrinhos.
                  </p>
                  <p className="mt-1 text-sm text-cocoa-700">
                    Para caixas de até 4 macarons, o pedido mínimo é de 10 caixinhas.
                  </p>
                  <p className="mt-1 text-sm text-cocoa-700">
                    Valores com TAG e fita inclusos.
                  </p>
                </div>
              ) : null}
              {selectedSimpleCategory === "torres-macarons" ? (
                <p className="mt-2 text-sm text-cocoa-700">
                  Caso haja devolução do suporte em perfeito estado, haverá estorno de R$90,00.
                </p>
              ) : null}

              <div className="mt-4 space-y-3">
                <label className="flex flex-col gap-1 text-base font-bold text-cocoa-700">
                  Quantidade
                  <input
                    type="number"
                    min={1}
                    value={simpleQuantityInput}
                    onChange={(event) => setSimpleQuantityInput(event.target.value)}
                    onBlur={validateSimpleQuantity}
                    className="h-14 py-2 ml-2 w-[calc(100%-0.5rem)] rounded-lg border border-rose-200 px-6 text-lg outline-none ring-cocoa-700/20 focus:ring-1"
                  />
                  {simpleQuantityError ? (
                    <p className="mt-1 text-xs font-semibold text-rose-700">{simpleQuantityError}</p>
                  ) : null}
                </label>
              </div>
            </div>

            <div className="mt-4 shrink-0 border-t border-rose-100 bg-white pt-4">
              <p className="text-2xl font-bold tracking-tight text-cocoa-900 sm:text-[1.75rem]">Total: {formatCurrency(simpleTotal)}</p>
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
                  onClick={addSimpleToCart}
                  className="inline-flex min-h-[48px] flex-[2] items-center justify-center rounded-lg bg-gradient-to-br from-cocoa-700 to-cocoa-900 px-4 py-2 text-center text-sm font-semibold uppercase leading-tight tracking-[0.08em] text-white whitespace-normal sm:h-12 sm:py-0 sm:text-base sm:whitespace-nowrap sm:tracking-[0.12em] md:hover:from-cocoa-800 md:hover:to-cocoa-950"
                >
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedKitProduct ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-cocoa-900/50 p-4">
          <div className="w-full max-w-lg max-h-[95vh] rounded-lg bg-white p-6 sm:p-8 shadow-soft flex flex-col">
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="relative mb-4 h-56 w-full overflow-hidden rounded-lg">
                <Image
                  src={selectedKitProduct.imageUrl}
                  alt={`Imagem do ${selectedKitProduct.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 540px"
                />
              </div>
              <h2 className="font-serifDisplay text-3xl text-cocoa-900">{selectedKitProduct.name}</h2>
              <p className="mt-2 text-lg text-cocoa-700">{selectedKitProduct.description}</p>

              <div className="mt-4 space-y-4 pb-4">
                <div className="text-base font-bold text-cocoa-700">
                  Sabor do bolo
                  <div className="mt-3 space-y-2">
                    {KIT_CAKE_FLAVORS.map((flavor) => (
                      <label key={flavor.id} className="flex items-start gap-3 text-sm font-normal text-cocoa-700">
                        <input
                          type="radio"
                          name="kit-cake-flavor"
                          checked={kitCakeFlavorId === flavor.id}
                          onChange={() => setKitCakeFlavorId(flavor.id)}
                          className="mt-0.5 h-4 w-4 border-rose-200 text-cocoa-800 focus:ring-cocoa-700/30"
                        />
                        <span className="flex flex-col">
                          <span className="text-sm font-semibold text-cocoa-800">{flavor.label}</span>
                          <span className="text-xs text-cocoa-600">{flavor.description}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="text-base font-bold text-cocoa-700">
                  Cobertura do bolo
                  <div className="mt-3 space-y-2">
                    {KIT_COVERINGS.map((covering) => (
                      <label key={covering.id} className="flex items-start gap-3 text-sm font-normal text-cocoa-700">
                        <input
                          type="radio"
                          name="kit-covering"
                          checked={kitCoveringId === covering.id}
                          onChange={() => setKitCoveringId(covering.id)}
                          className="mt-0.5 h-4 w-4 border-rose-200 text-cocoa-800 focus:ring-cocoa-700/30"
                        />
                        <span className="text-sm font-semibold text-cocoa-800">{covering.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="text-base font-bold text-cocoa-700">
                  Decoração personalizada
                  <div className="mt-3 space-y-2">
                    {KIT_DECORATIONS.map((decoration) => {
                      const checked = kitDecorationIds.includes(decoration.id);
                      const atLimit = kitDecorationIds.length >= 3;
                      const hasMini = kitDecorationIds.includes("macarons-minis");
                      const hasMedio = kitDecorationIds.includes("macarons-medios");
                      const macaronsBlocked =
                        (decoration.id === "macarons-minis" && hasMedio && !checked) ||
                        (decoration.id === "macarons-medios" && hasMini && !checked);
                      const disabled = (!checked && atLimit) || macaronsBlocked;

                      return (
                        <label key={decoration.id} className="flex items-start gap-3 text-sm font-normal text-cocoa-700">
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={disabled}
                            onChange={() => {
                              setKitDecorationIds((prev) => {
                                if (prev.includes(decoration.id)) {
                                  return prev.filter((item) => item !== decoration.id);
                                }
                                if (prev.length >= 3) return prev;
                                if (decoration.id === "macarons-minis" && prev.includes("macarons-medios")) return prev;
                                if (decoration.id === "macarons-medios" && prev.includes("macarons-minis")) return prev;
                                return [...prev, decoration.id];
                              });
                            }}
                            className="mt-0.5 h-4 w-4 rounded border-rose-200 text-cocoa-800 focus:ring-cocoa-700/30 disabled:opacity-50"
                          />
                          <span className="flex flex-col">
                            <span className="text-sm font-semibold text-cocoa-800">{decoration.label}</span>
                            <span className="text-xs text-cocoa-600">+ {formatCurrency(decoration.price)}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="text-base font-bold text-cocoa-700">
                  Sabores dos docinhos
                  <p className="mt-1 text-xs font-normal text-cocoa-600">Selecione exatamente 3 sabores para os 30 docinhos.</p>
                  <div className="mt-3 space-y-2">
                    {KIT_DOCINHO_OPTIONS.map((flavor) => {
                      const checked = kitDocinhoIds.includes(flavor.id);
                      const disabled = !checked && kitDocinhoIds.length >= 3;
                      return (
                        <label key={flavor.id} className="flex items-start gap-3 text-sm font-normal text-cocoa-700">
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={disabled}
                            onChange={() => {
                              setKitDocinhoIds((prev) => {
                                if (prev.includes(flavor.id)) {
                                  return prev.filter((item) => item !== flavor.id);
                                }
                                if (prev.length >= 3) return prev;
                                return [...prev, flavor.id];
                              });
                              setKitDocinhoError("");
                            }}
                            className="mt-0.5 h-4 w-4 rounded border-rose-200 text-cocoa-800 focus:ring-cocoa-700/30 disabled:opacity-50"
                          />
                          <span className="text-sm font-semibold text-cocoa-800">{flavor.label}</span>
                        </label>
                      );
                    })}
                  </div>
                  {kitDocinhoError ? <p className="mt-2 text-xs font-semibold text-rose-700">{kitDocinhoError}</p> : null}
                </div>
              </div>
            </div>

            <div className="mt-4 shrink-0 border-t border-rose-100 bg-white pt-4">
              <p className="text-2xl font-bold tracking-tight text-cocoa-900 sm:text-[1.75rem]">Total: {formatCurrency(kitTotal)}</p>
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
                  onClick={addKitToCart}
                  className="inline-flex min-h-[48px] flex-[2] items-center justify-center rounded-lg bg-gradient-to-br from-cocoa-700 to-cocoa-900 px-4 py-2 text-center text-sm font-semibold uppercase leading-tight tracking-[0.08em] text-white whitespace-normal sm:h-12 sm:py-0 sm:text-base sm:whitespace-nowrap sm:tracking-[0.12em] md:hover:from-cocoa-800 md:hover:to-cocoa-950"
                >
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {cartToastMessage ? (
        <div className="pointer-events-none fixed bottom-24 left-4 right-4 z-50 flex justify-center md:bottom-6 md:left-auto md:right-6">
          <div className="w-full max-w-sm rounded-xl border border-rose-100 bg-white/95 px-4 py-3 text-sm text-cocoa-800 shadow-2xl backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-500">Carrinho</p>
            <p className="mt-1 font-semibold text-cocoa-900">{cartToastMessage}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
