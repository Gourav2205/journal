import type { Trade } from "@/types/trade"

/**
 * Export utilities for trade data
 * Handles CSV and Excel export functionality
 */

/**
 * Convert trades array to CSV format
 * @param trades - Array of trade objects
 * @returns CSV string
 */
export function tradesToCSV(trades: Trade[]): string {
    // CSV headers
    const headers = [
        "Date",
        "Pair",
        "Type",
        "Entry",
        "Stop Loss",
        "Take Profit",
        "Result",
        "Pips",
        "Risk:Reward",
        "Notes",
    ]

    // Convert trades to CSV rows
    const rows = trades.map((trade) => [
        trade.date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
        trade.pair,
        trade.type,
        trade.entry.toString(),
        trade.sl.toString(),
        trade.tp.toString(),
        trade.result,
        trade.pips?.toString() || "",
        trade.rr.toFixed(2),
        trade.notes || "",
    ])

    // Combine headers and rows
    const csvContent = [headers, ...rows].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    return csvContent
}

/**
 * Generate filename for export
 * @param format - Export format ('csv' or 'excel')
 * @returns Formatted filename with timestamp
 */
export function generateExportFilename(format: "csv" | "excel"): string {
    const timestamp = new Date().toISOString().split("T")[0]
    const extension = format === "csv" ? "csv" : "xlsx"
    return `trading-journal-${timestamp}.${extension}`
}

/**
 * Calculate trade statistics for export summary
 * @param trades - Array of trade objects
 * @returns Statistics object
 */
export function calculateTradeStats(trades: Trade[]) {
    const totalTrades = trades.length
    const winningTrades = trades.filter((t) => t.result === "Win").length
    const losingTrades = trades.filter((t) => t.result === "Loss").length
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0
    const avgRiskReward = trades.length > 0 ? trades.reduce((sum, t) => sum + t.rr, 0) / trades.length : 0
    const totalPips = trades.reduce((sum, t) => sum + (t.pips || 0), 0)

    return {
        totalTrades,
        winningTrades,
        losingTrades,
        winRate: Number(winRate.toFixed(1)),
        avgRiskReward: Number(avgRiskReward.toFixed(2)),
        totalPips: Number(totalPips.toFixed(1)),
    }
}
