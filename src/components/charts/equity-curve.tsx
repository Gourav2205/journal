"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { EquityData } from "@/types/trade"

/**
 * Equity Curve Chart component props
 */
interface EquityCurveProps {
    data: EquityData[]
}

/**
 * Equity Curve Chart component
 * Displays trading performance over time using a line chart
 * Shows cumulative equity progression from trades
 * @param data - Array of equity data points with date and equity values
 */
export function EquityCurve({ data }: EquityCurveProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Equity Curve</CardTitle>
                <CardDescription>Your trading performance over time</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 12 }} />
                            <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "6px",
                                }}
                                labelStyle={{ color: "hsl(var(--foreground))" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="equity"
                                stroke="#7B5CF5"
                                strokeWidth={2}
                                dot={{ fill: "#7B5CF5", strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: "#7B5CF5", strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
