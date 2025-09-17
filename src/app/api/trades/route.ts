import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { calculateRiskReward, calculatePips } from "@/lib/utils"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * GET /api/trades
 * Fetch all trades for the authenticated user
 */
export async function GET() {
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

        // Fetch user's trades
        const trades = await prisma.trade.findMany({
            where: { userId: user.id },
            orderBy: { date: "desc" },
        })

        return NextResponse.json(trades)
    } catch (error) {
        console.error("Error fetching trades:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

/**
 * POST /api/trades
 * Create a new trade record
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

        // Parse form data
        const formData = await request.formData()
        const date = formData.get("date") as string
        const pair = formData.get("pair") as string
        const type = formData.get("type") as "Buy" | "Sell"
        const entry = Number.parseFloat(formData.get("entry") as string)
        const sl = Number.parseFloat(formData.get("sl") as string)
        const tp = Number.parseFloat(formData.get("tp") as string)
        const result = formData.get("result") as "Win" | "Loss"
        const notes = (formData.get("notes") as string) || undefined
        const screenshot = formData.get("screenshot") as File | null

        // Validate required fields
        if (!date || !pair || !type || !entry || !sl || !tp || !result) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Calculate Risk:Reward ratio
        const rr = calculateRiskReward(entry, sl, tp, type)

        // Calculate pips
        const pips = calculatePips(entry, result === "Win" ? tp : sl, pair)

        // Upload screenshot to Cloudinary if provided
        let screenshotUrl: string | undefined

        if (screenshot && screenshot.size > 0) {
            try {
                const bytes = await screenshot.arrayBuffer()
                const buffer = Buffer.from(bytes)

                // Upload to Cloudinary
                const uploadResult = (await new Promise((resolve, reject) => {
                    cloudinary.uploader
                        .upload_stream(
                            {
                                resource_type: "image",
                                folder: "trading-journal",
                                public_id: `trade-${Date.now()}`,
                            },
                            (error, result) => {
                                if (error) reject(error)
                                else resolve(result)
                            },
                        )
                        .end(buffer)
                })) as any

                screenshotUrl = uploadResult.secure_url
            } catch (uploadError) {
                console.error("Error uploading screenshot:", uploadError)
                // Continue without screenshot if upload fails
            }
        }

        // Create trade record
        const trade = await prisma.trade.create({
            data: {
                userId: user.id,
                date: new Date(date),
                pair,
                type,
                entry,
                sl,
                tp,
                result,
                pips: result === "Loss" ? -pips : pips,
                rr,
                notes,
                screenshotUrl,
            },
        })

        return NextResponse.json(trade, { status: 201 })
    } catch (error) {
        console.error("Error creating trade:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
