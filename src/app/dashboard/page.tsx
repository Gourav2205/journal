import { Suspense } from "react"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { KPICard } from "@/components/kpi-card"
import { EquityCurve } from "@/components/charts/equity-curve"
import { WinrateCircle } from "@/components/charts/winrate-circle"
import { TradeDistribution } from "@/components/charts/trade-distribution"
import { BarChart3, TrendingUp, Target, Calculator } from "lucide-react"
import type { TradeAnalytics, EquityData } from "@/types/trade"

/**
 * Calculate trading analytics from trades data
 * @param trades - Array of trade records
 * @returns Analytics object with KPIs
 */
function calculateAnalytics(trades: any[]): TradeAnalytics {
    const totalTrades = trades.length
    const winningTrades = trades.filter((t) => t.result === "Win").length
    const losingTrades = trades.filter((t) => t.result === "Loss").length
    const buyTrades = trades.filter((t) => t.type === "Buy").length
    const sellTrades = trades.filter((t) => t.type === "Sell").length

    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0
    const avgRiskReward = trades.length > 0 ? trades.reduce((sum, t) => sum + t.rr, 0) / trades.length : 0

    // Calculate profit factor (sum of winning trades / sum of losing trades)
    const winningPips = trades.filter((t) => t.result === "Win").reduce((sum, t) => sum + (t.pips || 0), 0)
    const losingPips = Math.abs(trades.filter((t) => t.result === "Loss").reduce((sum, t) => sum + (t.pips || 0), 0))
    const profitFactor = losingPips > 0 ? winningPips / losingPips : winningPips > 0 ? 999 : 0

    const totalPips = trades.reduce((sum, t) => sum + (t.pips || 0), 0)

    return {
        totalTrades,
        winRate,
        avgRiskReward,
        profitFactor,
        totalPips,
        winningTrades,
        losingTrades,
        buyTrades,
        sellTrades,
    }
}

/**
 * Generate equity curve data from trades
 * @param trades - Array of trade records
 * @returns Array of equity data points
 */
function generateEquityData(trades: any[]): EquityData[] {
    let runningEquity = 1000 // Starting equity
    const equityData: EquityData[] = [{ date: "Start", equity: runningEquity, trade: "Initial" }]

    trades
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .forEach((trade, index) => {
            // Simulate equity change based on trade result
            const equityChange =
                trade.result === "Win"
                    ? (trade.pips || 0) * 10 // $10 per pip for wins
                    : -(trade.pips || 0) * 10 // Negative for losses

            runningEquity += equityChange

            equityData.push({
                date: new Date(trade.date).toLocaleDateString(),
                equity: runningEquity,
                trade: `${trade.pair} ${trade.type}`,
            })
        })

    return equityData
}

/**
 * Dashboard Analytics Component
 * Fetches and displays trading analytics
 */
async function DashboardAnalytics() {
    // Require authentication
    const user = await requireAuth()

    // Fetch user's trades from database
    const trades = await prisma.trade.findMany({
        where: { userId: user.id },
        orderBy: { date: "desc" },
    })

    // Calculate analytics
    const analytics = calculateAnalytics(trades)
    const equityData = generateEquityData(trades)

    return (
        <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Total Trades"
                    value={analytics.totalTrades}
                    icon={BarChart3}
                    description={`${analytics.totalPips.toFixed(1)} total pips`}
                />
                <KPICard
                    title="Win Rate"
                    value={`${analytics.winRate.toFixed(1)}%`}
                    icon={Target}
                    description={`${analytics.winningTrades} wins, ${analytics.losingTrades} losses`}
                    trend={analytics.winRate >= 50 ? "up" : "down"}
                />
                <KPICard
                    title="Avg Risk:Reward"
                    value={`1:${analytics.avgRiskReward.toFixed(2)}`}
                    icon={Calculator}
                    description="Average R:R ratio"
                    trend={analytics.avgRiskReward >= 2 ? "up" : analytics.avgRiskReward >= 1 ? "neutral" : "down"}
                />
                <KPICard
                    title="Profit Factor"
                    value={analytics.profitFactor.toFixed(2)}
                    icon={TrendingUp}
                    description="Gross profit / Gross loss"
                    trend={analytics.profitFactor >= 1.5 ? "up" : analytics.profitFactor >= 1 ? "neutral" : "down"}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                    <EquityCurve data={equityData} />
                </div>
                <WinrateCircle
                    winningTrades={analytics.winningTrades}
                    losingTrades={analytics.losingTrades}
                    winRate={analytics.winRate}
                />
                <TradeDistribution buyTrades={analytics.buyTrades} sellTrades={analytics.sellTrades} />
            </div>
        </div>
    )
}

/**
 * Dashboard Page Component
 * Main dashboard with analytics and charts
 * Protected route - requires authentication
 */
export default function DashboardPage() {
    return (
        <div className="space-y-8 m-7">
            <div>
                <h1 className="text-3xl font-bold">Trading Dashboard</h1>
                <p className="text-muted-foreground">Overview of your trading performance and analytics</p>
            </div>

            <Suspense
                fallback={
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
                            ))}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="lg:col-span-2 h-80 bg-muted animate-pulse rounded-lg" />
                            <div className="h-80 bg-muted animate-pulse rounded-lg" />
                            <div className="h-80 bg-muted animate-pulse rounded-lg" />
                        </div>
                    </div>
                }
            >
                <DashboardAnalytics />
            </Suspense>
        </div>
    )
}
