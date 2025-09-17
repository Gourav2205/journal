// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { BarChart3, TrendingUp, Shield, Download } from "lucide-react"

// /**
//  * Landing page component
//  * Displays app features and call-to-action for new users
//  * Redirects authenticated users to dashboard via middleware
//  */
// export default function HomePage() {
//     return (
//         <div className="min-h-screen">
//             {/* Hero section */}
//             <section className="py-20 text-center">
//                 <div className="max-w-4xl mx-auto">
//                     <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Professional Trading Journal</h1>
//                     <p className="text-xl text-muted-foreground mb-8 text-pretty">
//                         Track your trades, analyze performance, and improve your trading strategy with our comprehensive journal
//                         app.
//                     </p>
//                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                         <Button asChild size="lg">
//                             <Link href="/sign-up">Get Started Free</Link>
//                         </Button>
//                         <Button variant="outline" size="lg" asChild>
//                             <Link href="/sign-in">Sign In</Link>
//                         </Button>
//                     </div>
//                 </div>
//             </section>

//             {/* Features section */}
//             <section className="py-20">
//                 <div className="max-w-6xl mx-auto">
//                     <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Track Your Trading</h2>
//                     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//                         {/* Analytics feature */}
//                         <Card>
//                             <CardHeader>
//                                 <BarChart3 className="h-8 w-8 text-primary mb-2" />
//                                 <CardTitle>Advanced Analytics</CardTitle>
//                                 <CardDescription>
//                                     Track win rate, risk-reward ratios, and profit factors with detailed charts
//                                 </CardDescription>
//                             </CardHeader>
//                         </Card>

//                         {/* Performance tracking */}
//                         <Card>
//                             <CardHeader>
//                                 <TrendingUp className="h-8 w-8 text-primary mb-2" />
//                                 <CardTitle>Performance Tracking</CardTitle>
//                                 <CardDescription>Monitor your equity curve and trading performance over time</CardDescription>
//                             </CardHeader>
//                         </Card>

//                         {/* Secure data */}
//                         <Card>
//                             <CardHeader>
//                                 <Shield className="h-8 w-8 text-primary mb-2" />
//                                 <CardTitle>Secure & Private</CardTitle>
//                                 <CardDescription>Your trading data is encrypted and securely stored in the cloud</CardDescription>
//                             </CardHeader>
//                         </Card>

//                         {/* Export functionality */}
//                         <Card>
//                             <CardHeader>
//                                 <Download className="h-8 w-8 text-primary mb-2" />
//                                 <CardTitle>Export Data</CardTitle>
//                                 <CardDescription>Export your trading data to CSV or Excel for further analysis</CardDescription>
//                             </CardHeader>
//                         </Card>
//                     </div>
//                 </div>
//             </section>

//             {/* CTA section */}
//             <section className="py-20 text-center bg-muted/50">
//                 <div className="max-w-2xl mx-auto">
//                     <h2 className="text-3xl font-bold mb-4">Start Tracking Your Trades Today</h2>
//                     <p className="text-lg text-muted-foreground mb-8">
//                         Join thousands of traders who use our journal to improve their performance.
//                     </p>
//                     <Button asChild size="lg">
//                         <Link href="/sign-up">Create Free Account</Link>
//                     </Button>
//                 </div>
//             </section>
//         </div>
//     )
// }



import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, FileText, Download } from "lucide-react"

/**
 * Landing page component
 * Shows app features and sign-up/sign-in options
 * Redirects authenticated users to dashboard
 */
export default async function HomePage() {
    // Check if user is already authenticated
    const { userId } = await auth()

    if (userId) {
        redirect("/dashboard")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted">
            <div className="container mx-auto px-4 py-16">
                {/* Hero Section */}
                <div className="text-center space-y-8 mb-16">
                    <div className="flex justify-center">
                        <BarChart3 className="h-16 w-16 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-balance">Professional Trading Journal</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                        Track your trades, analyze performance, and improve your trading strategy with comprehensive analytics and
                        insights.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg">
                            <Link href="/sign-up">Get Started</Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/sign-in">Sign In</Link>
                        </Button>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-primary" />
                                Analytics Dashboard
                            </CardTitle>
                            <CardDescription>
                                Comprehensive trading analytics with KPIs, charts, and performance metrics
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Win rate and profit factor tracking</li>
                                <li>• Equity curve visualization</li>
                                <li>• Risk-reward ratio analysis</li>
                                <li>• Trade distribution insights</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Trade Management
                            </CardTitle>
                            <CardDescription>Complete trade logging with detailed information and screenshots</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Add, edit, and delete trades</li>
                                <li>• Screenshot attachments</li>
                                <li>• Automatic R:R calculations</li>
                                <li>• Trade filtering and search</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Download className="h-5 w-5 text-primary" />
                                Export & Reports
                            </CardTitle>
                            <CardDescription>Export your trading data for external analysis and record keeping</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• CSV export functionality</li>
                                <li>• Date range filtering</li>
                                <li>• Custom report generation</li>
                                <li>• Data backup options</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* CTA Section */}
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold">Ready to improve your trading?</h2>
                    <p className="text-muted-foreground">
                        Join thousands of traders who use our platform to track and analyze their performance.
                    </p>
                    <Button asChild size="lg">
                        <Link href="/sign-up">Start Your Trading Journal</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

