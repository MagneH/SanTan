#!/bin/bash
# Script to add Studio URL to Sanity CORS whitelist
# This should be run after Studio deployment

set -e

STUDIO_URL=$1
PROJECT_ID=${2:-88hgbtze}

if [ -z "$STUDIO_URL" ]; then
    echo "❌ Error: Studio URL is required"
    echo "Usage: ./add-studio-cors.sh <STUDIO_URL> [PROJECT_ID]"
    echo "Example: ./add-studio-cors.sh https://santan-studio-pr-2-abc123.run.app"
    exit 1
fi

echo "🔧 Adding Studio URL to Sanity CORS whitelist..."
echo "Studio URL: $STUDIO_URL"
echo "Project ID: $PROJECT_ID"
echo ""

# Check if sanity CLI is installed
if ! command -v sanity &> /dev/null; then
    echo "❌ Sanity CLI not found. Installing..."
    npm install -g @sanity/cli
fi

# Authenticate if not already
if ! sanity projects list &> /dev/null; then
    echo "🔐 Please authenticate with Sanity CLI..."
    sanity login
fi

# Add CORS origin using Sanity CLI
echo "📋 Current CORS origins:"
sanity cors list --project $PROJECT_ID || true

echo ""
echo "➕ Adding $STUDIO_URL to CORS whitelist..."
sanity cors add $STUDIO_URL --project $PROJECT_ID --credentials true

echo ""
echo "✅ Done! Studio URL added to CORS whitelist"
echo ""
echo "📋 Updated CORS origins:"
sanity cors list --project $PROJECT_ID

