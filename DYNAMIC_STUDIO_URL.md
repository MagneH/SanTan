# Dynamic Sanity Studio URL Configuration

Frontend kan nå automatisk finne riktig Sanity Studio URL basert på miljø.

## 🎯 Hvordan det fungerer

### Automatisk URL-oppløsning

Frontenden bestemmer Studio URL i denne prioritetsrekkefølgen:

```
1. VITE_SANITY_STUDIO_URL (hvis satt) - Eksplisitt override
   ↓
2. Production + har SANITY_PROJECT_ID -> https://<project-id>.sanity.studio
   ↓
3. Fallback -> http://localhost:3333 (development)
```

### Implementering

Se `apps/frontend/src/constants/config.ts`:

```typescript
export function getSanityStudioUrl(): string {
  // 1. Eksplisitt override
  const explicitUrl = import.meta.env.VITE_SANITY_STUDIO_URL;
  if (explicitUrl) {
    return explicitUrl;
  }

  // 2. Production -> Sanity official hosting
  if (import.meta.env.PROD && SANITY_PROJECT_ID) {
    return `https://${SANITY_PROJECT_ID}.sanity.studio`;
  }

  // 3. Development fallback
  return 'http://localhost:3333';
}
```

## 📝 Brukseksempler

### Scenario 1: Standard Sanity Hosting (Anbefalt)

**Setup:**
```bash
# Deploy Studio til Sanity
cd apps/studio
npm run deploy
```

**Frontend .env.production:**
```env
VITE_SANITY_PROJECT_ID=88hgbtze
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
# VITE_SANITY_STUDIO_URL ikke nødvendig!
```

**Resultat:**
- Development: `http://localhost:3333`
- Production: `https://88hgbtze.sanity.studio` (automatisk)

### Scenario 2: Custom Studio på Cloud Run

**Setup:**
```bash
# Deploy Studio til Cloud Run
gh workflow run deploy-studio.yml
```

**Frontend .env.production:**
```env
VITE_SANITY_PROJECT_ID=88hgbtze
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
VITE_SANITY_STUDIO_URL=https://santan-studio-xyz.run.app
```

**Resultat:**
- Development: `http://localhost:3333`
- Production: `https://santan-studio-xyz.run.app` (eksplisitt satt)

### Scenario 3: PR Previews

PR previews bruker automatisk official Sanity hosting siden `VITE_SANITY_STUDIO_URL` ikke er satt:

**Resultat:**
- Frontend preview: `https://santan-frontend-pr-42-xyz.run.app`
- Studio (automatisk): `https://88hgbtze.sanity.studio`

## 🔧 Deployment Konfiguration

### GitHub Actions

**Standard deployment (deploy-cloud-run.yml):**
```yaml
# Studio URL auto-detekteres
--set-env-vars VITE_SANITY_PROJECT_ID=${{ secrets.SANITY_PROJECT_ID }}
```

**Med custom Studio URL:**

1. Legg til GitHub Secret:
   ```
   SANITY_STUDIO_URL=https://santan-studio-xyz.run.app
   ```

2. Oppdater workflow:
   ```yaml
   --set-env-vars VITE_SANITY_STUDIO_URL=${{ secrets.SANITY_STUDIO_URL }}
   ```

### Manuell Deployment

**Med default Sanity hosting:**
```bash
cd apps/frontend
./deploy.sh production
# Ingen VITE_SANITY_STUDIO_URL i .env.production
```

**Med custom Studio URL:**
```bash
cd apps/frontend
# Legg til i .env.production:
echo "VITE_SANITY_STUDIO_URL=https://your-studio-url.com" >> .env.production
./deploy.sh production
```

## 🏗️ Miljøer

### Development (npm run dev)
- Frontend: `http://localhost:3000`
- Studio: `http://localhost:3333`
- Auto-detektert: `http://localhost:3333` ✅

### Production (default)
- Frontend: Deployet til Cloud Run
- Studio: `https://<project-id>.sanity.studio` (Sanity hosting)
- Auto-detektert: `https://88hgbtze.sanity.studio` ✅

### Production (custom Studio)
- Frontend: Deployet til Cloud Run
- Studio: Deployet til Cloud Run eller annen hosting
- Må sette: `VITE_SANITY_STUDIO_URL=https://your-studio.com`

### Staging/Preview
- Frontend: PR preview deployment
- Studio: Official Sanity hosting (kan bruke staging dataset)
- Auto-detektert: `https://88hgbtze.sanity.studio` ✅

## 🔒 Sikkerhet

Security headers (CSP) oppdateres automatisk basert på Studio URL:

```typescript
// apps/frontend/src/middleware/security.ts
const studioUrl = getSanityStudioUrl();
const studioOrigin = new URL(studioUrl).origin;

// CSP header
`frame-ancestors 'self' ${studioOrigin}`
```

Dette sikrer at:
- ✅ Preview mode fungerer (Studio kan embedde frontend)
- ✅ Kun riktig Studio origin kan embedde appen
- ✅ Ingen hardkodede URLs

## 📊 Sanity Studio Hosting Alternativer

### 1. Official Sanity Hosting (Anbefalt) ⭐

**Fordeler:**
- ✅ Gratis hosting
- ✅ Global CDN
- ✅ Automatisk HTTPS
- ✅ Ingen konfigurasjon nødvendig
- ✅ Best ytelse

**Deployment:**
```bash
cd apps/studio
npm run deploy
```

**URL:** `https://<project-id>.sanity.studio`

### 2. Google Cloud Run

**Fordeler:**
- ✅ Full kontroll
- ✅ Custom middleware/auth mulig
- ✅ Samme infrastruktur som frontend
- ✅ Privat Studio mulig

**Ulemper:**
- ❌ Koster penger (~$3-8/måned)
- ❌ Må vedlikeholdes

**Deployment:**
```bash
gh workflow run deploy-studio.yml
```

### 3. Annen Hosting

Studio kan deployes til:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Etc.

**Konfiguration:**
Sett `VITE_SANITY_STUDIO_URL` til din hosting URL.

## 🐛 Troubleshooting

### Preview mode fungerer ikke

**Problem:** Frontend kan ikke kommunisere med Studio

**Løsning:**
1. Sjekk at Studio URL er korrekt:
   ```typescript
   // I browser console på frontend
   console.log(import.meta.env.VITE_SANITY_STUDIO_URL)
   ```

2. Verifiser CSP headers tillater Studio origin:
   ```bash
   curl -I https://your-frontend.run.app | grep Content-Security-Policy
   ```

3. Sjekk at Studio tillater frontend origin:
   ```typescript
   // apps/studio/sanity.config.ts
   presentationTool({
     previewUrl: 'https://your-frontend.run.app',
     allowOrigins: ['https://your-frontend.run.app']
   })
   ```

### Feil Studio URL i production

**Problem:** Frontend bruker localhost eller feil URL

**Debug:**
```bash
# Sjekk environment variables i Cloud Run
gcloud run services describe santan-frontend \
  --region europe-west1 \
  --format="value(spec.template.spec.containers[0].env)"
```

**Løsning:**
```bash
# Sett riktig URL
gcloud run services update santan-frontend \
  --region europe-west1 \
  --set-env-vars VITE_SANITY_STUDIO_URL=https://your-studio-url.com
```

### TypeScript errors med VITE_SANITY_STUDIO_URL

**Problem:** `Property 'VITE_SANITY_STUDIO_URL' does not exist`

**Løsning:**
Allerede fikset i `src/lib/env.ts` - variabelen er optional:
```typescript
VITE_SANITY_STUDIO_URL: z.string().url().optional()
```

## 📚 Relaterte Filer

- `apps/frontend/src/constants/config.ts` - URL-oppløsningslogikk
- `apps/frontend/src/middleware/security.ts` - CSP headers
- `apps/frontend/src/lib/env.ts` - Environment validation
- `apps/frontend/.env.example` - Dokumentasjon
- `.github/workflows/deploy-cloud-run.yml` - Deployment
- `apps/studio/sanity.config.ts` - Studio config

## 💡 Best Practices

### ✅ DO:

1. **Bruk official Sanity hosting i produksjon**
   ```bash
   cd apps/studio && npm run deploy
   ```

2. **Ikke sett VITE_SANITY_STUDIO_URL med mindre nødvendig**
   - Auto-detection fungerer for de fleste brukstilfeller

3. **Test preview mode etter deployment**
   - Åpne Studio → Presentation tool
   - Verifiser at frontend embedder riktig

4. **Bruk miljøspesifikke .env-filer**
   - `.env` - development
   - `.env.production` - production
   - `.env.staging` - staging

### ❌ DON'T:

1. ❌ Hardkode Studio URL i koden
2. ❌ Commit `.env` med faktiske verdier (bruk `.env.example`)
3. ❌ Bruk `http://` i production (kun HTTPS)
4. ❌ Glem å oppdatere Studio allowOrigins ved frontend URL-endring

## 🎉 Sammendrag

Med denne implementeringen:

- ✅ **Automatisk URL-oppløsning** i alle miljøer
- ✅ **Ingen hardkodede URLs** i koden
- ✅ **Fleksibel konfigurasjon** via environment variables
- ✅ **Smart defaults** (Sanity official hosting)
- ✅ **Override-mulighet** når nødvendig
- ✅ **Type-safe** med Zod validation
- ✅ **Godt dokumentert** med eksempler

Frontend finner alltid riktig Studio, uansett hvor den er hostet! 🚀

