#!/bin/bash

# Virtual Try-On - Supabase & Netlify Setup Script
# This script helps you set up your environment

echo "🚀 Virtual Try-On - Setup Assistant"
echo "=================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.local.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your Supabase credentials!"
    echo "   1. Go to https://supabase.com"
    echo "   2. Get your Project URL and anon key"
    echo "   3. Update the values in .env.local"
    echo ""
else
    echo "✅ .env.local already exists"
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. Configure Supabase:"
echo "   - Create project at https://supabase.com"
echo "   - Run the SQL from supabase-schema.sql"
echo "   - Create storage buckets (user-photos, dress-images, tryon-results)"
echo "   - Run storage-policies.sql for bucket permissions"
echo ""
echo "2. Update .env.local with your Supabase credentials"
echo ""
echo "3. Test locally:"
echo "   npm run dev"
echo ""
echo "4. Deploy to Netlify:"
echo "   - Push code to GitHub"
echo "   - Connect repository on netlify.com"
echo "   - Add environment variables in Netlify"
echo ""
echo "📖 Read DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
