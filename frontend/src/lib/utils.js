// src/lib/utils.js
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// named export `cn` required by shadcn components
export function cn(...inputs) {
    return twMerge(clsx(...inputs))
}