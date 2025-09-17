import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Format currency values for display
 * @param value - Numeric value to format
 * @param currency - Currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency = "USD"): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)
}

/**
 * Format percentage values for display
 * @param value - Decimal value (0.1 = 10%)
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals = 1): string {
    return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Calculate Risk:Reward ratio from entry, stop loss, and take profit
 * @param entry - Entry price
 * @param stopLoss - Stop loss price
 * @param takeProfit - Take profit price
 * @param type - Trade type ('Buy' or 'Sell')
 * @returns Risk:Reward ratio
 */
export function calculateRiskReward(entry: number, stopLoss: number, takeProfit: number, type: "Buy" | "Sell"): number {
    if (type === "Buy") {
        const risk = entry - stopLoss
        const reward = takeProfit - entry
        return risk > 0 ? reward / risk : 0
    } else {
        const risk = stopLoss - entry
        const reward = entry - takeProfit
        return risk > 0 ? reward / risk : 0
    }
}

/**
 * Calculate pips for forex pairs
 * @param entry - Entry price
 * @param exit - Exit price
 * @param pair - Currency pair
 * @returns Pips value
 */
export function calculatePips(entry: number, exit: number, pair: string): number {
    const pipValue = pair.includes("JPY") ? 0.01 : 0.0001
    return Math.abs(exit - entry) / pipValue
}
