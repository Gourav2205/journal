import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * KPI Card component props interface
 */
interface KPICardProps {
    title: string
    value: string | number
    icon: LucideIcon
    description?: string
    trend?: "up" | "down" | "neutral"
    className?: string
}

/**
 * KPI Card component for displaying key performance indicators
 * Used on dashboard to show trading statistics
 * @param title - Card title (e.g., "Total Trades")
 * @param value - Main value to display
 * @param icon - Lucide icon component
 * @param description - Optional description text
 * @param trend - Optional trend indicator
 * @param className - Additional CSS classes
 */
export function KPICard({ title, value, icon: Icon, description, trend = "neutral", className }: KPICardProps) {
    return (
        <Card className={cn("", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <p
                        className={cn(
                            "text-xs mt-1",
                            trend === "up" && "text-green-600",
                            trend === "down" && "text-red-600",
                            trend === "neutral" && "text-muted-foreground",
                        )}
                    >
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
