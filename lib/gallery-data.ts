import { assetPath } from "@/lib/asset-path";

export type GalleryItem = {
  image: string;
  title: string;
  description: string;
};

export const galleryItems: GalleryItem[] = [
  {
    image: assetPath("/gallery/photo1.jpg"),
    title: "Macarons artesanais",
    description: "Macarons delicados e coloridos preparados artesanalmente para mesas de doces e eventos especiais."
  },
  {
    image: assetPath("/gallery/photo2.jpg"),
    title: "Elegância em cada detalhe",
    description: "Macarons organizados em caixas e torres para compor mesas sofisticadas em festas e celebrações."
  },
  {
    image: assetPath("/gallery/photo3.jpg"),
    title: "Doces finos",
    description: "Brigadeiros gourmet e doces finos preparados com ingredientes selecionados para ocasiões especiais."
  }
];
