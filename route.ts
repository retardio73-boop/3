import { NextRequest, NextResponse } from 'next/server';
import { FALLBACK_PRODUCTS, type Product } from '@/data/products';

// Simple CSV parsing function (server-side)
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

// Helper function to parse price strings
function parsePrice(raw: string | undefined): number | undefined {
  if (!raw || raw.trim() === '') return undefined;
  
  // Trim and remove currency tokens/symbols
  const cleanValue = raw
    .trim()
    .replace(/[$UYU]/g, '') // Remove $, U, Y, U
    .replace(/U\$S/g, '') // Remove U$S
    .replace(/USD/g, '') // Remove USD
    .replace(/[,\s]/g, '') // Remove commas and spaces
    .replace(/\./g, '') // Remove periods (thousand separators)
    .replace(/[^0-9]/g, ''); // Keep only digits
  
  const parsed = parseInt(cleanValue, 10);
  return isNaN(parsed) ? undefined : parsed;
}

// Helper function to find header value with aliases
function findHeaderValue(row: Record<string, string>, aliases: string[]): { value: string; headerUsed: string } {
  for (const alias of aliases) {
    const lowerAlias = alias.toLowerCase();
    for (const [header, value] of Object.entries(row)) {
      const lowerHeader = header.trim().toLowerCase();
      if (lowerHeader === lowerAlias) {
        return { value, headerUsed: header };
      }
    }
  }
  return { value: '', headerUsed: 'none' };
}

// Convert CSV row to Product
function csvRowToProduct(row: Record<string, string>, index: number): Product {
  // Cash price aliases
  const cashAliases = [
    'priceCash', 'pricecash', 'cash', 'contado', 
    'precioContado', 'precio_contado', 'precio contado'
  ];
  
  // Card price aliases
  const cardAliases = [
    'priceCard', 'pricecard', 'card', 'tarjeta', 
    'precioTarjeta', 'precio_tarjeta', 'precio tarjeta'
  ];
  
  const { value: rawCash } = findHeaderValue(row, cashAliases);
  const { value: rawCard } = findHeaderValue(row, cardAliases);
  
  const priceCash = parsePrice(rawCash);
  const priceCard = parsePrice(rawCard);
  
  return {
    id: findHeaderValue(row, ['id']).value || `product-${index}`,
    name: findHeaderValue(row, ['name']).value || 'Producto sin nombre',
    brand: findHeaderValue(row, ['brand']).value || undefined,
    category: findHeaderValue(row, ['category']).value || 'Accessories',
    priceCash: (typeof priceCash === 'number' && !isNaN(priceCash)) ? priceCash : undefined,
    priceCard: (typeof priceCard === 'number' && !isNaN(priceCard)) ? priceCard : undefined,
    badge: findHeaderValue(row, ['badge']).value || undefined,
    stockStatus: findHeaderValue(row, ['stockstatus', 'stock_status', 'stock']).value as any || 'in_stock',
    images: [
      findHeaderValue(row, ['image1', 'image_1', 'image01']).value,
      findHeaderValue(row, ['image2', 'image_2', 'image02']).value,
      findHeaderValue(row, ['image3', 'image_3', 'image03']).value
    ].filter(Boolean),
    highlights: findHeaderValue(row, ['highlights']).value ? findHeaderValue(row, ['highlights']).value.split('|').map(h => h.trim()).filter(Boolean) : [],
    specs: findHeaderValue(row, ['specs']).value ? parseSpecs(findHeaderValue(row, ['specs']).value) : {},
  };
}

function parseSpecs(specsStr: string): Record<string, string> {
  const specs: Record<string, string> = {};
  if (!specsStr) return specs;
  
  specsStr.split('|').forEach(pair => {
    const colonIndex = pair.indexOf(':');
    if (colonIndex > 0) {
      const key = pair.substring(0, colonIndex).trim();
      const value = pair.substring(colonIndex + 1).trim();
      if (key && value) {
        specs[key] = value;
      }
    }
  });
  
  return specs;
}

export async function GET(request: NextRequest) {
  try {
    const csvUrl = process.env.NEXT_PUBLIC_PRODUCTS_CSV_URL;
    
    // Debug logging
    console.log('=== API Products Debug ===');
    console.log('CSV URL from env:', csvUrl);
    
    if (!csvUrl) {
      console.log('No CSV URL configured, returning fallback');
      return NextResponse.json({ 
        products: FALLBACK_PRODUCTS,
        source: "fallback",
        csvUrlPresent: false,
        csvUrlUsed: null,
        rowCount: FALLBACK_PRODUCTS.length,
        error: "CSV URL missing" 
      });
    }

    console.log('Fetching CSV from:', csvUrl);
    const response = await fetch(csvUrl);
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      console.error('CSV fetch failed:', response.status, response.statusText);
      return NextResponse.json({ 
        products: FALLBACK_PRODUCTS,
        source: "fallback",
        csvUrlPresent: true,
        csvUrlUsed: csvUrl,
        rowCount: FALLBACK_PRODUCTS.length,
        error: `Failed to fetch CSV: ${response.statusText}` 
      });
    }

    const csvText = await response.text();
    console.log('CSV text length:', csvText.length);
    
    // Strip UTF-8 BOM if present
    const cleanedCsvText = csvText.charCodeAt(0) === 0xFEFF ? csvText.slice(1) : csvText;
    console.log('CSV first 200 chars (BOM stripped):', cleanedCsvText.substring(0, 200));
    
    const rows = parseCSV(cleanedCsvText);
    console.log('Parsed rows count:', rows.length);
    
    if (rows.length === 0) {
      console.error('CSV parsed to empty array');
      return NextResponse.json({
        products: FALLBACK_PRODUCTS,
        source: "fallback",
        csvUrlPresent: true,
        csvUrlUsed: csvUrl,
        rowCount: 0,
        error: "CSV parsed to empty array"
      });
    }
    
    const products: Product[] = rows
      .filter(row => row.id && row.name)
      .map((row, index) => csvRowToProduct(row, index));

    if (products.length === 0) {
      console.error('No valid products found in CSV');
      return NextResponse.json({
        products: FALLBACK_PRODUCTS,
        source: "fallback",
        csvUrlPresent: true,
        csvUrlUsed: csvUrl,
        rowCount: rows.length,
        error: "No valid products found in CSV"
      });
    }

    return NextResponse.json({ 
      products,
      source: "csv",
      csvUrlPresent: true,
      csvUrlUsed: csvUrl,
      rowCount: rows.length,
      error: null
    });

  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({ 
      products: FALLBACK_PRODUCTS,
      source: "fallback",
      csvUrlPresent: true,
      csvUrlUsed: process.env.NEXT_PUBLIC_PRODUCTS_CSV_URL || null,
      rowCount: FALLBACK_PRODUCTS.length,
      error: 'Internal server error' 
    });
  }
}
