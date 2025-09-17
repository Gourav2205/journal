"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Winrate Circle Chart component props
 */
interface WinrateCircleProps {
    winningTrades: number
    losingTrades: number
    winRate: number
}

/**
 * Winrate Circle Chart component
 * Displays win/loss ratio as a donut chart
 * Shows percentage of winning vs losing trades
 * @param winningTrades - Number of winning trades
 * @param losingTrades - Number of losing trades
 * @param winRate - Win rate percentage
 */
export function WinrateCircle({ winningTrades, losingTrades, winRate }: WinrateCircleProps) {
    // Chart data for wins and losses
    const data = [
        { name: "Wins", value: winningTrades, color: "#10B981" },
        { name: "Losses", value: losingTrades, color: "#EF4444" },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Win Rate</CardTitle>
                <CardDescription>Percentage of winning trades</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                    <div className="relative">
                        <ResponsiveContainer width={200} height={200}>
                            <PieChart>
                                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
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
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center text showing win rate percentage */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
                                <div className="text-sm text-muted-foreground">Win Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Legend */}
                <div className="flex justify-center space-x-4 mt-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Wins ({winningTrades})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Losses ({losingTrades})</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
