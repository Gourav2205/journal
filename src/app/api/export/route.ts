import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { tradesToCSV, generateExportFilename, calculateTradeStats } from "@/lib/export"

/**
 * GET /api/export
 * Export user's trades to CSV format
 * Query parameters:
 * - format: 'csv' (default)
 * - dateFrom: Start date filter (optional)
 * - dateTo: End date filter (optional)
 */
export async function GET(request: NextRequest) {
    try {
        const { userId } = auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Parse query parameters
        const { searchParams } = new URL(request.url)
        const format = searchParams.get("format") || "csv"
        const dateFrom = searchParams.get("dateFrom")
        const dateTo = searchParams.get("dateTo")

        // Build date filter
        const dateFilter: any = {}
        if (dateFrom) {
            dateFilter.gte = new Date(dateFrom)
        }
        if (dateTo) {
            dateFilter.lte = new Date(dateTo)
        }

        // Fetch user's trades with optional date filtering
        const trades = await prisma.trade.findMany({
            where: {
                userId: user.id,
                ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
            },
            orderBy: { date: "desc" },
        })

        if (trades.length === 0) {
            return NextResponse.json({ error: "No trades found for export" }, { status: 404 })
        }

        // Generate CSV content
        const csvContent = tradesToCSV(trades)
        const filename = generateExportFilename("csv")

        // Return CSV file
        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        })
    } catch (error) {
        console.error("Error exporting trades:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

/**
 * POST /api/export
 * Get export statistics and preview data
 */
export async function POST(request: NextRequest) {
    try {
        const { userId } = auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Parse request body for filters
        const body = await request.json()
        const { dateFrom, dateTo } = body

        // Build date filter
        const dateFilter: any = {}
        if (dateFrom) {
            dateFilter.gte = new Date(dateFrom)
        }
        if (dateTo) {
            dateFilter.lte = new Date(dateTo)
        }

        // Fetch user's trades with optional date filtering
        const trades = await prisma.trade.findMany({
            where: {
                userId: user.id,
                ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
            },
            orderBy: { date: "desc" },
        })

        // Calculate statistics
        const stats = calculateTradeStats(trades)

        // Return preview data and statistics
        return NextResponse.json({
            stats,
            tradeCount: trades.length,
            dateRange: {
                from: dateFrom || (trades.length > 0 ? trades[trades.length - 1].date : null),
                to: dateTo || (trades.length > 0 ? trades[0].date : null),
            },
            preview: trades.slice(0, 5), // First 5 trades for preview
        })
    } catch (error) {
        console.error("Error getting export preview:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
