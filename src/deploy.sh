#!/bin/bash

# FinaryApp Deployment Helper Script
# Usage: chmod +x deploy.sh && ./deploy.sh

echo "🚀 FinaryApp Deployment Helper"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check Node.js
echo "📦 Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found! Please install Node.js first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) found${NC}"
echo ""

# Step 2: Install dependencies
echo "📥 Installing dependencies..."
if ! npm install; then
    echo -e "${RED}❌ npm install failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 3: Test build
echo "🔨 Testing build..."
if ! npm run build; then
    echo -e "${RED}❌ Build failed! Check errors above.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build successful!${NC}"
echo ""

# Step 4: Check dist folder
if [ -d "dist" ]; then
    echo -e "${GREEN}✅ dist/ folder created${NC}"
    echo "   Contents:"
    ls -lh dist/
else
    echo -e "${RED}❌ dist/ folder not found!${NC}"
    exit 1
fi
echo ""

# Step 5: Git status
echo "📊 Git status:"
git status --short
echo ""

# Step 6: Ask to commit and push
read -p "Do you want to commit and push changes? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "💾 Committing changes..."
    git add .
    
    read -p "Enter commit message (or press Enter for default): " commit_msg
    if [ -z "$commit_msg" ]; then
        commit_msg="fix: restructure project for deployment"
    fi
    
    git commit -m "$commit_msg"
    
    echo "📤 Pushing to GitHub..."
    if git push; then
        echo -e "${GREEN}✅ Pushed to GitHub successfully!${NC}"
    else
        echo -e "${RED}❌ Push failed! Check your Git setup.${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⏭️  Skipping Git push${NC}"
fi
echo ""

# Step 7: Summary
echo "🎉 Summary:"
echo "================================"
echo -e "${GREEN}✅ Build test: PASSED${NC}"
echo -e "${GREEN}✅ dist/ folder: EXISTS${NC}"
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}✅ Git push: DONE${NC}"
else
    echo -e "${YELLOW}⏭️  Git push: SKIPPED${NC}"
fi
echo ""
echo "📝 Next steps:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Check deployment status"
echo "3. Wait 1-2 minutes for auto-deploy"
echo "4. Visit your website!"
echo ""
echo -e "${GREEN}🚀 Ready to deploy!${NC}"
