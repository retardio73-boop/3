import type { Product } from "@/data/products";

/**
 * Parse CSV string into array of objects
 * Handles commas, quotes, and line breaks properly
 */
function parseCSV(csv: string): Record<string, string>[] {
  const lines = csv.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = parseCSVLine(lines[0]);
  const result: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    result.push(row);
  }

  return result;
}

/**
 * Parse a single CSV line handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

/**
 * Safely convert string to number
 */
function safeNumber(value: string | undefined): number | undefined {
  if (!value || value.trim() === '') return undefined;
  const num = parseFloat(value.replace(/[^\d.-]/g, ''));
  return isNaN(num) ? undefined : num;
}

/**
 * Build images array from image1, image2, etc. columns
 */
function buildImages(row: Record<string, string>): string[] {
  const images: string[] = [];
  for (let i = 1; i <= 10; i++) {
    const image = row[`image${i}`] || row[`image_${i}`] || row[`image ${i}`];
    if (image && image.trim()) {
      images.push(image.trim());
    }
  }
  return images;
}

/**
 * Parse highlights from pipe-separated string
 */
function parseHighlights(highlights: string): string[] {
  if (!highlights || highlights.trim() === '') return [];
  return highlights.split('|').map(h => h.trim()).filter(h => h);
}

/**
 * Parse specs from key:value|key:value format
 */
function parseSpecs(specs: string): Record<string, string> {
  if (!specs || specs.trim() === '') return {};
  
  const result: Record<string, string> = {};
  specs.split('|').forEach(pair => {
    const colonIndex = pair.indexOf(':');
    if (colonIndex > 0) {
      const key = pair.substring(0, colonIndex).trim();
      const value = pair.substring(colonIndex + 1).trim();
      if (key && value) {
        result[key] = value;
      }
    }
  });
  
  return result;
}

/**
 * Fetch products from CSV URL and convert to Product[]
 */
export async function fetchProductsFromCsv(url: string): Promise<Product[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);
    
    const products: Product[] = rows.map(row => ({
      id: row.id || `product-${Math.random().toString(36).substr(2, 9)}`,
      name: row.name || 'Producto sin nombre',
      brand: row.brand || undefined,
      category: row.category || 'Accessories',
      priceCash: safeNumber(row.priceCash) || 0,
      priceCard: safeNumber(row.priceCard) || 0,
      badge: row.badge || undefined,
      stockStatus: (row.stockStatus as any) || 'in_stock',
      images: buildImages(row),
      highlights: parseHighlights(row.highlights || ''),
      specs: parseSpecs(row.specs || ''),
    }));

    return products.filter(p => p.id && p.name);
  } catch (error) {
    console.error('Error fetching products from CSV:', error);
    throw error;
  }
}
