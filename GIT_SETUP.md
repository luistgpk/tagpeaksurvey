# Git Setup Guide for Tagpeak Survey

## 🚀 Quick Setup

Your Git repository has been initialized and your first commit is ready! Here's how to push it to GitHub:

## 📋 Step-by-Step Instructions

### 1. Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** button in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `tagpeak-survey` (or your preferred name)
   - **Description**: "Consumer Psychology Survey for Tagpeak - Staircase Method Implementation"
   - **Visibility**: Choose **Private** (recommended for business projects)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)

### 2. Connect Your Local Repository

After creating the GitHub repository, you'll see a page with setup instructions. Use the **"push an existing repository from the command line"** section:

```bash
# Add the remote origin (replace with your actual GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/tagpeak-survey.git

# Push your code to GitHub
git push -u origin master
```

### 3. Alternative: Using GitHub CLI (if installed)

```bash
# Create repository and push in one command
gh repo create tagpeak-survey --private --source=. --remote=origin --push
```

## 🔧 Git Configuration (First Time Setup)

If this is your first time using Git, you may need to configure your identity:

```bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 📁 Repository Structure

Your repository now contains:

```
tagpeak-survey/
├── .gitignore              # Git ignore rules
├── index.html             # Main survey page
├── js/
│   ├── app-complete.js    # Complete survey logic
│   ├── app.js             # Modular app structure
│   ├── screens.js         # Screen rendering functions
│   └── staircase.js       # Staircase method logic
├── supabase/
│   └── schema.sql         # Database schema
├── build.js               # Environment variable injection
├── package.json           # Dependencies and scripts
├── vercel.json           # Vercel deployment config
├── env.example           # Environment variables template
├── test-survey.html      # Local testing file
├── README.md             # Project documentation
├── DEPLOYMENT.md         # Deployment instructions
├── SECURITY.md           # Security documentation
└── GIT_SETUP.md          # This file
```

## 🔒 Security Notes

- **Never commit** your actual `.env` file
- The `env.example` file is safe to commit (contains placeholder values)
- Your Supabase credentials should only be set in Vercel environment variables
- The `.gitignore` file protects sensitive files

## 🚀 Next Steps After Pushing

1. **Set up Vercel deployment**:
   - Connect your GitHub repository to Vercel
   - Configure environment variables in Vercel dashboard
   - Deploy automatically on every push

2. **Set up Supabase**:
   - Create your Supabase project
   - Run the SQL schema from `supabase/schema.sql`
   - Get your project URL and API key

3. **Configure environment variables**:
   - Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to Vercel
   - Test the deployment

## 📝 Useful Git Commands

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull

# View commit history
git log --oneline

# Create a new branch
git checkout -b feature-name

# Switch branches
git checkout master
```

## 🐛 Troubleshooting

### If you get authentication errors:
```bash
# Use GitHub CLI for authentication
gh auth login

# Or configure Git credentials
git config --global credential.helper store
```

### If you need to change the remote URL:
```bash
# Check current remote
git remote -v

# Change remote URL
git remote set-url origin https://github.com/YOUR_USERNAME/tagpeak-survey.git
```

### If you need to remove a file from Git:
```bash
# Remove from Git but keep local file
git rm --cached filename

# Remove completely
git rm filename
```

## 🎯 Ready to Deploy!

Once you've pushed to GitHub:

1. **Vercel**: Connect your GitHub repo to Vercel for automatic deployments
2. **Supabase**: Set up your database and get your credentials
3. **Environment Variables**: Configure in Vercel dashboard
4. **Test**: Run `npm run build` locally to test the build process

Your survey is now ready for professional deployment! 🚀
