import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de Tailwind de forma inteligente.
 *
 * - `clsx` fusiona clases condicionales.
 * - `twMerge` resuelve conflictos entre clases de Tailwind.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', 'px-6')
 * // => 'py-2 bg-blue-500 px-6'  (el último px-6 gana)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
