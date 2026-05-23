import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function normalizeTags(value: unknown): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return [];
    }

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((tag) => String(tag).trim()).filter(Boolean);
      }
    } catch {
      // ignore parse errors and fall back to comma-separated parsing
    }

    return trimmed
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
