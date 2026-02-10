# Virtual Try-On - Supabase & Netlify Setup Script
# This script helps you set up your environment

Write-Host "🚀 Virtual Try-On - Setup Assistant" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (!(Test-Path .env.local)) {
    Write-Host "📝 Creating .env.local file..." -ForegroundColor Yellow
    Copy-Item .env.local.example .env.local
    Write-Host "✅ Created .env.local" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Edit .env.local and add your Supabase credentials!" -ForegroundColor Yellow
    Write-Host "   1. Go to https://supabase.com"
    Write-Host "   2. Get your Project URL and anon key"
    Write-Host "   3. Update the values in .env.local"
    Write-Host ""
} else {
    Write-Host "✅ .env.local already exists" -ForegroundColor Green
}

# Check if node_modules exists
if (!(Test-Path node_modules)) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Configure Supabase:"
Write-Host "   - Create project at https://supabase.com"
Write-Host "   - Run the SQL from supabase-schema.sql"
Write-Host "   - Create storage buckets (user-photos, dress-images, tryon-results)"
Write-Host "   - Run storage-policies.sql for bucket permissions"
Write-Host ""
Write-Host "2. Update .env.local with your Supabase credentials"
Write-Host ""
Write-Host "3. Test locally:"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "4. Deploy to Netlify:"
Write-Host "   - Push code to GitHub"
Write-Host "   - Connect repository on netlify.com"
Write-Host "   - Add environment variables in Netlify"
Write-Host ""
Write-Host "📖 Read DEPLOYMENT_GUIDE.md for detailed instructions" -ForegroundColor Cyan
Write-Host ""
