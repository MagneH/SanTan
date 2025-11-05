# Google Cloud Run Deployment Guide

Dette dokumentet beskriver hvordan du deployer Santan-prosjektet til Google Cloud Run.

## 📋 Forutsetninger

Før du begynner, sørg for at du har:

1. **Google Cloud Platform-konto**
   - Opprett en konto på [cloud.google.com](https://cloud.google.com)
   - Opprett et nytt prosjekt eller bruk et eksisterende

2. **Google Cloud CLI (gcloud)**
   ```bash
   # macOS
   brew install google-cloud-sdk
   
   # Eller last ned fra: https://cloud.google.com/sdk/docs/install
   ```

3. **Docker** (for lokal testing)
   ```bash
   # macOS
   brew install docker
   ```

4. **Aktiver Billing** på GCP-prosjektet ditt
   - Cloud Run krever at billing er aktivert

## 🚀 Steg-for-steg Deployment

### 1. Autentiser med Google Cloud

```bash
# Logg inn med Google-kontoen din
gcloud auth login

# Sett prosjekt-ID
gcloud config set project YOUR_PROJECT_ID

# List tilgjengelige prosjekter
gcloud projects list
```

### 2. Konfigurer Environment Variables

Kopier `.env.example` til `.env.production`:

```bash
cd apps/frontend
cp .env.example .env.production
```

Rediger `.env.production` med dine verdier:

```env
VITE_SANITY_PROJECT_ID=din-sanity-project-id
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=din-sanity-read-token
SANITY_API_WRITE_TOKEN=din-sanity-write-token
SESSION_SECRET=generate-a-long-random-secure-string
NODE_ENV=production
PORT=8080
```

### 3. Test Docker Build Lokalt (Anbefalt)

```bash
# Fra apps/frontend/
docker build -t santan-frontend .

# Test at containeren kjører
docker run -p 8080:8080 --env-file .env.production santan-frontend

# Åpne http://localhost:8080 i nettleseren
```

### 4. Deploy med Deploy-scriptet

Det enkleste er å bruke det automatiske deploy-scriptet:

```bash
cd apps/frontend

# Sett environment variables for GCP
export GCP_PROJECT_ID=your-project-id
export GCP_REGION=europe-west1
export SERVICE_NAME=santan-frontend

# Kjør deployment
./deploy.sh production
```

### 5. Alternativ: Manuell Deploy

Hvis du foretrekker å deploye manuelt:

```bash
# 1. Bygg og push Docker image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/santan-frontend

# 2. Deploy til Cloud Run
gcloud run deploy santan-frontend \
  --image gcr.io/YOUR_PROJECT_ID/santan-frontend \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --env-vars-file .env.production
```

## 🔄 CI/CD med Cloud Build (Valgfritt)

For automatisk deployment ved push til Git:

### 1. Sett opp Cloud Build Trigger

```bash
# Koble Cloud Build til ditt GitHub/GitLab-repo
gcloud builds triggers create github \
  --repo-name=santan \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

### 2. Lagre Secrets i Secret Manager

```bash
# Opprett secrets
echo -n "din-sanity-token" | gcloud secrets create sanity-api-read-token --data-file=-
echo -n "din-session-secret" | gcloud secrets create session-secret --data-file=-

# Gi Cloud Run tilgang til secrets
gcloud secrets add-iam-policy-binding sanity-api-read-token \
  --member=serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor
```

### 3. Oppdater Cloud Run med Secrets

```bash
gcloud run services update santan-frontend \
  --update-secrets=SANITY_API_READ_TOKEN=sanity-api-read-token:latest,SESSION_SECRET=session-secret:latest \
  --region europe-west1
```

## 🔧 Konfigurasjon og Optimalisering

### Resource Allocation

Standard-konfigurasjonen er:
- **Memory**: 1 GiB (juster basert på behov)
- **CPU**: 1 vCPU
- **Min instances**: 0 (cold start, men billigere)
- **Max instances**: 10
- **Timeout**: 300 sekunder

For å endre:

```bash
gcloud run services update santan-frontend \
  --memory 2Gi \
  --cpu 2 \
  --min-instances 1 \
  --region europe-west1
```

### Custom Domain

For å bruke ditt eget domene:

```bash
# Legg til domain mapping
gcloud run domain-mappings create \
  --service santan-frontend \
  --domain www.dittdomene.no \
  --region europe-west1

# Følg instruksjonene for å konfigurere DNS
```

### Environment Variables

For å oppdatere env vars uten full redeploy:

```bash
gcloud run services update santan-frontend \
  --update-env-vars KEY1=value1,KEY2=value2 \
  --region europe-west1
```

## 📊 Monitoring og Logging

### Se Logger

```bash
# Real-time logs
gcloud run services logs tail santan-frontend --region europe-west1

# Historiske logs
gcloud run services logs read santan-frontend --region europe-west1 --limit 100
```

### Metrics i Console

Besøk: https://console.cloud.google.com/run

Her kan du se:
- Request count
- Response times
- Error rates
- Container CPU/memory usage

## 🔒 Sikkerhet

### 1. Beskytt API-endpoints

Hvis du vil at tjenesten skal kreve autentisering:

```bash
gcloud run services update santan-frontend \
  --no-allow-unauthenticated \
  --region europe-west1
```

### 2. CORS og Security Headers

Security headers er allerede konfigurert i `src/middleware/security.ts`. Verifiser at disse fungerer som forventet.

### 3. Rate Limiting

Vurder å legge til Cloud Armor for DDoS-beskyttelse:

```bash
# Dette krever en Load Balancer foran Cloud Run
# Se: https://cloud.google.com/armor/docs/cloud-armor-overview
```

## 💰 Kostnadsestimering

Cloud Run-prising er basert på:
- **CPU**: $0.00002400 per vCPU-sekund
- **Memory**: $0.00000250 per GiB-sekund
- **Requests**: $0.40 per million requests
- **Networking**: $0.12 per GB egress

Med standard config og moderat trafikk (~10,000 requests/måned):
- **Estimert kostnad**: $5-15/måned

Bruk [Google Cloud Pricing Calculator](https://cloud.google.com/products/calculator) for nøyaktige estimater.

## 🐛 Troubleshooting

### Container starter ikke

```bash
# Sjekk logs for feil
gcloud run services logs read santan-frontend --region europe-west1

# Verifiser at PORT er satt til 8080
# Cloud Run krever at appen lytter på $PORT
```

### Build feiler

```bash
# Test Docker build lokalt først
docker build -t santan-frontend -f apps/frontend/Dockerfile .

# Sjekk at alle dependencies er installert
npm ci
```

### Environment Variables mangler

```bash
# List alle env vars
gcloud run services describe santan-frontend \
  --region europe-west1 \
  --format="value(spec.template.spec.containers[0].env)"
```

### Cold Start er for treg

```bash
# Sett min-instances til 1 eller høyere
gcloud run services update santan-frontend \
  --min-instances 1 \
  --region europe-west1
```

## 📚 Ressurser

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Secret Manager](https://cloud.google.com/secret-manager/docs)
- [Best Practices for Cloud Run](https://cloud.google.com/run/docs/best-practices)

## 🆘 Support

Hvis du møter på problemer:

1. Sjekk logger: `gcloud run services logs read santan-frontend --region europe-west1`
2. Verifiser env vars er satt korrekt
3. Test Docker image lokalt
4. Se [Cloud Run Troubleshooting Guide](https://cloud.google.com/run/docs/troubleshooting)

