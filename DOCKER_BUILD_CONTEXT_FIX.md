# 🐳 Docker Build Context Fix - Studio

## Problem

Docker-bygget feilet med:
```
COPY failed: file not found in build context or excluded by .dockerignore: 
stat apps/studio/package.json: file does not exist
```

Dette skjedde fordi Cloud Run prøvde å bygge fra `apps/studio/` directory, men Dockerfilen refererer til filer i parent directory (`packages/shared`).

## Løsning

### Monorepo-aware Docker Build

Studio Dockerfilen (`apps/studio/Dockerfile`) er nå konfigurert til å bygge fra **repository root**, ikke fra `apps/studio/` subdirectory.

**Dockerfile struktur:**
```dockerfile
# Build context: repository root
FROM node:22-alpine AS base

FROM base AS deps
WORKDIR /app

# Copy from repository root
COPY package.json package-lock.json* ./
COPY apps/studio/package.json ./apps/studio/
COPY packages/shared/package.json ./packages/shared/

RUN npm ci

# Build shared package first
FROM base AS shared-builder
COPY --from=deps /app/node_modules ./node_modules
COPY packages/shared ./packages/shared
RUN npm run build

# Build studio
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=shared-builder /app/packages/shared ./packages/shared
COPY apps/studio ./apps/studio
RUN npm run build
```

## Hvordan deploye

### ✅ Riktig måte (fra repository root):

```bash
# Manuell deployment
cd /path/to/santan  # Repository root
gcloud run deploy santan-studio \
  --source . \
  --dockerfile apps/studio/Dockerfile \
  --region europe-west1
```

### ❌ Feil måte:

```bash
# Dette fungerer IKKE for monorepo!
cd apps/studio
gcloud run deploy santan-studio \
  --source . \
  --region europe-west1
```

## GitHub Actions

Workflows er allerede konfigurert riktig:

**`.github/workflows/deploy-studio.yml`:**
```yaml
- name: Build Docker image
  run: |
    docker build \
      -f apps/studio/Dockerfile \  # Dockerfile location
      .                            # Build context = repository root
```

**`.github/workflows/pr-preview.yml`:**
```yaml
- name: Build Studio Docker image
  run: |
    docker build \
      -t gcr.io/${{ env.PROJECT_ID }}/santan-studio-pr-${{ steps.pr.outputs.number }} \
      -f apps/studio/Dockerfile \  # Dockerfile location
      .                            # Build context = repository root
```

## Test lokalt

```bash
# Fra repository root
docker build -f apps/studio/Dockerfile -t santan-studio-test .

# Test at den bygger
docker run -p 8080:8080 \
  -e SANITY_STUDIO_PROJECT_ID=qzo347ei \
  -e SANITY_STUDIO_DATASET=production \
  santan-studio-test

# Åpne http://localhost:8080
```

## Forklaring

### Hvorfor dette er nødvendig

I et monorepo må Docker-bygget ha tilgang til:
1. **Root `package.json`** - Workspace configuration
2. **`apps/studio/package.json`** - Studio dependencies
3. **`packages/shared/package.json`** - Shared package dependencies
4. **`packages/shared/src/`** - Source code som må bygges først

Hvis du bygger fra `apps/studio/` directory, kan Docker ikke se `packages/shared/`.

### Build Context vs Dockerfile Location

**Build context** (`.`):
- Bestemmer hvilke filer Docker kan kopiere
- Må være repository root for monorepo

**Dockerfile location** (`-f apps/studio/Dockerfile`):
- Hvor Dockerfilen ligger
- Kan være hvor som helst

**Eksempel:**
```bash
docker build -f apps/studio/Dockerfile .
              ↑                        ↑
              Dockerfile location      Build context
```

## Samme løsning for Frontend

Frontend Dockerfile fungerer på samme måte:

```bash
# Fra repository root
docker build -f apps/frontend/Dockerfile -t santan-frontend .
```

**Frontend Dockerfile:**
```dockerfile
# Build context: repository root
FROM node:22-alpine AS base

# Copy from root
COPY package.json package-lock.json* ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared/package.json ./packages/shared/

# ... build shared first, then frontend
```

## Verifisering

### Sjekk at build context er riktig

**Se hva som kopieres:**
```bash
# Fra repository root
docker build -f apps/studio/Dockerfile . --progress=plain 2>&1 | grep COPY
```

Du skal se:
```
COPY package.json package-lock.json* ./
COPY apps/studio/package.json ./apps/studio/
COPY packages/shared/package.json ./packages/shared/
```

### Test full build

```bash
# Clean build uten cache
docker build --no-cache -f apps/studio/Dockerfile -t santan-studio .

# Se layers
docker history santan-studio
```

## Troubleshooting

### Feil: "COPY failed: file not found"

**Problem:** Du bygger fra feil directory

**Løsning:**
```bash
# Sjekk at du er i repository root
pwd  # Skal vise /path/to/santan

# Ikke /path/to/santan/apps/studio
cd ../..  # Gå til root hvis nødvendig
```

### Feil: "failed to solve with frontend dockerfile.v0"

**Problem:** Dockerfile syntax feil eller feil build context

**Løsning:**
```bash
# Verifiser Dockerfile syntax
docker build --check -f apps/studio/Dockerfile .

# Se detaljerte logs
docker build --progress=plain -f apps/studio/Dockerfile .
```

### Feil: "npm ci" feiler

**Problem:** package-lock.json ikke synkronisert

**Løsning:**
```bash
# Fra repository root
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
```

## Relaterte Filer

- **Dockerfiles:**
  - `apps/studio/Dockerfile` - Studio build
  - `apps/frontend/Dockerfile` - Frontend build

- **Workflows:**
  - `.github/workflows/deploy-studio.yml` - Studio deployment
  - `.github/workflows/deploy-cloud-run.yml` - Frontend deployment
  - `.github/workflows/pr-preview.yml` - PR previews

- **Dokumentasjon:**
  - `SELF_HOSTED_STUDIO.md` - Studio deployment guide
  - `MONOREPO_CI_CD.md` - Monorepo CI/CD details

## Sammendrag

✅ **Studio Dockerfile bygger nå fra repository root**  
✅ **Alle workflows bruker riktig build context**  
✅ **Dokumentasjon oppdatert med korrekte kommandoer**  
✅ **Lokal testing guide inkludert**  

Build context-problemet er løst! 🎉
