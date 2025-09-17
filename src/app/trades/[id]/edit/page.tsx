import { notFound } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { TradeForm } from "@/components/forms/trade-form"
import type { TradeFormData } from "@/types/trade"

/**
 * Edit Trade Page Component
 * Displays form for editing an existing trade
 * @param params - Route parameters containing trade ID
 */
export default async function EditTradePage({
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

    // Convert trade data to form format
    const initialData: Partial<TradeFormData> = {
        date: trade.date.toISOString().split("T")[0],
        pair: trade.pair,
        type: trade.type as "Buy" | "Sell",
        entry: trade.entry.toString(),
        sl: trade.sl.toString(),
        tp: trade.tp.toString(),
        result: trade.result as "Win" | "Loss",
        notes: trade.notes || "",
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Edit Trade</h1>
                <p className="text-muted-foreground">Update your trade details for {trade.pair}</p>
            </div>

            <TradeForm mode="edit" tradeId={trade.id} initialData={initialData} />
        </div>
    )
}
