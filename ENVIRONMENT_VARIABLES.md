# 📝 Environment Variables Guide

Dette dokumentet forklarer hvilke environment variables som brukes hvor i monorepo.

## 🎯 Oversikt

Prosjektet består av to separate apper med sine egne environment variables:

```
apps/
├── frontend/    # React frontend med TanStack Start
│   └── .env     # Frontend-spesifikke variabler
└── studio/      # Sanity Studio CMS
    └── .env     # Studio-spesifikke variabler
```

## 🌐 Frontend Environment Variables

**Lokasjon:** `apps/frontend/.env`

### Public Variables (VITE_ prefix)

Disse eksponeres til browseren og kan leses på client-side:

| Variable | Brukes i | Beskrivelse |
|----------|----------|-------------|
| `VITE_SANITY_PROJECT_ID` | Sanity client config | Sanity prosjekt-ID |
| `VITE_SANITY_DATASET` | Sanity client config | Dataset navn (production, staging) |
| `VITE_SANITY_API_VERSION` | Sanity client config | API versjon (YYYY-MM-DD format) |
| `VITE_SANITY_STUDIO_URL` | Security middleware, config | Studio URL for preview mode og CSP headers |

**Eksempel:**
```env
VITE_SANITY_PROJECT_ID=qzo347ei
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-02-13
VITE_SANITY_STUDIO_URL=  # Valgfri - auto-detekteres
```

### Private Variables (server-side only)

Disse er KUN tilgjengelige på server-side og eksponeres ALDRI til browseren:

| Variable | Brukes i | Beskrivelse |
|----------|----------|-------------|
| `SANITY_READ_TOKEN` | Preview mode, draft content | Read token for å hente draft/preview content |
| `SANITY_SESSION_SECRET` | Iron Session | Secret for å kryptere preview mode sessions |
| `NODE_ENV` | Build config | Environment (development/production) |
| `PORT` | Server | Port serveren lytter på (Cloud Run bruker 8080) |

**Eksempel:**
```env
SANITY_READ_TOKEN=sk...
SANITY_SESSION_SECRET=generate-with-openssl-rand-base64-32
NODE_ENV=development
PORT=8080
```

### Filer som bruker frontend env vars:

```typescript
// VITE_SANITY_* brukes i:
apps/frontend/src/
├── constants/config.ts           # getSanityStudioUrl()
├── functions/sanity.loader.server.ts  # Sanity client
├── lib/env.ts                    # Environment validation
├── middleware/security.ts        # CSP headers
└── sanity/client.ts             # Sanity client config

// SANITY_READ_TOKEN brukes i:
apps/frontend/src/
├── routes/api.preview.ts        # Preview mode API
├── routes/api.draft-token.tsx   # Draft token API
├── loaders/*.ts                 # Data loaders
├── lib/previewMode.ts           # Preview mode validation
└── sanity/loadQueryOptions.ts   # Query options

// SANITY_SESSION_SECRET brukes i:
apps/frontend/src/
└── sessions.ts                  # Iron Session config
```

### ❌ Variabler FJERNET fra frontend:

Disse var i frontend/.env men brukes IKKE av frontend:

- ~~`SANITY_API_TOKEN`~~ - Brukes ikke av frontend
- ~~`SANITY_API_READ_TOKEN`~~ - Feil navn (skal være SANITY_READ_TOKEN)
- ~~`SANITY_API_WRITE_TOKEN`~~ - Brukes ikke av frontend
- ~~`SESSION_SECRET`~~ - Feil navn (skal være SANITY_SESSION_SECRET)

## 🎨 Studio Environment Variables

**Lokasjon:** `apps/studio/.env`

### Studio Variables (SANITY_STUDIO_ prefix)

Disse brukes av Sanity Studio:

| Variable | Brukes i | Beskrivelse |
|----------|----------|-------------|
| `SANITY_STUDIO_PROJECT_ID` | projectDetails.ts, sanity.config.ts | Sanity prosjekt-ID |
| `SANITY_STUDIO_DATASET` | projectDetails.ts, sanity.config.ts | Dataset navn |
| `SANITY_STUDIO_API_VERSION` | projectDetails.ts, sanity.config.ts | API versjon |
| `SANITY_STUDIO_FRONTEND_URL` | sanity.config.ts | Frontend URL for Presentation Tool |

**Eksempel:**
```env
SANITY_STUDIO_PROJECT_ID=qzo347ei
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_API_VERSION=2025-10-15
SANITY_STUDIO_FRONTEND_URL=  # Valgfri - auto-detekteres
```

### Filer som bruker studio env vars:

```typescript
// SANITY_STUDIO_* brukes i:
apps/studio/
├── projectDetails.ts            # Eksporterer project config
├── sanity.config.ts            # Main Studio config
└── src/actions/fullSlugPublishAction.tsx  # NODE_ENV for debugging

// NODE_ENV brukes i:
apps/studio/src/
├── actions/fullSlugPublishAction.tsx
├── utils/computeFullSlugRecursive.ts
├── utils/fullSlugMonitor.ts
└── utils/updateChildrenRecursive.ts
```

### ❌ Variabler FJERNET fra studio:

Disse var i studio/.env men brukes IKKE av studio:

- ~~`SANITY_STUDIO_API_TOKEN`~~ - Brukes ikke av Studio (tokens håndteres av Sanity CLI)
- ~~`SANITY_READ_TOKEN`~~ - Kun nødvendig i frontend
- ~~`SANITY_SESSION_SECRET`~~ - Kun nødvendig i frontend
- ~~`SANITY_API_TOKEN`~~ - Brukes ikke av Studio
- ~~`SANITY_STUDIO_PREVIEW_URL`~~ - Erstattet med SANITY_STUDIO_FRONTEND_URL
- ~~`SANITY_STUDIO_PREVIEW_SECRET`~~ - Håndteres av frontend

## 🔄 Environment-spesifikke filer

### Development (lokal utvikling)

```
apps/frontend/.env           # Development variabler
apps/studio/.env             # Development variabler
```

### Production

```
apps/frontend/.env.production   # Production variabler
# Studio bruker environment variables fra Cloud Run deployment
```

## 🚀 Deployment Secrets

### GitHub Secrets (for CI/CD)

| Secret | Brukes i | Beskrivelse |
|--------|----------|-------------|
| `GCP_PROJECT_ID` | Alle workflows | Google Cloud Project ID |
| `GCP_SA_KEY` | Alle workflows | Service Account Key JSON |
| `SANITY_PROJECT_ID` | deploy-cloud-run.yml | Sanity prosjekt-ID |
| `SANITY_DATASET` | deploy-cloud-run.yml | Sanity dataset |
| `SANITY_STUDIO_URL` | deploy-cloud-run.yml | Self-hosted Studio URL |
| `FRONTEND_URL` | deploy-studio.yml | Frontend URL for Presentation Tool |

### Google Cloud Secrets (via Secret Manager)

Disse settes via `apps/frontend/setup-secrets.sh`:

| Secret | Beskrivelse |
|--------|-------------|
| `sanity-api-read-token` | SANITY_READ_TOKEN for preview mode |
| `session-secret` | SANITY_SESSION_SECRET for sessions |

## 📊 Environment Variable Matrix

| Variable | Frontend | Studio | GitHub Actions | Cloud Run |
|----------|----------|--------|----------------|-----------|
| `VITE_SANITY_PROJECT_ID` | ✅ | ❌ | ✅ | ✅ |
| `VITE_SANITY_DATASET` | ✅ | ❌ | ✅ | ✅ |
| `VITE_SANITY_API_VERSION` | ✅ | ❌ | ✅ | ✅ |
| `VITE_SANITY_STUDIO_URL` | ✅ | ❌ | ✅ | ✅ |
| `SANITY_READ_TOKEN` | ✅ | ❌ | ❌ | ✅ (via Secret Manager) |
| `SANITY_SESSION_SECRET` | ✅ | ❌ | ❌ | ✅ (via Secret Manager) |
| `SANITY_STUDIO_PROJECT_ID` | ❌ | ✅ | ❌ | ✅ |
| `SANITY_STUDIO_DATASET` | ❌ | ✅ | ❌ | ✅ |
| `SANITY_STUDIO_API_VERSION` | ❌ | ✅ | ❌ | ✅ |
| `SANITY_STUDIO_FRONTEND_URL` | ❌ | ✅ | ✅ | ✅ |
| `NODE_ENV` | ✅ | ✅ | ✅ | ✅ |
| `PORT` | ✅ | ❌ | ❌ | ✅ |

## 🔒 Sikkerhet

### Public vs Private Variables

**Public (VITE_ prefix):**
- ✅ Kan eksponeres til browseren
- ✅ Inkludert i bundle
- ✅ Synlige i DevTools
- ⚠️ ALDRI legg inn secrets her

**Private (ingen prefix):**
- ✅ Kun tilgjengelig server-side
- ✅ Aldri eksponert til browser
- ✅ Sikre for tokens og secrets
- ⚠️ MÅ være på server-side

### Best Practices

✅ **DO:**
- Bruk `VITE_` prefix for variabler som må være tilgjengelige i browser
- Bruk Secret Manager for sensitive tokens i produksjon
- Ha separate .env-filer for development og production
- Dokumenter alle variabler i .env.example

❌ **DON'T:**
- Commit .env-filer med faktiske verdier
- Legg tokens i VITE_-variabler
- Hardkod API keys i koden
- Del samme .env mellom frontend og studio

## 🐛 Troubleshooting

### "Missing VITE_SANITY_PROJECT_ID"

**Problem:** Frontend kan ikke finne Sanity config

**Løsning:**
```bash
cd apps/frontend
cp .env.example .env
# Fyll inn VITE_SANITY_PROJECT_ID, VITE_SANITY_DATASET, etc.
```

### "Missing SANITY_SESSION_SECRET"

**Problem:** Preview mode kan ikke starte

**Løsning:**
```bash
cd apps/frontend
# Generer ny secret
openssl rand -base64 32
# Legg til i .env:
echo "SANITY_SESSION_SECRET=<generert-secret>" >> .env
```

### "Studio can't connect to Sanity"

**Problem:** Studio mangler project config

**Løsning:**
```bash
cd apps/studio
cp .env.example .env
# Fyll inn SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET, etc.
```

### Environment variables ikke tilgjengelige i build

**Problem:** Variabler lastes ikke riktig

**Løsning:**
```bash
# Restart dev server
npm run dev

# Eller rebuild
npm run build
```

## 📚 Relaterte Filer

**Frontend:**
- `apps/frontend/.env.example` - Template
- `apps/frontend/src/lib/env.ts` - Validation logic
- `apps/frontend/src/constants/config.ts` - Config functions

**Studio:**
- `apps/studio/.env.example` - Template
- `apps/studio/projectDetails.ts` - Project config
- `apps/studio/sanity.config.ts` - Main config

**Deployment:**
- `apps/frontend/setup-secrets.sh` - Secret Manager setup
- `.github/workflows/*.yml` - CI/CD workflows

## 💡 Tips

1. **Bruk .env.example som referanse**
   - Alltid oppdater .env.example når du legger til nye variabler
   - Dokumenter hva hver variabel gjør

2. **Separer development og production**
   - `.env` for development
   - `.env.production` for production
   - Aldri commit faktiske verdier

3. **Valider environment variables**
   - Frontend bruker Zod for validation (se `lib/env.ts`)
   - Studio bruker runtime checks

4. **Test lokalt først**
   ```bash
   # Test at alle env vars er satt
   npm run dev
   # Sjekk for feilmeldinger i console
   ```

## 🎉 Sammendrag

**Frontend trenger:**
- ✅ `VITE_SANITY_*` - Sanity config (public)
- ✅ `SANITY_READ_TOKEN` - Preview mode (private)
- ✅ `SANITY_SESSION_SECRET` - Sessions (private)

**Studio trenger:**
- ✅ `SANITY_STUDIO_*` - Sanity config
- ✅ `SANITY_STUDIO_FRONTEND_URL` - Presentation Tool (optional)

**Delte variabler:**
- ❌ Ingen! Hver app har sine egne .env-filer

Alle environment variables er nå ryddet opp og dokumentert! 🚀
