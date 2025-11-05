#!/bin/bash
# Fix Secret Manager permissions for Cloud Run service account
set -e
PROJECT_ID=$(gcloud config get-value project)
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
echo "🔧 Fixing Secret Manager permissions for Cloud Run..."
echo "Project ID: $PROJECT_ID"
echo "Project Number: $PROJECT_NUMBER"
echo "Service Account: $SERVICE_ACCOUNT"
echo ""
# Grant Secret Manager Secret Accessor role to default Compute Engine service account
echo "1️⃣ Granting Secret Manager Secret Accessor role..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/secretmanager.secretAccessor"
echo "✅ Permissions granted!"
echo ""
echo "2️⃣ Verifying secrets exist..."
gcloud secrets list --filter="name:sanity-api-read-token OR name:session-secret"
echo ""
echo "🎉 Done! Cloud Run can now access secrets."
