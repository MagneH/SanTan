# 🚀 Production Deployment Guide

## Environment Variables for Production

For **ekte produksjon** med custom domains (f.eks. `studio.santan.no` og `www.santan.no`), må følgende environment variables settes:

### Studio Production Deployment

```bash
# Cloud Run Service: santan-studio-production
gcloud run deploy santan-studio-production \
  --image europe-west1-docker.pkg.dev/PROJECT_ID/docker/santan-studio:latest \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars SANITY_STUDIO_PROJECT_ID=88hgbtze,SANITY_STUDIO_DATASET=production,SANITY_STUDIO_API_VERSION=2024-01-01,SANITY_STUDIO_FRONTEND_URL=https://www.santan.no
```

**Viktig:** `SANITY_STUDIO_FRONTEND_URL` må settes eksplisitt for produksjon!

### Frontend Production Deployment

```bash
# Cloud Run Service: santan-frontend-production
gcloud run deploy santan-frontend-production \
  --image europe-west1-docker.pkg.dev/PROJECT_ID/docker/santan-frontend:latest \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,SANITY_PROJECT_ID=88hgbtze,SANITY_DATASET=production,SANITY_API_VERSION=2024-01-01,SANITY_STUDIO_URL=https://studio.santan.no \
  --update-secrets=SANITY_READ_TOKEN=sanity-api-read-token:latest,SANITY_SESSION_SECRET=session-secret:latest
```

**Viktig:** `SANITY_STUDIO_URL` må settes eksplisitt for produksjon!

---

## Deployment Scenarios

### 1. 🧪 PR Preview (Automatic URL Inference)

**URLs:**
- Studio: `https://santan-studio-pr-2-xxxxx.europe-west1.run.app`
- Frontend: `https://santan-frontend-pr-2-xxxxx.europe-west1.run.app`

**Hvordan det fungerer:**
- Studio infererer Frontend URL fra sitt eget hostname-mønster
- Ingen eksplisitt `SANITY_STUDIO_FRONTEND_URL` nødvendig
- Fungerer automatisk for alle PR-er

**Kode (sanity.config.ts):**
```typescript
if (studioHostname.includes('santan-studio-pr-')) {
  const frontendHostname = studioHostname.replace('santan-studio-pr-', 'santan-frontend-pr-');
  return `${window.location.protocol}//${frontendHostname}`;
}
```

### 2. 🏭 Production (Explicit Configuration)

**URLs:**
- Studio: `https://studio.santan.no` (custom domain)
- Frontend: `https://www.santan.no` (custom domain)

**Hvordan det fungerer:**
- `SANITY_STUDIO_FRONTEND_URL` **MÅ** settes eksplisitt
- Bygges inn i Studio under build via Vite
- Ingen URL-inferring mulig for custom domains

**Environment Variables:**
```bash
# Studio
SANITY_STUDIO_FRONTEND_URL=https://www.santan.no

# Frontend
SANITY_STUDIO_URL=https://studio.santan.no
```

**Priority i koden:**
```typescript
// 1. Eksplisitt env var (VIKTIG for produksjon!)
if (import.meta.env?.SANITY_STUDIO_FRONTEND_URL) {
  return import.meta.env.SANITY_STUDIO_FRONTEND_URL;
}

// 2. Infer fra preview-mønster (kun for PR-er)
if (studioHostname.includes('santan-studio-pr-')) {
  // ...
}

// 3. Fallback til localhost (development)
return 'http://localhost:3000';
```

---

## GitHub Actions Workflow for Production

Opprett `.github/workflows/deploy-production.yml`:

```yaml
name: Deploy Production

on:
  push:
    branches:
      - main
  workflow_dispatch:

env:
  PROJECT_ID: santan-477308
  REGION: europe-west1
  PRODUCTION_FRONTEND_URL: https://www.santan.no
  PRODUCTION_STUDIO_URL: https://studio.santan.no

jobs:
  deploy-production:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      id-token: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build shared package
        run: npm run build --workspace=@santan/shared

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2

      - name: Configure Docker for Artifact Registry
        run: gcloud auth configure-docker europe-west1-docker.pkg.dev

      # Build and deploy Studio
      - name: Build Studio Docker image
        run: |
          docker build \
            -t europe-west1-docker.pkg.dev/${{ env.PROJECT_ID }}/docker/santan-studio:latest \
            -t europe-west1-docker.pkg.dev/${{ env.PROJECT_ID }}/docker/santan-studio:${{ github.sha }} \
            --build-arg SANITY_STUDIO_FRONTEND_URL=${{ env.PRODUCTION_FRONTEND_URL }} \
            -f apps/studio/Dockerfile \
            .

      - name: Push Studio Docker images
        run: |
          docker push europe-west1-docker.pkg.dev/${{ env.PROJECT_ID }}/docker/santan-studio:latest
          docker push europe-west1-docker.pkg.dev/${{ env.PROJECT_ID }}/docker/santan-studio:${{ github.sha }}

      - name: Deploy Studio to Production
        run: |
          gcloud run deploy santan-studio-production \
            --image europe-west1-docker.pkg.dev/${{ env.PROJECT_ID }}/docker/santan-studio:latest \
            --platform managed \
            --region ${{ env.REGION }} \
            --allow-unauthenticated \
            --port 8080 \
            --memory 512Mi \
            --cpu 1 \
            --min-instances 0 \
            --max-instances 10 \
            --set-env-vars SANITY_STUDIO_PROJECT_ID=88hgbtze,SANITY_STUDIO_DATASET=production,SANITY_STUDIO_API_VERSION=2024-01-01,SANITY_STUDIO_FRONTEND_URL=${{ env.PRODUCTION_FRONTEND_URL }}

      # Build and deploy Frontend
      - name: Build Frontend Docker image
        run: |
          docker build \
            -t europe-west1-docker.pkg.dev/${{ env.PROJECT_ID }}/docker/santan-frontend:latest \
            -t europe-west1-docker.pkg.dev/${{ env.PROJECT_ID }}/docker/santan-frontend:${{ github.sha }} \
            -f apps/frontend/Dockerfile \
            .

      - name: Push Frontend Docker images
        run: |
          docker push europe-west1-docker.pkg.dev/${{ env.PROJECT_ID }}/docker/santan-frontend:latest
          docker push europe-west1-docker.pkg.dev/${{ env.PROJECT_ID }}/docker/santan-frontend:${{ github.sha }}

      - name: Deploy Frontend to Production
        run: |
          gcloud run deploy santan-frontend-production \
            --image europe-west1-docker.pkg.dev/${{ env.PROJECT_ID }}/docker/santan-frontend:latest \
            --platform managed \
            --region ${{ env.REGION }} \
            --allow-unauthenticated \
            --port 8080 \
            --memory 1Gi \
            --cpu 2 \
            --min-instances 1 \
            --max-instances 10 \
            --set-env-vars NODE_ENV=production,SANITY_PROJECT_ID=88hgbtze,SANITY_DATASET=production,SANITY_API_VERSION=2024-01-01,SANITY_STUDIO_URL=${{ env.PRODUCTION_STUDIO_URL }} \
            --update-secrets=SANITY_READ_TOKEN=sanity-api-read-token:latest,SANITY_SESSION_SECRET=session-secret:latest

      - name: Create deployment summary
        run: |
          echo "## 🚀 Production Deployment Successful" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "### Deployed Services:" >> $GITHUB_STEP_SUMMARY
          echo "- **Studio:** ${{ env.PRODUCTION_STUDIO_URL }}" >> $GITHUB_STEP_SUMMARY
          echo "- **Frontend:** ${{ env.PRODUCTION_FRONTEND_URL }}" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "### Docker Images:" >> $GITHUB_STEP_SUMMARY
          echo "- Studio: \`europe-west1-docker.pkg.dev/${{ env.PROJECT_ID }}/docker/santan-studio:${{ github.sha }}\`" >> $GITHUB_STEP_SUMMARY
          echo "- Frontend: \`europe-west1-docker.pkg.dev/${{ env.PROJECT_ID }}/docker/santan-frontend:${{ github.sha }}\`" >> $GITHUB_STEP_SUMMARY
```

---

## Custom Domain Setup

### 1. Configure Cloud Run Domains

```bash
# Map custom domain to Studio
gcloud run domain-mappings create \
  --service santan-studio-production \
  --domain studio.santan.no \
  --region europe-west1

# Map custom domain to Frontend
gcloud run domain-mappings create \
  --service santan-frontend-production \
  --domain www.santan.no \
  --region europe-west1
```

### 2. Update DNS Records

Add DNS records hos domain-leverandør (f.eks. Cloudflare):

**For studio.santan.no:**
```
Type: CNAME
Name: studio
Value: ghs.googlehosted.com
```

**For www.santan.no:**
```
Type: CNAME
Name: www
Value: ghs.googlehosted.com
```

### 3. Update CORS in Sanity

Legg til production domains i Sanity CORS whitelist:

```bash
# Via CLI
sanity cors add https://studio.santan.no --project 88hgbtze --credentials true
sanity cors add https://www.santan.no --project 88hgbtze --credentials true
```

Eller via Dashboard:
https://www.sanity.io/manage/project/88hgbtze/api

---

## Dockerfile Build Args (Optional)

For å bake inn environment variables i Docker image under build:

**apps/studio/Dockerfile:**
```dockerfile
# Add build arg
ARG SANITY_STUDIO_FRONTEND_URL=http://localhost:3000

# Set as env var for Vite build
ENV SANITY_STUDIO_FRONTEND_URL=$SANITY_STUDIO_FRONTEND_URL

# Vite will now include this in the build
RUN npm run build
```

**Build command:**
```bash
docker build \
  --build-arg SANITY_STUDIO_FRONTEND_URL=https://www.santan.no \
  -t santan-studio \
  .
```

---

## Environment Variable Priority Summary

### Studio (sanity.config.ts)

```
1. window.__FRONTEND_URL__ (runtime injection - future use)
2. import.meta.env.SANITY_STUDIO_FRONTEND_URL (BUILD-TIME - viktig for produksjon!)
3. process.env.SANITY_STUDIO_FRONTEND_URL (BUILD-TIME)
4. URL inference fra hostname-mønster (kun PR previews)
5. http://localhost:3000 (development fallback)
```

### Frontend (config.ts)

```
Server-side:
1. process.env.SANITY_STUDIO_URL (RUNTIME - satt av Cloud Run)
2. process.env.VITE_SANITY_STUDIO_URL (RUNTIME)
3. http://localhost:3333 (fallback)

Client-side:
1. window.__SANITY_STUDIO_URL__ (RUNTIME - injected av server)
2. import.meta.env.VITE_SANITY_STUDIO_URL (BUILD-TIME)
3. http://localhost:3333 (fallback)
```

---

## Testing Production Setup Locally

```bash
# Build Studio med production URL
docker build \
  --build-arg SANITY_STUDIO_FRONTEND_URL=https://www.santan.no \
  -t santan-studio:test \
  -f apps/studio/Dockerfile \
  .

# Run Studio
docker run -p 8080:8080 \
  -e SANITY_STUDIO_FRONTEND_URL=https://www.santan.no \
  santan-studio:test

# Build Frontend med production URL
docker build \
  -t santan-frontend:test \
  -f apps/frontend/Dockerfile \
  .

# Run Frontend
docker run -p 8081:8080 \
  -e SANITY_STUDIO_URL=https://studio.santan.no \
  -e SANITY_PROJECT_ID=88hgbtze \
  -e SANITY_DATASET=production \
  santan-frontend:test
```

---

## Checklist for Production

- [ ] Custom domains registrert og DNS konfigurert
- [ ] Cloud Run domain mappings opprettet
- [ ] `SANITY_STUDIO_FRONTEND_URL` satt i Studio deployment
- [ ] `SANITY_STUDIO_URL` satt i Frontend deployment
- [ ] CORS whitelist oppdatert i Sanity med production domains
- [ ] SSL-sertifikater provisjonert (automatisk av Cloud Run)
- [ ] Secrets opprettet i Secret Manager
- [ ] Production workflow opprettet og testet
- [ ] Min/max instances konfigurert for production load
- [ ] Monitoring og logging satt opp
- [ ] Backup-strategi for Sanity data

---

## 🎯 Key Takeaway

**PR Previews:** URL inference fungerer automatisk ✅

**Production:** Må alltid sette `SANITY_STUDIO_FRONTEND_URL` eksplisitt ⚠️

**Hvorfor?** Custom domains kan ikke inferres fra hostname-mønster!

