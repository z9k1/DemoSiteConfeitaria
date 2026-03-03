import {
  BrandSettings,
  CtaConfig,
  EventPackage,
  FaqItem,
  Product,
  ProductCategory,
  Testimonial
} from "@/types/cms";

export const brandSettings: BrandSettings = {
  businessName: "Cristiane Santos Gastronomia",
  tagline: "Macarons artesanais para momentos marcantes",
  summary:
    "Confeitaria premium artesanal em Londrina-PR, especializada em macarons personalizados para casamentos, eventos corporativos e datas especiais.",
  whatsappNumber: "5543988428410",
  instagramUrl: "https://www.instagram.com/cristianesantos_gastronomia/",
  ifoodUrl: "https://cristiane-santos-gastronomia.ola.click/products",
  menuPdfUrl: "https://drive.google.com/file/d/1aVLK57rtlIeFI3y0gFWv5ve00zaVzWs_/view",
  coverage: "Londrina e região",
  address: "R. Monaco, 178 - Jardim Adriana II, Londrina - PR",
  phoneDisplay: "(43) 98842-8410",
  minOrderNoticeDays: 5
};

export const productCategories: ProductCategory[] = [
  {
    id: "eventos-casamentos",
    name: "Eventos & Casamentos",
    description: "Macarons premium sob encomenda com personalização para eventos."
  },
  {
    id: "kits-caixas",
    name: "Kits e Caixas Especiais",
    description: "Combinações prontas para presentear e celebrar com praticidade."
  },
  {
    id: "pedido-rapido",
    name: "Pedido Rapido",
    description: "Linha para encomendas recorrentes e datas comemorativas."
  }
];

export const products: Product[] = [
  {
    id: "macaron-medio",
    categoryId: "eventos-casamentos",
    name: "Macaron medio (4,5 cm)",
    description: "Sabores premium como pistache, champanhe, frutas vermelhas e lotus biscoff.",
    priceRange: "A partir de R$7,00 por unidade",
    minOrder: "Pedido minimo varia por quantidade/cor/sabor",
    imageHint: "macarons coloridos em mesa de casamento"
  },
  {
    id: "macaron-mini",
    categoryId: "eventos-casamentos",
    name: "Mini macaron",
    description: "Formato delicado para lembranças e composição de caixas especiais.",
    priceRange: "10 unidades por R$40,00",
    minOrder: "Mínimo de 10 unidades",
    imageHint: "mini macarons em caixa transparente"
  },
  {
    id: "kit-festa",
    categoryId: "kits-caixas",
    name: "Kits para festa",
    description: "Combos de bolo e docinhos para 10 a 50 pessoas.",
    priceRange: "A partir de R$160,00",
    minOrder: "Conforme disponibilidade",
    imageHint: "kit festa com bolo e doces"
  },
  {
    id: "caixas-presente",
    categoryId: "kits-caixas",
    name: "Caixas presente",
    description: "Caixas com visor ou acrílicas para padrinhos, empresas e brindes.",
    priceRange: "A partir de R$10,00",
    minOrder: "Mínimo de 10 caixas pequenas",
    imageHint: "caixa de macarons para presente"
  },
  {
    id: "docinhos-gourmet",
    categoryId: "pedido-rapido",
    name: "Docinhos Gourmet (barras & biscoitos)",
    description: "Barras de chocolate personalizadas e biscoitos floridos apresentados como docinhos gourmet.",
    priceRange: "Preço sob consulta",
    imageHint: "docinhos gourmet coloridos"
  },
  {
    id: "bolos-sob-encomenda",
    categoryId: "pedido-rapido",
    name: "Bolos sob encomenda",
    description: "Bolos artesanais personalizados para celebrar com estilo.",
    priceRange: "Preço sob consulta",
    imageHint: "bolo decorado artesanal"
  }
];

export const eventPackages: EventPackage[] = [
  {
    id: "torre-04",
    title: "Torre de macarons - 4 andares",
    details: "47 macarons, 15 cm de altura e base de 18 cm.",
    price: "R$395,00"
  },
  {
    id: "torre-06",
    title: "Torre de macarons - 6 andares",
    details: "95 macarons, 25 cm de altura e base de 23 cm.",
    price: "R$745,00"
  },
  {
    id: "torre-10",
    title: "Torre de macarons - 10 andares",
    details: "237 macarons, 55 cm de altura e base de 33 cm.",
    price: "R$1.750,00"
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    author: "Amanda S.",
    role: "Noiva em Londrina",
    text: "Os macarons ficaram perfeitos na paleta do casamento e foram muito elogiados."
  },
  {
    id: "t2",
    author: "Equipe RH",
    role: "Empresa local",
    text: "Atendimento impecável e embalagens personalizadas que valorizaram nosso evento."
  },
  {
    id: "t3",
    author: "Patricia M.",
    role: "Cliente recorrente",
    text: "Qualidade constante, sabor marcante e uma apresentação sempre elegante."
  }
];

export const faqItems: FaqItem[] = [
  {
    id: "f1",
    question: "Qual o prazo mínimo para encomendas?",
    answer:
      "Trabalhamos com antecedência mínima de 5 dias para pedidos sob encomenda, sujeito a disponibilidade."
  },
  {
    id: "f2",
    question: "Vocês atendem apenas Londrina?",
    answer: "Atendemos Londrina e região. A taxa/viabilidade depende do local do evento."
  },
  {
    id: "f3",
    question: "É possível personalizar com logo ou iniciais?",
    answer: "Sim. Personalizamos cores, iniciais e logos curtos conforme viabilidade técnica."
  },
  {
    id: "f4",
    question: "Existe pedido mínimo?",
    answer:
      "Sim. Alguns itens possuem mínimos por quantidade, sabor e formato. Isso é detalhado no orçamento."
  }
];

export const ctaConfigs: CtaConfig[] = [
  {
    id: "whatsapp-principal",
    label: "Pedir orçamento no WhatsApp",
    type: "whatsapp_primary",
    message: "Olá! Quero um orçamento para meu evento."
  },
  {
    id: "whatsapp-casamento",
    label: "Quero orçamento para casamento",
    type: "whatsapp_quote",
    message: "Olá! Quero um orçamento para casamento."
  },
  {
    id: "external-ifood",
    label: "Pedido rápido no cardápio online",
    type: "external_ifood",
    href: brandSettings.ifoodUrl
  },
  {
    id: "external-instagram",
    label: "Ver Instagram",
    type: "external_instagram",
    href: brandSettings.instagramUrl
  }
];
