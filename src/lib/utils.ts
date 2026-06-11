import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Strips HTML entities and currency symbols from a WooCommerce price string
 * and returns a numeric float. Returns 0 for null/empty input.
 *
 * Examples: "$29.99" → 29.99  |  "$1,299.00" → 1299.00
 */
export function parsePrice(priceStr: string | null | undefined): number {
  if (!priceStr) return 0;
  const cleaned = priceStr
    .replace(/<[^>]+>/g, "")   // strip any HTML tags
    .replace(/[^0-9.,]/g, "")  // keep only digits, comma, period
    .replace(",", "");          // remove thousands separator
  return parseFloat(cleaned) || 0;
}

/** Format a numeric price for display (US Dollars). */
export function formatPrice(price: string | number | null): string {
  const num = parseFloat(String(price ?? 0));
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}