"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { KPICard } from "@/components/kpi-card"
import { Download, FileText, BarChart3, Target, Calculator, TrendingUp } from "lucide-react"

/**
 * Export preview data interface
 */
interface ExportPreview {
    stats: {
        totalTrades: number
        winningTrades: number
        losingTrades: number
        winRate: number
        avgRiskReward: number
        totalPips: number
    }
    tradeCount: number
    dateRange: {
        from: string | null
        to: string | null
    }
    preview: any[]
}

/**
 * Export Page Component
 * Allows users to export their trading data to CSV
 * Includes date filtering and export preview
 */
export default function ExportPage() {
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isPreviewLoading, setIsPreviewLoading] = useState(false)
    const [preview, setPreview] = useState<ExportPreview | null>(null)

    // Get export preview with current filters
    const getPreview = async () => {
        setIsPreviewLoading(true)
        try {
            const response = await fetch("/api/export", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    dateFrom: dateFrom || undefined,
                    dateTo: dateTo || undefined,
                }),
            })

            if (response.ok) {
                const data = await response.json()
                setPreview(data)
            } else {
                const error = await response.json()
                alert(error.error || "Failed to get export preview")
            }
        } catch (error) {
            console.error("Error getting preview:", error)
            alert("Failed to get export preview")
        } finally {
            setIsPreviewLoading(false)
        }
    }

    // Handle CSV export
    const handleExport = async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams({
                format: "csv",
                ...(dateFrom && { dateFrom }),
                ...(dateTo && { dateTo }),
            })

            const response = await fetch(`/api/export?${params}`)

            if (response.ok) {
                // Create download link
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = `trading-journal-${new Date().toISOString().split("T")[0]}.csv`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
            } else {
                const error = await response.json()
                alert(error.error || "Failed to export trades")
            }
        } catch (error) {
            console.error("Error exporting trades:", error)
            alert("Failed to export trades")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Export Trades</h1>
                <p className="text-muted-foreground">Export your trading data to CSV for external analysis</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Export Configuration */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Download className="h-5 w-5" />
                                <span>Export Settings</span>
                            </CardTitle>
                            <CardDescription>Configure your export parameters</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Date Range Filters */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dateFrom">From Date (Optional)</Label>
                                    <Input id="dateFrom" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dateTo">To Date (Optional)</Label>
                                    <Input id="dateTo" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                                </div>
                            </div>

                            {/* Preview Button */}
                            <Button
                                onClick={getPreview}
                                variant="outline"
                                className="w-full bg-transparent"
                                disabled={isPreviewLoading}
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                {isPreviewLoading ? "Loading..." : "Preview Export"}
                            </Button>

                            {/* Export Button */}
                            <Button onClick={handleExport} className="w-full" disabled={isLoading || !preview}>
                                <Download className="h-4 w-4 mr-2" />
                                {isLoading ? "Exporting..." : "Export to CSV"}
                            </Button>

                            {/* Export Info */}
                            <div className="text-sm text-muted-foreground space-y-2">
                                <p>• CSV format compatible with Excel and Google Sheets</p>
                                <p>• Includes all trade details and calculated metrics</p>
                                <p>• Date filters are optional - leave blank for all trades</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Export Preview */}
                <div className="lg:col-span-2">
                    {preview ? (
                        <div className="space-y-6">
                            {/* Export Statistics */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Export Summary</CardTitle>
                                    <CardDescription>
                                        Statistics for {preview.tradeCount} trades
                                        {preview.dateRange.from && preview.dateRange.to && (
                                            <span className="ml-2">
                                                from {new Date(preview.dateRange.from).toLocaleDateString()}
                                                to {new Date(preview.dateRange.to).toLocaleDateString()}
                                            </span>
                                        )}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        <KPICard title="Total Trades" value={preview.stats.totalTrades} icon={BarChart3} className="p-4" />
                                        <KPICard title="Win Rate" value={`${preview.stats.winRate}%`} icon={Target} className="p-4" />
                                        <KPICard
                                            title="Avg R:R"
                                            value={`1:${preview.stats.avgRiskReward.toFixed(2)}`}
                                            icon={Calculator}
                                            className="p-4"
                                        />
                                        <KPICard
                                            title="Total Pips"
                                            value={preview.stats.totalPips.toFixed(1)}
                                            icon={TrendingUp}
                                            className="p-4"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Trade Preview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Trade Preview</CardTitle>
                                    <CardDescription>First 5 trades that will be included in the export</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left p-2">Date</th>
                                                    <th className="text-left p-2">Pair</th>
                                                    <th className="text-left p-2">Type</th>
                                                    <th className="text-left p-2">Entry</th>
                                                    <th className="text-left p-2">Result</th>
                                                    <th className="text-left p-2">R:R</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {preview.preview.map((trade) => (
                                                    <tr key={trade.id} className="border-b">
                                                        <td className="p-2">{new Date(trade.date).toLocaleDateString()}</td>
                                                        <td className="p-2 font-medium">{trade.pair}</td>
                                                        <td className="p-2">
                                                            <Badge variant={trade.type === "Buy" ? "default" : "secondary"}>{trade.type}</Badge>
                                                        </td>
                                                        <td className="p-2 font-mono">{trade.entry.toFixed(5)}</td>
                                                        <td className="p-2">
                                                            <Badge variant={trade.result === "Win" ? "default" : "destructive"}>{trade.result}</Badge>
                                                        </td>
                                                        <td className="p-2">1:{trade.rr.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {preview.tradeCount > 5 && (
                                        <p className="text-sm text-muted-foreground mt-4">... and {preview.tradeCount - 5} more trades</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="flex items-center justify-center h-64">
                                <div className="text-center">
                                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">
                                        Click "Preview Export" to see what will be included in your export
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
