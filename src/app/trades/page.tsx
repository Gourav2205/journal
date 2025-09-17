"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TradeTable } from "@/components/trade-table"
import type { Trade } from "@/types/trade"
import { Plus } from "lucide-react"

/**
 * Trades Page Component
 * Displays all user trades in a table with CRUD operations
 * Protected route - requires authentication
 */
export default function TradesPage() {
    const [trades, setTrades] = useState<Trade[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Fetch trades on component mount
    useEffect(() => {
        fetchTrades()
    }, [])

    // Fetch trades from API
    const fetchTrades = async () => {
        try {
            const response = await fetch("/api/trades")
            if (response.ok) {
                const data = await response.json()
                setTrades(data)
            } else {
                console.error("Failed to fetch trades")
            }
        } catch (error) {
            console.error("Error fetching trades:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Handle trade deletion
    const handleDelete = async (tradeId: string) => {
        if (!confirm("Are you sure you want to delete this trade?")) {
            return
        }

        try {
            const response = await fetch(`/api/trades/${tradeId}`, {
                method: "DELETE",
            })

            if (response.ok) {
                // Remove trade from local state
                setTrades(trades.filter((trade) => trade.id !== tradeId))
            } else {
                alert("Failed to delete trade")
            }
        } catch (error) {
            console.error("Error deleting trade:", error)
            alert("Failed to delete trade")
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-8 m-7">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Trade Journal</h1>
                        <p className="text-muted-foreground">Manage your trading records</p>
                    </div>
                    <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
                </div>
                <div className="h-96 bg-muted animate-pulse rounded-lg" />
            </div>
        )
    }

    return (
        <div className="space-y-8 m-7">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Trade Journal</h1>
                    <p className="text-muted-foreground">Manage your trading records and track performance</p>
                </div>
                <Button asChild>
                    <Link href="/trades/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Trade
                    </Link>
                </Button>
            </div>

            <TradeTable trades={trades} onDelete={handleDelete} />
        </div>
    )
}
