# Tagpeak Psychology Survey - Deployment Guide

## 🚀 Quick Start

This survey is designed to run on Vercel with Supabase as the backend. No additional server is needed!

## 📋 Prerequisites

1. **Supabase Account**: Create at [supabase.com](https://supabase.com)
2. **Vercel Account**: Create at [vercel.com](https://vercel.com)
3. **GitHub Account**: For code repository

## 🛠️ Setup Instructions

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (usually 2-3 minutes)
3. Go to **Settings > API** in your Supabase dashboard
4. Copy your **Project URL** and **anon public** key

### Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the entire contents of `supabase/schema.sql`
3. Click **Run** to execute the schema

### Step 3: Configure Environment Variables

#### Option A: Local Development
1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

#### Option B: Vercel Deployment
1. In your Vercel dashboard, go to **Settings > Environment Variables**
2. Add these variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

**⚠️ Never put credentials directly in the code!**

### Step 4: Deploy to Vercel

#### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

#### Option B: Deploy via GitHub

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Vercel will automatically deploy your site

### Step 5: Set Environment Variables (Optional)

If you want to use environment variables instead of hardcoding:

1. In your Vercel dashboard, go to **Settings > Environment Variables**
2. Add:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key

3. Update `js/app-complete.js` to use environment variables:
   ```javascript
   const CONFIG = {
       supabase: {
           url: process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL',
           anonKey: process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'
       },
       // ... rest of config
   };
   ```

## 🔧 Local Development

To run locally:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start local server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**: `http://localhost:8000`

## 📊 Data Collection

The survey collects:

- **Psychology Profile**: Risk tolerance, time preference
- **Staircase Results**: Indifference points for each product
- **Demographics**: Age, gender, education, etc.
- **Session Data**: Timing, choices, reversals

## 🔍 Data Analysis

Use these Supabase queries to analyze your data:

### Basic Statistics
```sql
SELECT * FROM survey_analytics;
```

### Indifference Point Analysis
```sql
SELECT * FROM indifference_analysis;
```

### Detailed Results
```sql
SELECT * FROM get_indifference_stats();
```

### Psychology Profile Distribution
```sql
SELECT 
    psychology_profile->>'riskTolerance' as risk_tolerance,
    psychology_profile->>'timePreference' as time_preference,
    COUNT(*) as count
FROM survey_responses
GROUP BY psychology_profile->>'riskTolerance', psychology_profile->>'timePreference';
```

## 🎨 Customization

### Colors and Branding
Edit the CSS variables in `index.html`:
```css
:root {
    --primary: #6366f1;      /* Main brand color */
    --secondary: #f59e0b;    /* Accent color */
    --accent: #10b981;       /* Success color */
}
```

### Products and Pricing
Update the products in `js/app-complete.js`:
```javascript
products: [
    { id: 'low', name: 'Your Product', price: 299, currency: '€', category: 'Category' },
    // Add more products
]
```

### Psychology Hints
Customize the hints in `js/app-complete.js`:
```javascript
psychologyHints: [
    "Your custom hint here",
    "Another engaging insight",
    // Add more hints
]
```

## 🔒 Security & Privacy

- **Anonymous Data**: No personal identifiers are stored
- **Row Level Security**: Enabled on all tables
- **Data Encryption**: Supabase handles encryption at rest
- **GDPR Compliant**: Easy data deletion if needed

## 📈 Analytics Dashboard

Create a simple dashboard by querying the views:

```sql
-- Daily response count
SELECT survey_date, total_responses 
FROM survey_analytics 
ORDER BY survey_date DESC;

-- Average indifference points
SELECT survey_date, avg_indifference_point 
FROM indifference_analysis 
ORDER BY survey_date DESC;
```

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection Error**
   - Check your URL and API key
   - Ensure your Supabase project is active

2. **Database Schema Errors**
   - Make sure you ran the complete `schema.sql`
   - Check for any syntax errors in the SQL

3. **Vercel Deployment Issues**
   - Ensure all files are committed to git
   - Check the build logs in Vercel dashboard

### Support

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)

## 🎯 Next Steps

1. **Test the Survey**: Complete it yourself to ensure everything works
2. **Share the Link**: Distribute your Vercel URL to participants
3. **Monitor Data**: Check your Supabase dashboard for incoming responses
4. **Analyze Results**: Use the provided SQL queries to gain insights

---

**Ready to launch your psychology study! 🚀**
