#!/bin/bash

# Script to set up Google Cloud Secret Manager for the project
# This stores sensitive environment variables securely in GCP

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🔐 Setting up Google Cloud Secret Manager${NC}"
echo ""

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ .env.production file not found${NC}"
    echo "Please create .env.production with your environment variables first"
    exit 1
fi

# Source the .env.production file to get variables
set -a
source .env.production
set +a

PROJECT_ID="${GCP_PROJECT_ID:-$(gcloud config get-value project)}"

echo -e "${YELLOW}Project ID: ${PROJECT_ID}${NC}"
echo ""

# Enable Secret Manager API
echo -e "${GREEN}📋 Enabling Secret Manager API...${NC}"
gcloud services enable secretmanager.googleapis.com --project="${PROJECT_ID}"

# Function to create or update a secret
create_or_update_secret() {
    local secret_name=$1
    local secret_value=$2

    if [ -z "$secret_value" ]; then
        echo -e "${YELLOW}⚠️  Skipping ${secret_name} (empty value)${NC}"
        return
    fi

    # Check if secret exists
    if gcloud secrets describe "${secret_name}" --project="${PROJECT_ID}" &>/dev/null; then
        echo -e "${YELLOW}Updating existing secret: ${secret_name}${NC}"
        echo -n "${secret_value}" | gcloud secrets versions add "${secret_name}" \
            --data-file=- \
            --project="${PROJECT_ID}"
    else
        echo -e "${GREEN}Creating new secret: ${secret_name}${NC}"
        echo -n "${secret_value}" | gcloud secrets create "${secret_name}" \
            --data-file=- \
            --replication-policy="automatic" \
            --project="${PROJECT_ID}"
    fi
}

# Create secrets
echo -e "${GREEN}🔑 Creating/updating secrets...${NC}"
echo ""

create_or_update_secret "sanity-api-read-token" "${SANITY_API_READ_TOKEN}"
create_or_update_secret "sanity-api-write-token" "${SANITY_API_WRITE_TOKEN}"
create_or_update_secret "session-secret" "${SESSION_SECRET}"

# Get the project number for IAM binding
PROJECT_NUMBER=$(gcloud projects describe "${PROJECT_ID}" --format="value(projectNumber)")
SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

echo ""
echo -e "${GREEN}🔓 Granting Cloud Run access to secrets...${NC}"

# Grant Cloud Run service account access to secrets
for secret in "sanity-api-read-token" "sanity-api-write-token" "session-secret"; do
    if gcloud secrets describe "${secret}" --project="${PROJECT_ID}" &>/dev/null; then
        echo "Granting access to: ${secret}"
        gcloud secrets add-iam-policy-binding "${secret}" \
            --member="serviceAccount:${SERVICE_ACCOUNT}" \
            --role="roles/secretmanager.secretAccessor" \
            --project="${PROJECT_ID}" \
            --quiet
    fi
done

echo ""
echo -e "${GREEN}✅ Secret Manager setup complete!${NC}"
echo ""
echo -e "${YELLOW}Created/Updated secrets:${NC}"
gcloud secrets list --project="${PROJECT_ID}" --format="table(name,created)"
echo ""
echo -e "${GREEN}💡 You can now deploy to Cloud Run with these secrets${NC}"
echo ""
echo "To view a secret:"
echo "  gcloud secrets versions access latest --secret=SECRET_NAME --project=${PROJECT_ID}"
echo ""
echo "To update a secret:"
echo "  echo -n 'new-value' | gcloud secrets versions add SECRET_NAME --data-file=- --project=${PROJECT_ID}"

