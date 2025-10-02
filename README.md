# Tagpeak Consumer Psychology Study

A modern, engaging survey designed to evaluate the psychological consequences of Tagpeak's innovative cashback mechanism versus traditional cashback and discounts using the staircase method.

## 🎯 Study Objectives

- Understand consumer decision-making patterns when choosing between traditional discounts and innovative investment-linked benefits
- Determine the discount threshold at which consumers prefer Tagpeak over traditional benefits
- Analyze psychological factors influencing shopping behavior
- Generate insights about risk tolerance, time preference, and value perception

## 🚀 Features

### Modern Design
- **Glass morphism UI** with beautiful gradients and animations
- **Responsive design** that works on all devices
- **Interactive elements** with hover effects and transitions
- **Psychology hints** to keep participants engaged

### Scientific Methodology
- **Staircase method** for precise threshold measurement
- **Catch trials** to ensure data quality
- **Psychology profiling** to understand decision-making styles
- **Demographic collection** for comprehensive analysis

### Technology Stack
- **Frontend**: Vanilla JavaScript with Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Development**: Cursor IDE

## 📊 Survey Structure

1. **Welcome Screen** - Introduction and psychology hints
2. **Tagpeak Explanation** - Understanding the new mechanism
3. **Psychology Quiz** - Risk tolerance and time preference assessment
4. **Staircase Study** - Core decision-making evaluation
5. **Demographics** - Background information collection
6. **Results** - Personalized psychology profile
7. **Thank You** - Completion and next steps

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (for local development)
- Supabase account
- Vercel account

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tagpeak-psychology-survey
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL schema from `supabase/schema.sql`
   - Get your project URL and anon key

4. **Configure environment variables**
   - Update `js/app.js` with your Supabase credentials:
   ```javascript
   const CONFIG = {
       supabase: {
           url: 'YOUR_SUPABASE_URL',
           anonKey: 'YOUR_SUPABASE_ANON_KEY'
       },
       // ... rest of config
   };
   ```

5. **Start local server**
   ```bash
   npm run dev
   ```

### Deployment to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set environment variables in Vercel dashboard**
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key

## 📈 Data Collection

The survey collects the following data:

### Psychology Profile
- Risk tolerance (conservative, moderate, aggressive)
- Time preference (immediate, future-oriented)
- Decision-making style

### Staircase Results
- Indifference points for each product category
- Choice patterns and reversals
- Catch trial performance

### Demographics
- Age, gender, education
- Investment experience
- Shopping preferences
- Income range

## 🔍 Data Analysis

The Supabase schema includes:

- **survey_responses** table for raw data
- **psychology_insights** table for aggregated insights
- **survey_analytics** view for quick statistics
- **get_indifference_stats()** function for detailed analysis

### Key Metrics
- Average indifference points by product category
- Psychology profile distributions
- Demographic correlations
- Time-to-completion statistics

## 🎨 Design Philosophy

### Visual Appeal
- **Gradient backgrounds** for modern aesthetics
- **Glass morphism cards** for depth and elegance
- **Smooth animations** for engaging interactions
- **Psychology hints** to maintain interest

### User Experience
- **Progress indicators** to show completion status
- **Psychology insights** to provide value to participants
- **Responsive design** for all devices
- **Accessibility features** for inclusive participation

### Scientific Rigor
- **Randomized product order** to avoid bias
- **Catch trials** to ensure attention
- **Multiple product categories** for generalizability
- **Comprehensive demographics** for analysis

## 📊 Expected Outcomes

This study will provide insights into:

1. **Consumer Psychology**: How different benefit structures appeal to different psychological profiles
2. **Decision Thresholds**: The exact discount percentages where consumers switch preferences
3. **Market Segmentation**: Which demographics are most receptive to innovative benefits
4. **Product Positioning**: How to position Tagpeak for maximum appeal

## 🔒 Privacy & Ethics

- **Anonymous data collection** - no personal identifiers stored
- **Informed consent** - clear explanation of study purpose
- **Data security** - encrypted storage in Supabase
- **Ethical guidelines** - follows research best practices

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

This is a research project for Tagpeak. For questions or contributions, please contact the research team.

---

**Built with ❤️ for understanding consumer psychology and improving shopping experiences.**
