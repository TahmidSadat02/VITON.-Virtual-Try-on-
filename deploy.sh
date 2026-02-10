#!/bin/bash

# Quick Deployment Script for Virtual Try-On
# This script automates the deployment process

set -e  # Exit on any error

echo "Virtual Try-On - Quick Deployment"
echo "===================================="
echo ""

# Check if .env.local exists and has credentials
if [ ! -f .env.local ]; then
    echo " Error: .env.local not found"
    echo "   Run ./setup.sh first"
    exit 1
fi

# Check if Supabase URL is configured
if grep -q "your_supabase_project_url_here" .env.local; then
    echo " Error: Supabase credentials not configured"
    echo "   Edit .env.local and add your Supabase URL and keys"
    exit 1
fi

echo " Environment configured"
echo ""

# Install dependencies if needed
if [ ! -d node_modules ]; then
    echo " Installing dependencies..."
    npm install
fi

echo " Dependencies ready"
echo ""

# Build the project
echo " Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo " Build failed! Fix errors and try again."
    exit 1
fi

echo " Build successful"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo " Initializing git repository..."
    git init
    git branch -M main
fi

# Check if changes need to be committed
if [[ -n $(git status -s) ]]; then
    echo " Committing changes..."
    git add .
    git commit -m "Deploy: $(date +%Y-%m-%d-%H:%M:%S)"
    echo " Changes committed"
else
    echo " No new changes to commit"
fi

echo ""
echo " Ready to deploy!"
echo ""
echo "Next steps:"
echo ""
echo "1. Push to GitHub:"
echo "   git remote add origin https://github.com/yourusername/virtual-tryon.git"
echo "   git push -u origin main"
echo ""
echo "2. Deploy on Netlify:"
echo "   - Go to https://app.netlify.com"
echo "   - Click 'Add new site' → 'Import from GitHub'"
echo "   - Select your repository"
echo "   - Add environment variables from .env.local"
echo "   - Click 'Deploy site'"
echo ""
echo "3. Configure Supabase:"
echo "   - Add your Netlify URL to Supabase redirect URLs"
echo "   - Update Site URL in Supabase Authentication settings"
echo ""
echo " See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
