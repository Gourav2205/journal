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
 * GET /api/trades/[id]
 * Fetch a specific trade by ID
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

        // Fetch specific trade
        const trade = await prisma.trade.findFirst({
            where: {
                id: params.id,
                userId: user.id,
            },
        })

        if (!trade) {
            return NextResponse.json({ error: "Trade not found" }, { status: 404 })
        }

        return NextResponse.json(trade)
    } catch (error) {
        console.error("Error fetching trade:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

/**
 * PUT /api/trades/[id]
 * Update a specific trade
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

        // Check if trade exists and belongs to user
        const existingTrade = await prisma.trade.findFirst({
            where: {
                id: params.id,
                userId: user.id,
            },
        })

        if (!existingTrade) {
            return NextResponse.json({ error: "Trade not found" }, { status: 404 })
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

        // Handle screenshot upload if new file provided
        let screenshotUrl = existingTrade.screenshotUrl

        if (screenshot && screenshot.size > 0) {
            try {
                // Delete old screenshot if exists
                if (existingTrade.screenshotUrl) {
                    const publicId = existingTrade.screenshotUrl.split("/").pop()?.split(".")[0]
                    if (publicId) {
                        await cloudinary.uploader.destroy(`trading-journal/${publicId}`)
                    }
                }

                const bytes = await screenshot.arrayBuffer()
                const buffer = Buffer.from(bytes)

                // Upload new screenshot
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
                // Continue with existing screenshot if upload fails
            }
        }

        // Update trade record
        const updatedTrade = await prisma.trade.update({
            where: { id: params.id },
            data: {
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

        return NextResponse.json(updatedTrade)
    } catch (error) {
        console.error("Error updating trade:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

/**
 * DELETE /api/trades/[id]
 * Delete a specific trade
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

        // Check if trade exists and belongs to user
        const existingTrade = await prisma.trade.findFirst({
            where: {
                id: params.id,
                userId: user.id,
            },
        })

        if (!existingTrade) {
            return NextResponse.json({ error: "Trade not found" }, { status: 404 })
        }

        // Delete screenshot from Cloudinary if exists
        if (existingTrade.screenshotUrl) {
            try {
                const publicId = existingTrade.screenshotUrl.split("/").pop()?.split(".")[0]
                if (publicId) {
                    await cloudinary.uploader.destroy(`trading-journal/${publicId}`)
                }
            } catch (error) {
                console.error("Error deleting screenshot:", error)
                // Continue with trade deletion even if screenshot deletion fails
            }
        }

        // Delete trade record
        await prisma.trade.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: "Trade deleted successfully" })
    } catch (error) {
        console.error("Error deleting trade:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
