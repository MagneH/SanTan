# 🎨 Self-Hosted Studio Deployment Guide

Dette prosjektet er konfigurert for å hoste Sanity Studio selv på Google Cloud Run, ikke via Sanity's offisielle hosting.

## 📋 Oversikt

**Arkitektur:**
```
Google Cloud Run
├── santan-frontend (Frontend app)
└── santan-studio (Self-hosted Studio)
```

**Fordeler med self-hosting:**
- ✅ Full kontroll over hosting
- ✅ Custom middleware mulig
- ✅ Kan legge til autentisering
- ✅ Samme infrastruktur som frontend
- ✅ Kan bruke private Sanity datasets

## 🚀 Quick Start Deployment

### 1. Deploy Studio til Cloud Run

**Viktig:** Docker-bygget må kjøres fra **repository root** siden Dockerfilen trenger tilgang til både `apps/studio` og `packages/shared`.

```bash
# Første gang - manuell deployment

# Logg inn på GCP
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Deploy Studio (VIKTIG: kjør fra repository root!)
cd /path/to/santan  # Gå til repository root

gcloud run deploy santan-studio \
  --source . \
  --dockerfile apps/studio/Dockerfile \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --min-instances 0 \
  --max-instances 3 \
  --set-env-vars SANITY_STUDIO_PROJECT_ID=88hgbtze,SANITY_STUDIO_DATASET=production,SANITY_STUDIO_API_VERSION=2024-01-01

# Få Studio URL
STUDIO_URL=$(gcloud run services describe santan-studio \
  --region europe-west1 \
  --format 'value(status.url)')

echo "Studio deployed to: $STUDIO_URL"
```

**Alternativ med Docker manuelt:**
```bash
# Fra repository root
docker build -f apps/studio/Dockerfile -t santan-studio .

# Test lokalt
docker run -p 8080:8080 -e SANITY_STUDIO_PROJECT_ID=88hgbtze santan-studio
```

### 2. Legg til GitHub Secrets

Gå til GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Legg til disse nye secrets:

| Secret Name | Value | Eksempel |
|-------------|-------|----------|
| `SANITY_STUDIO_URL` | Studio Cloud Run URL | `https://santan-studio-abc123-ew.a.run.app` |
| `FRONTEND_URL` | Frontend Cloud Run URL | `https://santan-frontend-xyz789-ew.a.run.app` |

**Hvordan få URL-ene:**
```bash
# Studio URL
gcloud run services describe santan-studio \
  --region europe-west1 \
  --format 'value(status.url)'

# Frontend URL (etter deployment)
gcloud run services describe santan-frontend \
  --region europe-west1 \
  --format 'value(status.url)'
```

### 3. Deploy Frontend

```bash
cd apps/frontend

# Oppdater .env.production med Studio URL
echo "VITE_SANITY_STUDIO_URL=$STUDIO_URL" >> .env.production

# Deploy
./deploy.sh production
```

### 4. Oppdater Studio med Frontend URL

```bash
# Oppdater Studio med frontend URL
gcloud run services update santan-studio \
  --region europe-west1 \
  --set-env-vars SANITY_STUDIO_FRONTEND_URL=https://your-frontend-url.run.app
```

## 🔄 Automatisk Deployment via GitHub Actions

### Første gang setup:

1. **Deploy Studio manuelt første gang** (steg 1 over)

2. **Legg til GitHub Secrets:**
   - `SANITY_STUDIO_URL` - Studio URL fra steg 1
   - `FRONTEND_URL` - Frontend URL (kan være tom først)

3. **Push til main branch:**
   ```bash
   git add .
   git commit -m "Setup self-hosted Studio"
   git push origin main
   ```

### Workflows som kjører automatisk:

**1. Studio Deployment (deploy-studio.yml)**
- **Trigger:** Push til `main` med endringer i `apps/studio/**`
- **Deployer:** Studio til Cloud Run
- **Output:** Studio URL

**2. Frontend Deployment (deploy-cloud-run.yml)**
- **Trigger:** Push til `main` med endringer i `apps/frontend/**`
- **Bruker:** `SANITY_STUDIO_URL` fra GitHub Secrets
- **Deployer:** Frontend med Studio URL satt

### Deployment Flow:

```
1. Endre noe i apps/studio/
   ↓
2. Commit og push til main
   ↓
3. deploy-studio.yml kjører automatisk
   ↓
4. Studio deployes til Cloud Run
   ↓
5. Oppdater SANITY_STUDIO_URL i GitHub Secrets hvis URL endret seg
   ↓
6. Redeploy frontend (manuelt eller ved å pushe endring)
```

## 🔧 Environment Variables

### Frontend Environment Variables

**Lokal development (.env):**
```env
VITE_SANITY_PROJECT_ID=88hgbtze
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
# VITE_SANITY_STUDIO_URL auto-detects to localhost:3333
```

**Production (.env.production):**
```env
VITE_SANITY_PROJECT_ID=88hgbtze
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
VITE_SANITY_STUDIO_URL=https://santan-studio-abc123-ew.a.run.app
SANITY_API_READ_TOKEN=sk...
SANITY_API_WRITE_TOKEN=sk...
SESSION_SECRET=your-session-secret
NODE_ENV=production
PORT=8080
```

### Studio Environment Variables

**Cloud Run (settes automatisk via workflow):**
```env
NODE_ENV=production
SANITY_STUDIO_FRONTEND_URL=https://santan-frontend-xyz789-ew.a.run.app
```

## 🔗 URL-koblingen mellom Frontend og Studio

### Hvordan det fungerer:

**1. Frontend → Studio (for preview mode):**
```typescript
// apps/frontend/src/constants/config.ts
export function getSanityStudioUrl(): string {
  // Production: Bruker VITE_SANITY_STUDIO_URL
  return import.meta.env.VITE_SANITY_STUDIO_URL || 'http://localhost:3333';
}
```

**2. Studio → Frontend (for presentation tool):**
```typescript
// apps/studio/sanity.config.ts
const frontendUrl = process.env.SANITY_STUDIO_FRONTEND_URL || 'http://localhost:3000';

presentationTool({
  previewUrl: {
    initial: frontendUrl,
    previewMode: {
      enable: `${frontendUrl}/api/preview`,
    },
  },
  allowOrigins: [frontendUrl, 'http://localhost:*'],
})
```

### Oppdatere URL-er:

**Når Frontend URL endres:**
```bash
# Oppdater Studio
gcloud run services update santan-studio \
  --region europe-west1 \
  --set-env-vars SANITY_STUDIO_FRONTEND_URL=https://new-frontend-url.run.app

# Oppdater GitHub Secret
gh secret set FRONTEND_URL --body "https://new-frontend-url.run.app"
```

**Når Studio URL endres:**
```bash
# Oppdater Frontend
gcloud run services update santan-frontend \
  --region europe-west1 \
  --set-env-vars VITE_SANITY_STUDIO_URL=https://new-studio-url.run.app

# Oppdater GitHub Secret
gh secret set SANITY_STUDIO_URL --body "https://new-studio-url.run.app"
```

## 🔒 Sikkerhet og CORS

### Frontend CSP Headers

Security middleware oppdateres automatisk basert på Studio URL:

```typescript
// apps/frontend/src/middleware/security.ts
const studioUrl = getSanityStudioUrl();
const studioOrigin = new URL(studioUrl).origin;

// CSP header
`frame-ancestors 'self' ${studioOrigin}` // Tillater Studio å embedde frontend
```

### Studio CORS

Studio tillater automatisk frontend origin:

```typescript
// apps/studio/sanity.config.ts
const frontendUrl = getFrontendUrl();

presentationTool({
  allowOrigins: ['http://localhost:*', frontendUrl],
})
```

## 💰 Kostnader

Estimerte kostnader for self-hosted Studio:

**Cloud Run Studio:**
- Memory: 512Mi
- CPU: 1 vCPU
- Min instances: 0 (scale to zero)
- Max instances: 3

**Estimat:**
- Lav bruk (kun deg): **~$2-5/måned**
- Medium bruk (5-10 brukere): **~$8-15/måned**
- Høy bruk: **~$20-30/måned**

**Total (Frontend + Studio):**
- **$10-35/måned** med moderat bruk

**Sammenligning:**
- Sanity official hosting: **Gratis**
- Self-hosted Cloud Run: **~$10-35/måned**

## 📊 Monitoring

### Sjekk Studio Status

```bash
# Se logs
gcloud run services logs tail santan-studio --region europe-west1

# Se service details
gcloud run services describe santan-studio --region europe-west1

# Test at Studio svarer
curl -I https://your-studio-url.run.app
```

### Sjekk Frontend kan nå Studio

```bash
# Fra frontend container (eller browser console)
fetch('https://your-studio-url.run.app')
  .then(r => console.log('Studio reachable:', r.status))
```

## 🐛 Troubleshooting

### Studio laster ikke

**Problem:** 404 eller blank page

**Løsning:**
```bash
# Sjekk at Studio er deployet
gcloud run services list --region europe-west1 | grep santan-studio

# Sjekk logs for feil
gcloud run services logs read santan-studio --region europe-west1 --limit 50

# Redeploy Studio
cd apps/studio
gcloud run deploy santan-studio --source . --region europe-west1
```

### Preview mode fungerer ikke

**Problem:** Frontend kan ikke kommunisere med Studio

**Løsning:**

1. **Verifiser Studio URL i Frontend:**
   ```bash
   # Sjekk env vars i Frontend
   gcloud run services describe santan-frontend \
     --region europe-west1 \
     --format="value(spec.template.spec.containers[0].env)"
   
   # Skal inneholde VITE_SANITY_STUDIO_URL
   ```

2. **Verifiser Frontend URL i Studio:**
   ```bash
   # Sjekk env vars i Studio
   gcloud run services describe santan-studio \
     --region europe-west1 \
     --format="value(spec.template.spec.containers[0].env)"
   
   # Skal inneholde SANITY_STUDIO_FRONTEND_URL
   ```

3. **Sjekk CORS headers:**
   ```bash
   # Fra Studio URL, sjekk at frontend origin er tillatt
   curl -H "Origin: https://your-frontend-url.run.app" \
        -I https://your-studio-url.run.app
   ```

### CSP blokkerer Studio

**Problem:** Console viser CSP violations

**Løsning:**
```typescript
// Verifiser at security.ts bruker riktig Studio URL
import { getSanityStudioUrl } from '@/constants/config';
const studioUrl = getSanityStudioUrl();
```

## 🔄 Oppdateringsworkflow

### Oppdatere Studio

```bash
# 1. Gjør endringer i apps/studio/
# 2. Commit og push
git add apps/studio/
git commit -m "Update Studio"
git push origin main

# 3. Workflow deployer automatisk
# 4. Verifiser deployment
gcloud run services describe santan-studio --region europe-west1
```

### Oppdatere Frontend

```bash
# 1. Gjør endringer i apps/frontend/
# 2. Commit og push
git add apps/frontend/
git commit -m "Update Frontend"
git push origin main

# 3. Workflow deployer automatisk
```

### Oppdatere begge samtidig

```bash
# 1. Gjør endringer i både frontend og studio
# 2. Commit og push
git add apps/
git commit -m "Update Frontend and Studio"
git push origin main

# 3. Begge workflows kjører parallelt
# 4. Studio deployes først (raskere build)
# 5. Frontend deployes etter
```

## 📚 Relaterte Filer

**Deployment:**
- `.github/workflows/deploy-studio.yml` - Studio deployment
- `.github/workflows/deploy-cloud-run.yml` - Frontend deployment
- `apps/studio/Dockerfile` - Studio Docker config
- `apps/frontend/Dockerfile` - Frontend Docker config

**Konfiguration:**
- `apps/studio/sanity.config.ts` - Studio config
- `apps/frontend/src/constants/config.ts` - Frontend config
- `apps/frontend/src/middleware/security.ts` - CSP headers

## 💡 Best Practices

### ✅ DO:

1. **Sett opp GitHub Secrets først**
   - `SANITY_STUDIO_URL` og `FRONTEND_URL`

2. **Deploy Studio før Frontend**
   - Studio må være tilgjengelig før frontend deployes

3. **Bruk environment variables for URL-er**
   - Aldri hardkode URL-er i kode

4. **Test preview mode etter deployment**
   - Åpne Studio → Presentation tool
   - Verifiser at frontend embedder riktig

5. **Monitor både Frontend og Studio**
   - Sjekk Cloud Run metrics
   - Se logs for errors

### ❌ DON'T:

1. ❌ Hardkode URL-er i kode
2. ❌ Commit .env-filer med faktiske verdier
3. ❌ Glem å oppdatere GitHub Secrets når URL-er endres
4. ❌ Deploy frontend uten Studio URL
5. ❌ Bruk `http://` i production (kun HTTPS)

## 🎉 Sammendrag

Med self-hosted Studio:

- ✅ **Full kontroll** over hosting
- ✅ **Automatisk deployment** via GitHub Actions
- ✅ **Environment-basert konfig** (dev/prod)
- ✅ **Sikker CORS og CSP** setup
- ✅ **Monitoring** via Cloud Run
- ✅ **Kostnadseffektivt** (~$10-35/måned)

Din Studio kjører nå på din egen infrastruktur! 🚀

