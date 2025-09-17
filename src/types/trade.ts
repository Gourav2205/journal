/**
 * Trade type definition for TypeScript
 * Matches the Prisma schema structure
 */
export interface Trade {
    id: string
    userId: string
    date: Date
    pair: string
    type: "Buy" | "Sell"
    entry: number
    sl: number // Stop Loss
    tp: number // Take Profit
    result: "Win" | "Loss"
    pips?: number
    rr: number // Risk:Reward ratio
    notes?: string
    screenshotUrl?: string
    createdAt: Date
}

/**
 * Trade form data interface for creating/editing trades
 */
export interface TradeFormData {
    date: string
    pair: string
    type: "Buy" | "Sell"
    entry: string
    sl: string
    tp: string
    result: "Win" | "Loss"
    notes?: string
    screenshot?: File
}

/**
 * Analytics data interface for dashboard KPIs
 */
export interface TradeAnalytics {
    totalTrades: number
    winRate: number
    avgRiskReward: number
    profitFactor: number
    totalPips: number
    winningTrades: number
    losingTrades: number
    buyTrades: number
    sellTrades: number
}

/**
 * Chart data interface for equity curve
 */
export interface EquityData {
    date: string
    equity: number
    trade: string
}
