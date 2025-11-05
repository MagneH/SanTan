#!/bin/bash
# Quick script to view preview logs

PR_NUMBER=${1:-2}
REGION="europe-west1"

echo "📊 Viewing logs for PR #${PR_NUMBER}"
echo ""

# Check if services exist
echo "🔍 Checking services..."
FRONTEND_EXISTS=$(gcloud run services list --region=$REGION --format="value(metadata.name)" | grep "santan-frontend-pr-${PR_NUMBER}" || echo "")
STUDIO_EXISTS=$(gcloud run services list --region=$REGION --format="value(metadata.name)" | grep "santan-studio-pr-${PR_NUMBER}" || echo "")

if [ -z "$FRONTEND_EXISTS" ] && [ -z "$STUDIO_EXISTS" ]; then
    echo "❌ No preview services found for PR #${PR_NUMBER}"
    echo ""
    echo "Available preview services:"
    gcloud run services list --region=$REGION --format="table(metadata.name,status.url)" | grep "pr-"
    exit 1
fi

echo ""
echo "Select which logs to view:"
echo "1) Frontend logs (real-time)"
echo "2) Frontend logs (last 100 lines)"
echo "3) Studio logs (real-time)"
echo "4) Studio logs (last 100 lines)"
echo "5) Both services info"
echo "6) Open in Cloud Console"
read -p "Choice (1-6): " choice

case $choice in
    1)
        echo "📡 Streaming Frontend logs (Ctrl+C to stop)..."
        gcloud run services logs tail santan-frontend-pr-${PR_NUMBER} --region=$REGION
        ;;
    2)
        echo "📋 Last 100 lines from Frontend..."
        gcloud run services logs read santan-frontend-pr-${PR_NUMBER} --region=$REGION --limit=100
        ;;
    3)
        echo "📡 Streaming Studio logs (Ctrl+C to stop)..."
        gcloud run services logs tail santan-studio-pr-${PR_NUMBER} --region=$REGION
        ;;
    4)
        echo "📋 Last 100 lines from Studio..."
        gcloud run services logs read santan-studio-pr-${PR_NUMBER} --region=$REGION --limit=100
        ;;
    5)
        echo "📊 Frontend Service Info:"
        gcloud run services describe santan-frontend-pr-${PR_NUMBER} --region=$REGION --format="yaml(status.url,status.conditions)"
        echo ""
        echo "📊 Studio Service Info:"
        gcloud run services describe santan-studio-pr-${PR_NUMBER} --region=$REGION --format="yaml(status.url,status.conditions)"
        ;;
    6)
        open "https://console.cloud.google.com/run?project=santan-477308"
        echo "✅ Opened Cloud Console in browser"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

