#!/bin/bash

# Setup script for GCR/Artifact Registry permissions for GitHub Actions
# This script gives the github-actions service account necessary permissions

set -e

echo "🔧 Setting up GCR/Artifact Registry permissions for GitHub Actions..."

# Check if PROJECT_ID is set
if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: PROJECT_ID environment variable is not set"
    echo "Usage: PROJECT_ID=your-project-id ./setup-gcr-permissions.sh"
    exit 1
fi

SERVICE_ACCOUNT="github-actions@${PROJECT_ID}.iam.gserviceaccount.com"

echo "📋 Project ID: $PROJECT_ID"
echo "📋 Service Account: $SERVICE_ACCOUNT"
echo ""

# Enable necessary APIs
echo "1️⃣ Enabling necessary APIs..."
gcloud services enable artifactregistry.googleapis.com --project=$PROJECT_ID
gcloud services enable storage-api.googleapis.com --project=$PROJECT_ID
echo "✅ APIs enabled"
echo ""

# Grant Storage Admin role (for gcr.io which uses Cloud Storage)
echo "2️⃣ Granting Storage Admin role..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/storage.admin" \
    --condition=None
echo "✅ Storage Admin role granted"
echo ""

# Grant Artifact Registry Writer role (for pushing images)
echo "3️⃣ Granting Artifact Registry Writer role..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/artifactregistry.writer" \
    --condition=None
echo "✅ Artifact Registry Writer role granted"
echo ""

# Grant Artifact Registry Create-On-Push permission (for auto-creating repos)
echo "4️⃣ Granting Artifact Registry Admin role (for create-on-push)..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/artifactregistry.admin" \
    --condition=None
echo "✅ Artifact Registry Admin role granted"
echo ""

echo "🎉 All permissions granted successfully!"
echo ""
echo "📝 Summary of roles granted to ${SERVICE_ACCOUNT}:"
echo "   - Storage Admin (roles/storage.admin)"
echo "   - Artifact Registry Writer (roles/artifactregistry.writer)"
echo "   - Artifact Registry Admin (roles/artifactregistry.admin)"
echo ""
echo "✅ Your GitHub Actions workflows can now push Docker images to gcr.io!"
echo ""
echo "🔍 To verify, run:"
echo "   gcloud projects get-iam-policy $PROJECT_ID --flatten=\"bindings[].members\" --filter=\"bindings.members:${SERVICE_ACCOUNT}\""

