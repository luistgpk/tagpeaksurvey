# Tagpeak Survey Experience

This repository contains a production-ready, staircase-method survey that helps the Tagpeak team measure when shoppers would trade a traditional percentage discount for experiential drops.

## Features

- 🎯 Adaptive six-round staircase flow that narrows in on each respondent's switching threshold.
- 🧠 Persona calibration and qualitative prompts that keep respondents engaged through the journey.
- 💡 Insightful summary view that teams can export or discuss during campaign planning.
- 🚀 Built with Next.js 14 so it can be deployed instantly to Vercel or any Node-friendly hosting provider.

## Project structure

```text
.
├── app/
│   ├── globals.css         # Design system for the survey experience
│   ├── layout.tsx          # Root layout and metadata
│   └── page.tsx            # Entry point rendering the interactive survey
├── components/
│   └── StaircaseSurvey.tsx # Adaptive staircase logic + UI components
├── Tagpeak_Staircase_Survey.md # Original strategy blueprint for reference
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## Running locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Visit `http://localhost:3000` to explore the survey. Hot reloading is enabled.

## Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel, import the project and select the GitHub repo.
3. Accept the defaults (framework: **Next.js**, build command: `npm run build`, output: `.next`).
4. Trigger a deploy—Vercel will handle builds and environment provisioning automatically.

## Data capture tips

- Connect the submit actions to your preferred storage (e.g., Vercel Edge Functions, Supabase, Airtable) for persistence.
- Export the `history` array to study discount vs. Tagpeak crossover points at scale.
- Pair qualitative notes with the calculated switching band to fuel creative campaign workshops.

## Contributing

Issues and pull requests that improve the survey flow, styling, analytics instrumentation, or documentation are welcome. Please describe the motivation and testing steps in your PR.
