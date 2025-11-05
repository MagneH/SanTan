#!/bin/bash

# Deployment script for Google Cloud Run
# Usage: ./deploy.sh [environment]
# Example: ./deploy.sh production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-your-gcp-project-id}"
REGION="${GCP_REGION:-europe-west1}"
SERVICE_NAME="${SERVICE_NAME:-santan-frontend}"
ENVIRONMENT="${1:-production}"

echo -e "${GREEN}🚀 Starting deployment to Google Cloud Run${NC}"
echo -e "Project: ${YELLOW}${PROJECT_ID}${NC}"
echo -e "Region: ${YELLOW}${REGION}${NC}"
echo -e "Service: ${YELLOW}${SERVICE_NAME}${NC}"
echo -e "Environment: ${YELLOW}${ENVIRONMENT}${NC}"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed. Please install it first.${NC}"
    echo "Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not authenticated. Running gcloud auth login...${NC}"
    gcloud auth login
fi

# Set the project
echo -e "${GREEN}📋 Setting GCP project...${NC}"
gcloud config set project "${PROJECT_ID}"

# Enable required APIs
echo -e "${GREEN}🔧 Enabling required APIs...${NC}"
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Build and push the Docker image using Cloud Build
echo -e "${GREEN}🏗️  Building Docker image with Cloud Build...${NC}"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S)"

gcloud builds submit \
  --tag "${IMAGE_NAME}" \
  --timeout=20m \
  --machine-type=n1-highcpu-8 \
  .

# Deploy to Cloud Run
echo -e "${GREEN}🚢 Deploying to Cloud Run...${NC}"

# Load environment variables from .env file if it exists
ENV_VARS=""
if [ -f ".env.${ENVIRONMENT}" ]; then
    echo -e "${YELLOW}📄 Loading environment variables from .env.${ENVIRONMENT}${NC}"
    ENV_VARS="--env-vars-file=.env.${ENVIRONMENT}"
elif [ -f ".env" ]; then
    echo -e "${YELLOW}📄 Loading environment variables from .env${NC}"
    ENV_VARS="--env-vars-file=.env"
fi

gcloud run deploy "${SERVICE_NAME}" \
  --image="${IMAGE_NAME}" \
  --platform=managed \
  --region="${REGION}" \
  --allow-unauthenticated \
  --port=8080 \
  --memory=1Gi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10 \
  --timeout=300 \
  --concurrency=80 \
  ${ENV_VARS}

# Get the service URL
SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" \
  --platform=managed \
  --region="${REGION}" \
  --format="value(status.url)")

echo ""
echo -e "${GREEN}✅ Deployment successful!${NC}"
echo -e "Service URL: ${YELLOW}${SERVICE_URL}${NC}"
echo ""
echo -e "${GREEN}📊 View logs:${NC}"
echo "gcloud run services logs read ${SERVICE_NAME} --region=${REGION}"
echo ""
echo -e "${GREEN}🔍 View service details:${NC}"
echo "gcloud run services describe ${SERVICE_NAME} --region=${REGION}"

