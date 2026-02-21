export interface Product {
  id: string;
  name: string;
  brand?: string;
  category: string;
  priceCash?: number;
  priceCard?: number;
  badge?: string;
  stockStatus?: "in_stock" | "low_stock" | "out_of_stock";
  images?: string[];
  highlights?: string[];
  specs?: { [key: string]: string };
}

export function categoryLabel(categoryKey: string): string {
  const categoryMap: Record<string, string> = {
    "Cell Phones": "Celulares",
    "Accessories": "Accesorios", 
    "Chargers": "Cargadores",
    "Earphones": "Auriculares",
    "Headphones": "Auriculares vincha",
    "Monitors": "Monitores",
    "PCs": "PCs",
    "Personal Care": "Cuidado personal",
    "Security": "Seguridad",
    "Outdoor & Power": "Outdoor & Energía"
  };
  return categoryMap[categoryKey] || categoryKey;
}

export function formatUYU(n?: number): string {
  if (typeof n !== "number" || isNaN(n)) return "$U 0";
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function getWhatsAppLink(message: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "59891161283";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

// Fallback products so site never breaks if CSV fails
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Samsung Galaxy A15",
    brand: "Samsung",
    category: "Cell Phones",
    priceCash: 15990,
    priceCard: 18990,
    badge: "Más vendido",
    stockStatus: "in_stock",
    highlights: ["Pantalla 6.5\" Super AMOLED", "50MP + 5MP + 2MP", "4GB RAM + 128GB", "Batería 5000mAh"],
    specs: {
      "Pantalla": "6.5\" Super AMOLED 1080x2340",
      "Procesador": "MediaTek Helio G99",
      "RAM": "4GB",
      "Almacenamiento": "128GB expandible",
      "Cámaras": "50MP principal + 5MP ultra + 2MP profundidad",
      "Batería": "5000mAh con carga rápida 25W",
      "Sistema": "Android 14"
    }
  },
  {
    id: "p2",
    name: "iPhone 15",
    brand: "Apple",
    category: "Cell Phones",
    priceCash: 45990,
    priceCard: 52990,
    badge: "Premium",
    stockStatus: "in_stock",
    highlights: ["Pantalla 6.1\" Super Retina XDR", "Sistema de 2 cámaras de 48MP", "Chip A16 Bionic", "Dynamic Island"],
    specs: {
      "Pantalla": "6.1\" Super Retina XDR 2556x1179",
      "Procesador": "A16 Bionic",
      "RAM": "6GB",
      "Almacenamiento": "128GB",
      "Cámaras": "48MP principal + 12MP ultra gran angular",
      "Batería": "3342mAh",
      "Sistema": "iOS 17"
    }
  },
  {
    id: "p3",
    name: "Xiaomi Redmi Note 13",
    brand: "Xiaomi",
    category: "Cell Phones",
    priceCash: 12990,
    priceCard: 14990,
    stockStatus: "in_stock",
    highlights: ["Pantalla 6.67\" AMOLED 120Hz", "108MP + 8MP + 2MP", "8GB RAM + 256GB", "Carga rápida 67W"],
    specs: {
      "Pantalla": "6.67\" AMOLED 120Hz 2400x1080",
      "Procesador": "Snapdragon 7 Gen 1",
      "RAM": "8GB",
      "Almacenamiento": "256GB expandible",
      "Cámaras": "108MP principal + 8MP ultra gran angular + 2MP macro",
      "Batería": "5000mAh con carga rápida 67W",
      "Sistema": "Android 13"
    }
  },
  {
    id: "p4",
    name: "AirPods Pro 2",
    brand: "Apple",
    category: "Earphones",
    priceCash: 18990,
    priceCard: 21990,
    badge: "Premium",
    stockStatus: "in_stock",
    highlights: ["Cancelación activa de ruido", "Audio espacial", "Hasta 6h de batería", "Resistencia al agua IPX4"],
    specs: {
      "Tipo": "In-ear",
      "Conectividad": "Bluetooth 5.3",
      "Batería": "Hasta 6h (30h con estuche)",
      "Resistencia": "IPX4",
      "Compatibilidad": "iOS, Android"
    }
  },
  {
    id: "p5",
    name: "Samsung Galaxy Buds2 Pro",
    brand: "Samsung",
    category: "Earphones",
    priceCash: 12990,
    priceCard: 14990,
    stockStatus: "in_stock",
    highlights: ["Cancelación activa de ruido", "Audio 360°", "Hasta 8h de batería", "Resistencia al agua IPX7"],
    specs: {
      "Tipo": "In-ear",
      "Conectividad": "Bluetooth 5.3",
      "Batería": "Hasta 8h (29h con estuche)",
      "Resistencia": "IPX7",
      "Compatibilidad": "iOS, Android"
    }
  }
];
