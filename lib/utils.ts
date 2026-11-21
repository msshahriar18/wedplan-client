import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// only allow internal paths so ?redirect= can't send users to another site
export const safeRedirect = (path?: string | null, fallback = "/dashboard") =>
  path && path.startsWith("/") && !path.startsWith("//") ? path : fallback
