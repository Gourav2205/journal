"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Trade } from "@/types/trade"
import { Edit, Trash2, Eye, Search } from "lucide-react"

/**
 * Trade Table component props
 */
interface TradeTableProps {
    trades: Trade[]
    onDelete?: (tradeId: string) => void
}

/**
 * Trade Table component
 * Displays trades in a sortable, filterable table
 * Includes search, filter, and action buttons
 * @param trades - Array of trade objects to display
 * @param onDelete - Optional callback for delete action
 */
export function TradeTable({ trades, onDelete }: TradeTableProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState<string>("all")
    const [filterResult, setFilterResult] = useState<string>("all")
    const [sortField, setSortField] = useState<keyof Trade>("date")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

    // Filter trades based on search and filters
    const filteredTrades = trades.filter((trade) => {
        const matchesSearch =
            trade.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trade.notes?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = filterType === "all" || trade.type === filterType
        const matchesResult = filterResult === "all" || trade.result === filterResult

        return matchesSearch && matchesType && matchesResult
    })

    // Sort trades
    const sortedTrades = [...filteredTrades].sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
        return 0
    })

    // Handle sort
    const handleSort = (field: keyof Trade) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Trade History</CardTitle>
                <CardDescription>View and manage your trading records</CardDescription>

                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search trades..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-full sm:w-32">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="Buy">Buy</SelectItem>
                            <SelectItem value="Sell">Sell</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filterResult} onValueChange={setFilterResult}>
                        <SelectTrigger className="w-full sm:w-32">
                            <SelectValue placeholder="Result" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Results</SelectItem>
                            <SelectItem value="Win">Wins</SelectItem>
                            <SelectItem value="Loss">Losses</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-2 cursor-pointer hover:bg-muted" onClick={() => handleSort("date")}>
                                    Date {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
                                </th>
                                <th className="text-left p-2 cursor-pointer hover:bg-muted" onClick={() => handleSort("pair")}>
                                    Pair {sortField === "pair" && (sortDirection === "asc" ? "↑" : "↓")}
                                </th>
                                <th className="text-left p-2">Type</th>
                                <th className="text-left p-2">Entry</th>
                                <th className="text-left p-2">SL</th>
                                <th className="text-left p-2">TP</th>
                                <th className="text-left p-2">R:R</th>
                                <th className="text-left p-2">Result</th>
                                <th className="text-left p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTrades.map((trade) => (
                                <tr key={trade.id} className="border-b hover:bg-muted/50">
                                    <td className="p-2">{new Date(trade.date).toLocaleDateString()}</td>
                                    <td className="p-2 font-medium">{trade.pair}</td>
                                    <td className="p-2">
                                        <Badge variant={trade.type === "Buy" ? "default" : "secondary"}>{trade.type}</Badge>
                                    </td>
                                    <td className="p-2">{trade.entry.toFixed(5)}</td>
                                    <td className="p-2">{trade.sl.toFixed(5)}</td>
                                    <td className="p-2">{trade.tp.toFixed(5)}</td>
                                    <td className="p-2">1:{trade.rr.toFixed(2)}</td>
                                    <td className="p-2">
                                        <Badge variant={trade.result === "Win" ? "default" : "destructive"}>{trade.result}</Badge>
                                    </td>
                                    <td className="p-2">
                                        <div className="flex space-x-2">
                                            <Button size="sm" variant="outline" asChild>
                                                <Link href={`/trades/${trade.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button size="sm" variant="outline" asChild>
                                                <Link href={`/trades/${trade.id}/edit`}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            {onDelete && (
                                                <Button size="sm" variant="destructive" onClick={() => onDelete(trade.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                    {sortedTrades.map((trade) => (
                        <Card key={trade.id}>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-medium">{trade.pair}</h3>
                                        <p className="text-sm text-muted-foreground">{new Date(trade.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Badge variant={trade.type === "Buy" ? "default" : "secondary"}>{trade.type}</Badge>
                                        <Badge variant={trade.result === "Win" ? "default" : "destructive"}>{trade.result}</Badge>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                                    <div>
                                        <span className="text-muted-foreground">Entry:</span>
                                        <br />
                                        {trade.entry.toFixed(5)}
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">SL:</span>
                                        <br />
                                        {trade.sl.toFixed(5)}
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">TP:</span>
                                        <br />
                                        {trade.tp.toFixed(5)}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">R:R: 1:{trade.rr.toFixed(2)}</span>
                                    <div className="flex space-x-2">
                                        <Button size="sm" variant="outline" asChild>
                                            <Link href={`/trades/${trade.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button size="sm" variant="outline" asChild>
                                            <Link href={`/trades/${trade.id}/edit`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {sortedTrades.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No trades found</p>
                        <Button asChild className="mt-4">
                            <Link href="/trades/new">Add Your First Trade</Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
