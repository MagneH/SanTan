#!/bin/bash

# Script to set up Google Cloud for GitHub Actions CI/CD
# This creates a service account and configures necessary permissions

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🔧 Setting up Google Cloud for GitHub Actions${NC}"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed${NC}"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Prompt for project ID if not set
if [ -z "$GCP_PROJECT_ID" ]; then
    echo -e "${YELLOW}Enter your GCP Project ID:${NC}"
    read GCP_PROJECT_ID
fi

echo -e "${BLUE}Project ID: ${GCP_PROJECT_ID}${NC}"

# Set the project
gcloud config set project "${GCP_PROJECT_ID}"

# Get project number
PROJECT_NUMBER=$(gcloud projects describe "${GCP_PROJECT_ID}" --format="value(projectNumber)")
echo -e "${BLUE}Project Number: ${PROJECT_NUMBER}${NC}"
echo ""

# Prompt for setup method
echo -e "${YELLOW}Choose authentication method:${NC}"
echo "1) Service Account Key (easier, less secure)"
echo "2) Workload Identity Federation (recommended, more secure)"
echo ""
read -p "Enter choice [1 or 2]: " AUTH_CHOICE
echo ""

SERVICE_ACCOUNT_NAME="github-actions"
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com"

# Enable required APIs
echo -e "${GREEN}📋 Enabling required APIs...${NC}"
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable iam.googleapis.com
gcloud services enable iamcredentials.googleapis.com
echo ""

# Create service account if it doesn't exist
if ! gcloud iam service-accounts describe "${SERVICE_ACCOUNT_EMAIL}" &>/dev/null; then
    echo -e "${GREEN}👤 Creating service account: ${SERVICE_ACCOUNT_NAME}${NC}"
    gcloud iam service-accounts create "${SERVICE_ACCOUNT_NAME}" \
        --display-name="GitHub Actions CI/CD" \
        --project="${GCP_PROJECT_ID}"
else
    echo -e "${YELLOW}ℹ️  Service account already exists${NC}"
fi
echo ""

# Grant necessary roles
echo -e "${GREEN}🔑 Granting IAM roles to service account...${NC}"
ROLES=(
    "roles/run.admin"
    "roles/storage.admin"
    "roles/iam.serviceAccountUser"
    "roles/secretmanager.secretAccessor"
)

for role in "${ROLES[@]}"; do
    echo "  Granting ${role}..."
    gcloud projects add-iam-policy-binding "${GCP_PROJECT_ID}" \
        --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
        --role="${role}" \
        --quiet
done
echo ""

if [ "$AUTH_CHOICE" = "1" ]; then
    # Service Account Key method
    echo -e "${GREEN}🔐 Generating service account key...${NC}"

    KEY_FILE="github-actions-key.json"

    gcloud iam service-accounts keys create "${KEY_FILE}" \
        --iam-account="${SERVICE_ACCOUNT_EMAIL}"

    echo ""
    echo -e "${GREEN}✅ Service account key created: ${KEY_FILE}${NC}"
    echo ""
    echo -e "${YELLOW}════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}📋 Add these secrets to your GitHub repository:${NC}"
    echo -e "${YELLOW}════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${BLUE}1. Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions${NC}"
    echo ""
    echo -e "${BLUE}2. Add these secrets:${NC}"
    echo ""
    echo -e "  ${GREEN}GCP_PROJECT_ID${NC}"
    echo -e "  Value: ${YELLOW}${GCP_PROJECT_ID}${NC}"
    echo ""
    echo -e "  ${GREEN}GCP_SA_KEY${NC}"
    echo -e "  Value: (paste the content below)"
    echo ""
    cat "${KEY_FILE}"
    echo ""
    echo ""
    echo -e "${RED}⚠️  IMPORTANT: Delete the key file after copying:${NC}"
    echo -e "  ${YELLOW}rm ${KEY_FILE}${NC}"
    echo ""
    echo -e "${YELLOW}════════════════════════════════════════════════════${NC}"

elif [ "$AUTH_CHOICE" = "2" ]; then
    # Workload Identity Federation method
    echo -e "${YELLOW}Enter your GitHub repository (format: username/repo):${NC}"
    read GITHUB_REPO

    echo ""
    echo -e "${GREEN}🔗 Setting up Workload Identity Federation...${NC}"

    POOL_NAME="github-pool"
    PROVIDER_NAME="github-provider"

    # Create Workload Identity Pool
    if ! gcloud iam workload-identity-pools describe "${POOL_NAME}" \
         --location="global" --project="${GCP_PROJECT_ID}" &>/dev/null; then
        echo "Creating Workload Identity Pool..."
        gcloud iam workload-identity-pools create "${POOL_NAME}" \
            --project="${GCP_PROJECT_ID}" \
            --location="global" \
            --display-name="GitHub Actions Pool"
    else
        echo -e "${YELLOW}ℹ️  Workload Identity Pool already exists${NC}"
    fi

    # Create Provider
    if ! gcloud iam workload-identity-pools providers describe "${PROVIDER_NAME}" \
         --workload-identity-pool="${POOL_NAME}" \
         --location="global" --project="${GCP_PROJECT_ID}" &>/dev/null; then
        echo "Creating Workload Identity Provider..."
        gcloud iam workload-identity-pools providers create-oidc "${PROVIDER_NAME}" \
            --project="${GCP_PROJECT_ID}" \
            --location="global" \
            --workload-identity-pool="${POOL_NAME}" \
            --display-name="GitHub Provider" \
            --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
            --issuer-uri="https://token.actions.githubusercontent.com"
    else
        echo -e "${YELLOW}ℹ️  Workload Identity Provider already exists${NC}"
    fi

    # Bind Service Account to Workload Identity
    echo "Binding service account to Workload Identity..."
    gcloud iam service-accounts add-iam-policy-binding \
        "${SERVICE_ACCOUNT_EMAIL}" \
        --project="${GCP_PROJECT_ID}" \
        --role="roles/iam.workloadIdentityUser" \
        --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_NAME}/attribute.repository/${GITHUB_REPO}" \
        --quiet

    # Get the provider name
    WIF_PROVIDER=$(gcloud iam workload-identity-pools providers describe "${PROVIDER_NAME}" \
        --project="${GCP_PROJECT_ID}" \
        --location="global" \
        --workload-identity-pool="${POOL_NAME}" \
        --format="value(name)")

    echo ""
    echo -e "${GREEN}✅ Workload Identity Federation configured!${NC}"
    echo ""
    echo -e "${YELLOW}════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}📋 Add these secrets to your GitHub repository:${NC}"
    echo -e "${YELLOW}════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${BLUE}Go to: https://github.com/${GITHUB_REPO}/settings/secrets/actions${NC}"
    echo ""
    echo -e "  ${GREEN}GCP_PROJECT_ID${NC}"
    echo -e "  Value: ${YELLOW}${GCP_PROJECT_ID}${NC}"
    echo ""
    echo -e "  ${GREEN}WIF_PROVIDER${NC}"
    echo -e "  Value: ${YELLOW}${WIF_PROVIDER}${NC}"
    echo ""
    echo -e "  ${GREEN}WIF_SERVICE_ACCOUNT${NC}"
    echo -e "  Value: ${YELLOW}${SERVICE_ACCOUNT_EMAIL}${NC}"
    echo ""
    echo -e "${YELLOW}════════════════════════════════════════════════════${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Add the secrets to GitHub (as shown above)"
echo "2. Add SANITY_PROJECT_ID and SANITY_DATASET secrets"
echo "3. Push to main branch to trigger deployment"
echo ""
echo -e "${BLUE}For more information, see:${NC}"
echo "  - GITHUB_CI_SETUP.md"
echo "  - CLOUD_RUN_DEPLOYMENT.md"

