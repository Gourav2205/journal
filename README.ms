# Trading Journal Web App

A comprehensive trading journal application built with Next.js, TypeScript, and modern web technologies. Track your trades, analyze performance, and improve your trading strategy.

## 🚀 Features

- **Authentication**: Secure user authentication with Clerk
- **Trade Management**: Full CRUD operations for trading records
- **Analytics Dashboard**: KPI cards, equity curve, win rate charts
- **Data Export**: Export trades to CSV for external analysis
- **Screenshot Upload**: Cloudinary integration for trade screenshots
- **Responsive Design**: Mobile-friendly interface with dark/light themes
- **Real-time Calculations**: Auto-calculated Risk:Reward ratios and pips

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Authentication**: Clerk
- **Database**: PostgreSQL with Prisma ORM
- **Charts**: Recharts
- **File Upload**: Cloudinary
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd trading-journal
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Fill in your environment variables:
   - Clerk authentication keys
   - Database URL (Neon/PostgreSQL)
   - Cloudinary credentials

4. **Set up the database**
   \`\`\`bash
   npm run db:push
   npm run db:generate
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

Create a `.env` file with the following variables:

\`\`\`env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database (Neon/PostgreSQL)
DATABASE_URL="postgresql://username:password@host:5432/database_name?sslmode=require"

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
\`\`\`

## 📁 Project Structure

\`\`\`
trading-journal/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── dashboard/         # Dashboard page
│   │   ├── trades/            # Trade management pages
│   │   ├── export/            # Export functionality
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── charts/            # Chart components
│   │   └── forms/             # Form components
│   ├── lib/                   # Utility functions
│   ├── types/                 # TypeScript type definitions
│   └── styles/                # Global styles
├── prisma/                    # Database schema
└── public/                    # Static assets
\`\`\`

## 🎯 Usage

1. **Sign Up/Sign In**: Create an account or sign in with existing credentials
2. **Add Trades**: Record your trades with entry, stop loss, take profit, and notes
3. **View Dashboard**: Analyze your performance with charts and KPIs
4. **Manage Trades**: Edit, delete, or view detailed trade information
5. **Export Data**: Download your trading data as CSV for further analysis

## 📊 Features Overview

### Dashboard Analytics
- Total trades count
- Win rate percentage
- Average Risk:Reward ratio
- Profit factor calculation
- Equity curve visualization
- Win/Loss distribution charts

### Trade Management
- Add new trades with screenshot upload
- Auto-calculate Risk:Reward ratios
- Edit existing trade records
- Delete unwanted trades
- Search and filter functionality

### Export Functionality
- Export trades to CSV format
- Date range filtering
- Export preview with statistics
- Compatible with Excel and Google Sheets

## 🚀 Deployment

The app is optimized for deployment on Vercel:

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Set environment variables**
4. **Deploy**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue on GitHub or contact the development team.
