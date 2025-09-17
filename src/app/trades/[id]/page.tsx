import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, ArrowLeft } from "lucide-react"

/**
 * Trade Detail Page Component
 * Displays detailed view of a single trade
 * @param params - Route parameters containing trade ID
 */
export default async function TradeDetailPage({
    params,
}: {
    params: { id: string }
}) {
    // Require authentication
    const user = await requireAuth()

    // Fetch specific trade
    const trade = await prisma.trade.findFirst({
        where: {
            id: params.id,
            userId: user.id,
        },
    })

    if (!trade) {
        notFound()
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/trades">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Trades
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{trade.pair} Trade</h1>
                        <p className="text-muted-foreground">{new Date(trade.date).toLocaleDateString()}</p>
                    </div>
                </div>
                <Button asChild>
                    <Link href={`/trades/${trade.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Trade
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Trade Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Trade Details</CardTitle>
                        <CardDescription>Complete information about this trade</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Currency Pair</label>
                                <p className="text-lg font-semibold">{trade.pair}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Trade Date</label>
                                <p className="text-lg">{new Date(trade.date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Trade Type</label>
                                <div className="mt-1">
                                    <Badge variant={trade.type === "Buy" ? "default" : "secondary"}>{trade.type}</Badge>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Result</label>
                                <div className="mt-1">
                                    <Badge variant={trade.result === "Win" ? "default" : "destructive"}>{trade.result}</Badge>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Entry Price</label>
                                <p className="text-lg font-mono">{trade.entry.toFixed(5)}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Stop Loss</label>
                                <p className="text-lg font-mono">{trade.sl.toFixed(5)}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Take Profit</label>
                                <p className="text-lg font-mono">{trade.tp.toFixed(5)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Risk:Reward Ratio</label>
                                <p className="text-lg font-semibold">1:{trade.rr.toFixed(2)}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Pips</label>
                                <p className={`text-lg font-semibold ${(trade.pips || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                                    {trade.pips?.toFixed(1) || "N/A"}
                                </p>
                            </div>
                        </div>

                        {trade.notes && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Trade Notes</label>
                                <p className="mt-1 text-sm bg-muted p-3 rounded-md">{trade.notes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Screenshot */}
                <Card>
                    <CardHeader>
                        <CardTitle>Trade Screenshot</CardTitle>
                        <CardDescription>Visual record of the trade setup</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {trade.screenshotUrl ? (
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                                <Image
                                    src={trade.screenshotUrl || "/placeholder.svg"}
                                    alt={`${trade.pair} trade screenshot`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                                <p className="text-muted-foreground">No screenshot available</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
