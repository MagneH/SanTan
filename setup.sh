#!/bin/bash

# Monorepo Setup Script

echo "🚀 Setting up Santan Monorepo..."
echo ""

# Check if .env files exist
if [ ! -f "apps/frontend/.env.local" ]; then
  echo "⚠️  Frontend .env.local not found"
  echo "   Copy apps/frontend/.env.example to apps/frontend/.env.local and configure it"
else
  echo "✅ Frontend .env.local exists"
fi

if [ ! -f "apps/studio/.env.local" ]; then
  echo "⚠️  Studio .env.local not found"
  echo "   Copy apps/studio/.env.example to apps/studio/.env.local and configure it"
else
  echo "✅ Studio .env.local exists"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✨ Setup complete!"
echo ""
echo "Available commands:"
echo "  npm run dev        - Run both apps in development mode"
echo "  npm run build      - Build all apps"
echo "  npm run lint       - Lint all apps"
echo "  npm run type-check - Type check all apps"
echo ""
echo "Run individual apps:"
echo "  npm run dev --workspace=@santan/frontend"
echo "  npm run dev --workspace=@santan/studio"
echo ""

