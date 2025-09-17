import { TradeForm } from "@/components/forms/trade-form"

/**
 * New Trade Page Component
 * Displays form for creating a new trade
 * Protected route - requires authentication
 */
export default function NewTradePage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Add New Trade</h1>
                <p className="text-muted-foreground">Record a new trade in your journal</p>
            </div>

            <TradeForm mode="create" />
        </div>
    )
}
