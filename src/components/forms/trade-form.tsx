"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateRiskReward } from "@/lib/utils"
import type { TradeFormData } from "@/types/trade"
import { Upload } from "lucide-react"

/**
 * Trade Form component props
 */
interface TradeFormProps {
    initialData?: Partial<TradeFormData>
    tradeId?: string
    mode: "create" | "edit"
}

/**
 * Trade Form component
 * Handles creating and editing trades with validation
 * Includes file upload for screenshots and auto R:R calculation
 * @param initialData - Pre-filled form data for editing
 * @param tradeId - Trade ID for editing mode
 * @param mode - Form mode (create or edit)
 */
export function TradeForm({ initialData, tradeId, mode }: TradeFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState<TradeFormData>({
        date: initialData?.date || new Date().toISOString().split("T")[0],
        pair: initialData?.pair || "",
        type: initialData?.type || "Buy",
        entry: initialData?.entry || "",
        sl: initialData?.sl || "",
        tp: initialData?.tp || "",
        result: initialData?.result || "Win",
        notes: initialData?.notes || "",
    })
    const [screenshot, setScreenshot] = useState<File | null>(null)

    // Calculate Risk:Reward ratio when prices change
    const calculateRR = () => {
        const entry = Number.parseFloat(formData.entry)
        const sl = Number.parseFloat(formData.sl)
        const tp = Number.parseFloat(formData.tp)

        if (entry && sl && tp) {
            return calculateRiskReward(entry, sl, tp, formData.type)
        }
        return 0
    }

    // Handle form field changes
    const handleChange = (field: keyof TradeFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    // Handle file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setScreenshot(file)
        }
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Create FormData for file upload
            const submitData = new FormData()

            // Add form fields
            Object.entries(formData).forEach(([key, value]) => {
                submitData.append(key, value)
            })

            // Add screenshot if present
            if (screenshot) {
                submitData.append("screenshot", screenshot)
            }

            // Submit to API
            const url = mode === "edit" ? `/api/trades/${tradeId}` : "/api/trades"
            const method = mode === "edit" ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                body: submitData,
            })

            if (!response.ok) {
                throw new Error("Failed to save trade")
            }

            // Redirect to trades page
            router.push("/trades")
            router.refresh()
        } catch (error) {
            console.error("Error saving trade:", error)
            alert("Failed to save trade. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const riskReward = calculateRR()

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{mode === "edit" ? "Edit Trade" : "Add New Trade"}</CardTitle>
                <CardDescription>
                    {mode === "edit" ? "Update your trade details" : "Record a new trade in your journal"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Date and Pair */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Trade Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleChange("date", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pair">Currency Pair</Label>
                            <Input
                                id="pair"
                                placeholder="e.g., EURUSD, GBPJPY"
                                value={formData.pair}
                                onChange={(e) => handleChange("pair", e.target.value.toUpperCase())}
                                required
                            />
                        </div>
                    </div>

                    {/* Trade Type and Result */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Trade Type</Label>
                            <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Buy">Buy</SelectItem>
                                    <SelectItem value="Sell">Sell</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="result">Trade Result</Label>
                            <Select value={formData.result} onValueChange={(value) => handleChange("result", value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Win">Win</SelectItem>
                                    <SelectItem value="Loss">Loss</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Entry, SL, TP */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="entry">Entry Price</Label>
                            <Input
                                id="entry"
                                type="number"
                                step="0.00001"
                                placeholder="1.12345"
                                value={formData.entry}
                                onChange={(e) => handleChange("entry", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sl">Stop Loss</Label>
                            <Input
                                id="sl"
                                type="number"
                                step="0.00001"
                                placeholder="1.12000"
                                value={formData.sl}
                                onChange={(e) => handleChange("sl", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tp">Take Profit</Label>
                            <Input
                                id="tp"
                                type="number"
                                step="0.00001"
                                placeholder="1.13000"
                                value={formData.tp}
                                onChange={(e) => handleChange("tp", e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Risk:Reward Display */}
                    {riskReward > 0 && (
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm font-medium">
                                Risk:Reward Ratio: <span className="text-primary">1:{riskReward.toFixed(2)}</span>
                            </p>
                        </div>
                    )}

                    {/* Screenshot Upload */}
                    <div className="space-y-2">
                        <Label htmlFor="screenshot">Trade Screenshot (Optional)</Label>
                        <div className="flex items-center space-x-2">
                            <Input id="screenshot" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            <Button type="button" variant="outline" onClick={() => document.getElementById("screenshot")?.click()}>
                                <Upload className="h-4 w-4 mr-2" />
                                {screenshot ? screenshot.name : "Upload Screenshot"}
                            </Button>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Trade Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            placeholder="Analysis, reasons for entry/exit, lessons learned..."
                            value={formData.notes}
                            onChange={(e) => handleChange("notes", e.target.value)}
                            rows={4}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : mode === "edit" ? "Update Trade" : "Add Trade"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
