"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Trade Distribution Chart component props
 */
interface TradeDistributionProps {
    buyTrades: number
    sellTrades: number
}

/**
 * Trade Distribution Chart component
 * Displays distribution of buy vs sell trades as a pie chart
 * Shows trading bias and strategy preferences
 * @param buyTrades - Number of buy trades
 * @param sellTrades - Number of sell trades
 */
export function TradeDistribution({ buyTrades, sellTrades }: TradeDistributionProps) {
    // Chart data for buy and sell trades
    const data = [
        { name: "Buy Trades", value: buyTrades, color: "#7B5CF5" },
        { name: "Sell Trades", value: sellTrades, color: "#EC4899" },
    ]

    const total = buyTrades + sellTrades

    return (
        <Card>
            <CardHeader>
                <CardTitle>Trade Distribution</CardTitle>
                <CardDescription>Buy vs Sell trade distribution</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}`}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "6px",
                                }}
                                formatter={(value: number) => [`${value} trades (${((value / total) * 100).toFixed(1)}%)`, ""]}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
