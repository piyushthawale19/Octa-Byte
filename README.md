# 📊 Dynamic Portfolio Dashboard

A production-ready, real-time stock portfolio tracking dashboard built with Next.js, TypeScript, and Tailwind CSS. Fetches live market data from Yahoo Finance (CMP) and Google Finance (P/E Ratio, Latest Earnings) with auto-refresh functionality.

![Portfolio Dashboard](https://img.shields.io/badge/Next.js-v16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwind-css)

## 🚀 Features

### Core Functionality
- ✅ **Real-time Stock Data**: Fetches live CMP from Yahoo Finance
- ✅ **Financial Metrics**: P/E Ratio and Latest Earnings from Google Finance
- ✅ **Auto-refresh**: Updates every 15 seconds automatically
- ✅ **Sector Grouping**: Organizes stocks by industry sector
- ✅ **Portfolio Analytics**: Displays investment, present value, and gain/loss
- ✅ **Visual Indicators**: Color-coded profit (green) and loss (red)

### Technical Features
- 🔄 **Parallel API Calls**: Uses `Promise.all()` for efficient data fetching
- 💾 **Smart Caching**: In-memory cache with 60-second TTL to avoid rate limits
- 🎨 **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- 🛡️ **Error Handling**: Graceful degradation when data is unavailable
- ⚡ **Performance Optimized**: Memoization and efficient re-rendering
- 🔍 **TypeScript**: Fully typed for type safety and better DX

## 📋 Portfolio Table Columns

| Column | Description | Source |
|--------|-------------|--------|
| **Particulars** | Stock name | Static data |
| **Purchase Price** | Price at which stock was bought | Static data |
| **Quantity (Qty)** | Number of shares owned | Static data |
| **Investment** | Purchase Price × Qty | Calculated |
| **Portfolio %** | Percentage of total portfolio | Calculated |
| **NSE/BSE** | Exchange code | Static data |
| **CMP** | Current Market Price | Yahoo Finance |
| **Present Value** | CMP × Qty | Calculated |
| **Gain/Loss** | Present Value - Investment | Calculated |
| **P/E Ratio** | Price-to-Earnings ratio | Google Finance |
| **Latest Earnings** | Recent earnings report | Google Finance |

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Data Fetching**: 
  - `yahoo-finance2` - Yahoo Finance data
  - `cheerio` - Google Finance scraping
  - `axios` - HTTP requests

### Deployment
- **Platform**: Vercel / Netlify
- **Repository**: GitHub (public)

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/portfolio-dashboard.git
cd portfolio-dashboard
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Configure Holdings Data
Edit `data/holdings.json` to add your stock holdings:

```json
[
  {
    "particulars": "Reliance Industries",
    "purchasePrice": 2450.50,
    "quantity": 10,
    "exchange": "NSE",
    "sector": "Energy",
    "symbol": "RELIANCE.NS"
  }
]
```

**Symbol Format:**
- NSE stocks: `SYMBOL.NS` (e.g., `RELIANCE.NS`)
- BSE stocks: `SYMBOL.BO` (e.g., `RELIANCE.BO`)

### Step 4: Run Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 5: Build for Production
```bash
npm run build
npm start
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Next.js and deploy

### Deploy to Netlify
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import repository
4. Set build command: `npm run build`
5. Set publish directory: `.next`

## 📁 Project Structure

```
portfolio-dashboard/
├── app/
│   ├── api/
│   │   └── stocks/
│   │       └── route.ts          # API endpoint for fetching stock data
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main dashboard page
│   └── globals.css               # Global styles
├── components/
│   ├── SummaryCards.tsx          # Top summary cards
│   ├── SectorGroup.tsx           # Sector accordion component
│   └── StockRow.tsx              # Individual stock row
├── lib/
│   ├── finance/
│   │   ├── yahooFinance.ts       # Yahoo Finance integration
│   │   └── googleFinance.ts      # Google Finance scraper
│   ├── types/
│   │   └── portfolio.ts          # TypeScript interfaces
│   └── utils/
│       ├── cache.ts              # Caching utility
│       └── calculations.ts       # Portfolio calculations
├── data/
│   └── holdings.json             # Your portfolio holdings
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🔧 How It Works

### Data Flow
1. **Static Data**: Holdings loaded from `holdings.json`
2. **API Call**: Frontend calls `/api/stocks` every 15 seconds
3. **Parallel Fetching**: Backend fetches Yahoo (CMP) and Google (P/E, Earnings) in parallel
4. **Caching**: Results cached for 60 seconds to avoid rate limits
5. **Calculations**: Frontend merges live data with static data and computes metrics
6. **Rendering**: Components display updated portfolio with color-coded gains/losses

### Caching Strategy
```typescript
// Cache structure
{
  key: "yahoo_RELIANCE.NS",
  data: 2678.50,
  expiresAt: timestamp + 60000 // 60 seconds
}
```

### Error Handling
- If Yahoo Finance fails → Uses purchase price as fallback
- If Google Finance fails → Shows "N/A" for P/E and earnings
- If entire API fails → Shows error message with retry option

## 🎨 UI Design Principles

### Color Coding
- **Green**: Profit (positive gain/loss)
- **Red**: Loss (negative gain/loss)
- **Blue**: Informational (investment, present value)

### Responsive Breakpoints
- Mobile: < 768px (stacked cards, horizontal scroll table)
- Tablet: 768px - 1024px (2-column layout)
- Desktop: > 1024px (3-column layout)

## 🧪 Testing Recommendations

### Manual Testing
1. Verify all stocks load correctly
2. Check auto-refresh after 15 seconds
3. Test manual refresh button
4. Confirm gain/loss colors are correct
5. Test on mobile devices
6. Verify error handling (disconnect internet)

### API Testing
```bash
# Test API endpoint directly
curl http://localhost:3000/api/stocks
```

## ⚠️ Known Limitations

### Data Source Reliability
- **Yahoo Finance**: Unofficial library, may break if Yahoo changes their API
- **Google Finance**: Web scraping, may break if Google changes their HTML structure
- **Rate Limits**: Excessive requests may result in temporary blocks

### Solutions Implemented
- ✅ Caching to reduce API calls
- ✅ Error handling with fallback values
- ✅ User-friendly error messages
- ✅ Retry mechanism

## 🏆 Assumptions Made

1. **Symbol Format**: All NSE stocks use `.NS` suffix, BSE use `.BO`
2. **Currency**: All values displayed in Indian Rupees (₹)
3. **Market Hours**: CMP updates reflect live prices during market hours
4. **Data Accuracy**: Yahoo Finance CMP is considered most reliable
5. **Refresh Rate**: 15 seconds balances real-time updates with API limits
6. **Sector Classification**: Manually defined in holdings data

## 📝 Technical Challenges & Solutions

See [CHALLENGES.md](./CHALLENGES.md) for detailed write-up.

## 🤝 Contributing

This is a case study project. Contributions are welcome for educational purposes.

## 📄 License

MIT License - feel free to use for learning and portfolio purposes.

## 👨‍💻 Author

Built as a full-stack case study project demonstrating:
- Modern React patterns (hooks, memoization)
- TypeScript type safety
- API integration (unofficial sources)
- Real-time data handling
- Production-ready code structure

---

**Note**: This project uses unofficial APIs and web scraping. For production use with real money, consider using official brokerage APIs or paid financial data providers.
#
