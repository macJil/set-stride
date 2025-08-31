#!/bin/bash

echo "🚀 Deploying FitTracker Pro..."

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Check if Vercel CLI is installed
    if command -v vercel &> /dev/null; then
        echo "🌐 Deploying to Vercel..."
        vercel --prod
    else
        echo "📋 Vercel CLI not found. Here are your deployment options:"
        echo ""
        echo "Option 1: Install Vercel CLI and deploy:"
        echo "  npm i -g vercel"
        echo "  vercel --prod"
        echo ""
        echo "Option 2: Deploy to Netlify:"
        echo "  - Drag and drop the 'dist' folder to netlify.com"
        echo "  - Set build command: npm run build"
        echo "  - Set publish directory: dist"
        echo ""
        echo "Option 3: Deploy to GitHub Pages:"
        echo "  - Add to package.json:"
        echo "    \"predeploy\": \"npm run build\","
        echo "    \"deploy\": \"gh-pages -d dist\""
        echo "  - npm install --save-dev gh-pages"
        echo "  - npm run deploy"
        echo ""
        echo "Your built files are in the 'dist' folder!"
    fi
else
    echo "❌ Build failed!"
    exit 1
fi
