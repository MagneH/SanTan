# 🚀 Quick Start: Deploy til Google Cloud Run

Følg disse 5 enkle stegene for å deploye Santan til Google Cloud Run.

## ⏱️ Tid: ~15 minutter

---

## Steg 1: Installer Google Cloud CLI

```bash
# macOS
brew install google-cloud-sdk

# Verifiser installasjon
gcloud --version
```

## Steg 2: Autentiser og sett opp prosjekt

```bash
# Logg inn
gcloud auth login

# List dine prosjekter
gcloud projects list

# Sett aktivt prosjekt (erstatt med ditt project ID)
gcloud config set project YOUR_PROJECT_ID

# Aktiver nødvendige APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

## Steg 3: Konfigurer miljøvariabler

```bash
cd apps/frontend

# Kopier template
cp .env.example .env.production

# Rediger filen med dine verdier
nano .env.production
```

Fyll inn disse verdiene:
```env
VITE_SANITY_PROJECT_ID=din-sanity-project-id
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=skexxxxxxxxxxxxx
SANITY_API_WRITE_TOKEN=skpxxxxxxxxxxxxx
SESSION_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
PORT=8080
```

💡 **Tips:** Generer SESSION_SECRET med: `openssl rand -base64 32`

## Steg 4: Lagre secrets i Google Cloud

```bash
# Fra apps/frontend/
export GCP_PROJECT_ID=your-project-id
./setup-secrets.sh
```

Dette lagrer sensitive tokens trygt i Google Cloud Secret Manager.

## Steg 5: Deploy! 🚀

```bash
# Test build lokalt først (valgfritt men anbefalt)
docker build -t santan-test -f Dockerfile ../../

# Deploy til Cloud Run
export GCP_PROJECT_ID=your-project-id
export GCP_REGION=europe-west1
export SERVICE_NAME=santan-frontend

./deploy.sh production
```

Ferdig! 🎉

Din app er nå tilgjengelig på den URL-en som vises i terminalen.

---

## 🔄 Oppdatere appen

Når du gjør endringer i koden, kjør bare:

```bash
cd apps/frontend
./deploy.sh production
```

---

## 📊 Overvåke appen

```bash
# Se live logs
gcloud run services logs tail santan-frontend --region=europe-west1

# Se service details
gcloud run services describe santan-frontend --region=europe-west1

# Åpne i console
open "https://console.cloud.google.com/run"
```

---

## 🐛 Feilsøking

### "Permission denied" ved deploy

```bash
# Sjekk at du har riktige rettigheter
gcloud projects get-iam-policy YOUR_PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:$(gcloud config get-value account)"
```

Du trenger: `roles/run.admin` og `roles/iam.serviceAccountUser`

### Container starter ikke

```bash
# Sjekk logs
gcloud run services logs read santan-frontend --region=europe-west1 --limit=50
```

Vanligste feil:
- ❌ Manglende environment variables
- ❌ Feil PORT (må være 8080)
- ❌ Build errors i Docker image

### Test lokalt først

```bash
cd apps/frontend

# Build
docker build -t santan-test -f Dockerfile ../../

# Run med secrets
docker run -p 8080:8080 --env-file .env.production santan-test

# Test
curl http://localhost:8080
```

---

## 💰 Kostnader

Med standard config og lav trafikk:
- **Gratis tier**: Første 2 millioner requests/måned er gratis
- **Estimat**: $5-15/måned for moderat bruk
- **Min instances = 0**: Betaler kun når appen brukes

Se [Google Cloud Pricing Calculator](https://cloud.google.com/products/calculator) for nøyaktig estimat.

---

## 🔒 Sikkerhet

✅ **Secrets** lagres trygt i Secret Manager (ikke i kode)  
✅ **HTTPS** aktivert automatisk  
✅ **Security headers** konfigurert i middleware  
✅ **Non-root user** i Docker container  

---

## 📚 Neste steg

- [ ] Sett opp custom domain
- [ ] Konfigurer CI/CD med GitHub Actions
- [ ] Aktiver monitoring og alerting
- [ ] Sett opp staging environment

Se [CLOUD_RUN_DEPLOYMENT.md](./CLOUD_RUN_DEPLOYMENT.md) for detaljert dokumentasjon.

---

## 🆘 Trenger hjelp?

1. Les [full dokumentasjon](./CLOUD_RUN_DEPLOYMENT.md)
2. Sjekk [Cloud Run docs](https://cloud.google.com/run/docs)
3. Se logs: `gcloud run services logs read santan-frontend --region=europe-west1`

