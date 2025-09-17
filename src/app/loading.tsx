import { Card, CardContent, CardHeader } from "@/components/ui/card"

/**
 * Global Loading Component
 * Displayed during page transitions and data loading
 */
export default function Loading() {
    return (
        <div className="space-y-8">
            {/* Header skeleton */}
            <div className="space-y-2">
                <div className="h-8 w-64 bg-muted animate-pulse rounded-md" />
                <div className="h-4 w-96 bg-muted animate-pulse rounded-md" />
            </div>

            {/* Content skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <div className="h-4 w-24 bg-muted animate-pulse rounded-md" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 w-16 bg-muted animate-pulse rounded-md" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Large content skeleton */}
            <div className="h-96 bg-muted animate-pulse rounded-lg" />
        </div>
    )
}
