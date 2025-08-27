#!/bin/bash

echo "🚀 Building and deploying HMS..."

# Build frontend
echo "📱 Building frontend..."
cd frontend
npm run build
cd ..

# Build admin
echo "👨‍💼 Building admin..."
cd admin
npm run build
cd ..

# Commit and push
echo "📝 Committing changes..."
git add .
git commit -m "Build: $(date)"
git push origin main

echo "✅ Deployment complete!"
echo "📱 Frontend: https://your-frontend-domain.com"
echo "👨‍💼 Admin: https://your-admin-domain.com"
echo "🔧 Backend: https://your-backend-domain.com"
echo ""
echo "📋 Next steps:"
echo "1. Deploy backend to Railway/Render/Vercel"
echo "2. Deploy frontend to Vercel/Netlify"
echo "3. Deploy admin to Vercel/Netlify"
echo "4. Update environment variables with production URLs"
