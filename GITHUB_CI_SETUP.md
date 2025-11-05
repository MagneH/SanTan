# 🔄 GitHub CI/CD Setup Guide

Denne guiden viser deg hvordan du setter opp automatisk testing, bygging og deployment til Google Cloud Run med GitHub Actions for et **monorepo med frontend og studio**.

## 📋 Oversikt

Vi har satt opp flere workflows for å håndtere monorepo-strukturen:

1. **CI (ci.yml)** - Kjører på hver push/PR: lint, type-check, build, test
   - Detekterer hvilke apper som har endret seg
   - Bygger `packages/shared` først (påkrevd for alle apper)
   - Bygger kun de appene som har endringer
   
2. **Deploy (deploy-cloud-run.yml)** - Deployer frontend til Cloud Run
   - Triggers ved push til `main` eller `production`
   - Bygger shared package som del av Docker build
   
3. **Deploy Studio (deploy-studio.yml)** - Valgfri Cloud Run deployment for Studio
   - Kun manuell kjøring (Sanity hosting anbefales normalt)
   
4. **PR Preview (pr-preview.yml)** - Lager preview-deployments for pull requests
   - Detekterer om frontend og/eller studio har endret seg
   - Deployer frontend til Cloud Run hvis endret
   - Bygger studio artifact hvis endret
   - Kommenterer på PR med alle tilgjengelige previews
   
5. **Cleanup (cleanup-preview.yml)** - Rydder opp preview-deployments når PR lukkes

## 🏗️ Monorepo Build Order

Workflows sikrer riktig build-rekkefølge:

```
1. packages/shared (bygges først - inneholder Sanity types)
   ↓
2. apps/frontend (bruker types fra shared)
   ↓
3. apps/studio (bruker types fra shared)
```

Dette håndteres automatisk via:
- **GitHub Actions:** `build-shared` job kjører først, artifacts lastes ned av andre jobs
- **Docker build:** Multi-stage build bygger shared før app
- **Turborepo:** `dependsOn: ["^build"]` i turbo.json

---

## 🚀 Quick Setup (Service Account Key metode)

Dette er den enkleste måten å komme i gang på.

### Steg 1: Opprett Service Account i GCP

```bash
# Sett variabler
export GCP_PROJECT_ID="your-project-id"
export SERVICE_ACCOUNT_NAME="github-actions"

# Opprett service account
gcloud iam service-accounts create ${SERVICE_ACCOUNT_NAME} \
  --display-name="GitHub Actions CI/CD" \
  --project=${GCP_PROJECT_ID}

# Gi nødvendige rettigheter
gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID} \
  --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID} \
  --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID} \
  --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID} \
  --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Steg 2: Generer Service Account Key

```bash
# Opprett nøkkel
gcloud iam service-accounts keys create github-actions-key.json \
  --iam-account=${SERVICE_ACCOUNT_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com

# Vis innholdet (dette skal legges i GitHub Secrets)
cat github-actions-key.json
```

⚠️ **VIKTIG:** Slett filen etter du har kopiert innholdet:
```bash
rm github-actions-key.json
```

### Steg 3: Konfigurer GitHub Secrets

Gå til ditt GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Legg til følgende secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `GCP_PROJECT_ID` | `your-project-id` | Ditt GCP prosjekt-ID |
| `GCP_SA_KEY` | `{...json innhold...}` | Innholdet fra service account key filen |
| `SANITY_PROJECT_ID` | `abc123xyz` | Ditt Sanity prosjekt-ID |
| `SANITY_DATASET` | `production` | Sanity dataset (production/staging) |

### Steg 4: Test workflow

Push en endring til `main` branch:

```bash
git add .
git commit -m "Set up GitHub Actions CI/CD"
git push origin main
```

Gå til GitHub → **Actions** tab for å se workflow kjøre! 🎉

---

## 🔒 Anbefalt Setup (Workload Identity Federation)

Dette er mer sikkert siden du ikke trenger å lagre private keys.

### Steg 1: Aktiver Workload Identity Federation

```bash
export GCP_PROJECT_ID="your-project-id"
export PROJECT_NUMBER=$(gcloud projects describe ${GCP_PROJECT_ID} --format="value(projectNumber)")
export GITHUB_REPO="username/repo-name"  # Eks: "octocat/hello-world"
export SERVICE_ACCOUNT_NAME="github-actions"

# Opprett Workload Identity Pool
gcloud iam workload-identity-pools create "github-pool" \
  --project="${GCP_PROJECT_ID}" \
  --location="global" \
  --display-name="GitHub Actions Pool"

# Opprett Provider
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
  --project="${GCP_PROJECT_ID}" \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"
```

### Steg 2: Gi GitHub tilgang til Service Account

```bash
# Opprett service account (hvis ikke allerede gjort)
gcloud iam service-accounts create ${SERVICE_ACCOUNT_NAME} \
  --display-name="GitHub Actions CI/CD" \
  --project=${GCP_PROJECT_ID}

# Gi rettigheter (samme som over)
gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID} \
  --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID} \
  --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID} \
  --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Bind Workload Identity
gcloud iam service-accounts add-iam-policy-binding \
  "${SERVICE_ACCOUNT_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --project="${GCP_PROJECT_ID}" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-pool/attribute.repository/${GITHUB_REPO}"
```

### Steg 3: Hent Workload Identity Provider navn

```bash
gcloud iam workload-identity-pools providers describe "github-provider" \
  --project="${GCP_PROJECT_ID}" \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --format="value(name)"
```

Dette gir deg noe som:
```
projects/123456789/locations/global/workloadIdentityPools/github-pool/providers/github-provider
```

### Steg 4: Konfigurer GitHub Secrets

Legg til følgende secrets i GitHub:

| Secret Name | Value |
|-------------|-------|
| `GCP_PROJECT_ID` | `your-project-id` |
| `WIF_PROVIDER` | `projects/123.../github-provider` (fra steg 3) |
| `WIF_SERVICE_ACCOUNT` | `github-actions@your-project-id.iam.gserviceaccount.com` |
| `SANITY_PROJECT_ID` | `abc123xyz` |
| `SANITY_DATASET` | `production` |

---

## 🎯 Workflows i detalj

### 1. CI Workflow (ci.yml)

**Trigger:** Hver push til `main`/`develop` eller PR

**Intelligente builds med path detection:**
```yaml
changes:
  shared:   'packages/shared/**'
  frontend: 'apps/frontend/**' eller 'packages/shared/**'
  studio:   'apps/studio/**' eller 'packages/shared/**'
```

**Build order:**
1. **Detect changes** - Hvilke apper har endret seg?
2. **Build shared** - Bygger shared package først (hvis noe har endret seg)
3. **Parallel jobs** (kun for endrede apper):
   - Lint alle apper
   - Type check alle apper
   - Build frontend (hvis endret)
   - Build studio (hvis endret)
   - Run tests
4. **CI Success** - Sammenligner alle resultater

**Fordeler:**
- ✅ Bygger kun det som har endret seg
- ✅ Shared package bygges alltid først
- ✅ Parallelle jobs for raskere CI
- ✅ Artifacts caches for senere bruk

**Status:** Må være grønn før merge til main

### 2. Deploy Workflow (deploy-cloud-run.yml)

**Trigger:** 
- Push til `main` eller `production` branch
- Manuell kjøring via GitHub Actions UI

**Hva den gjør:**
1. Bygger Docker image (multi-stage build)
   - Installerer dependencies
   - Bygger `packages/shared` først
   - Bygger `apps/frontend`
2. Pusher til Google Container Registry
3. Deployer til Cloud Run
4. Viser deployment URL

**Path filtering:** Kjører kun ved endringer i:
- `apps/frontend/**`
- `packages/**`
- Workflow-filen selv

**Docker build håndterer automatisk:**
- ✅ Bygger shared package først
- ✅ Kopierer shared dist til frontend
- ✅ Optimalisert multi-stage build
- ✅ Minimal image størrelse

### 3. PR Preview Workflow (pr-preview.yml)

**Trigger:** Når en PR åpnes eller oppdateres

**Intelligente previews:**
- Detekterer om frontend og/eller studio har endret seg
- Deployer kun de appene som har endringer
- Hver app får sin egen preview URL

**Hva den gjør:**

**For Frontend (hvis endret):**
1. Bygger shared package
2. Bygger Docker image
3. Deployer til Cloud Run (`santan-frontend-pr-123`)
4. Returnerer preview URL

**For Studio (hvis endret):**
1. Bygger shared package
2. Bygger studio
3. Lager build artifact
4. Tilgjengelig for manuell deployment

**PR Comment format:**
```markdown
## 🚀 Preview deployments

### ✅ Frontend
**Preview URL:** https://santan-frontend-pr-123-abc.run.app

### ✅ Studio
Build successful. Artifacts available for download.
Deploy to Sanity manually if needed:
```bash
cd apps/studio
npm run deploy
```

**Changes detected:**
- 🌐 Frontend
- 🎨 Studio
```

**Fordeler:**
- ✅ Separat preview per app
- ✅ Kun deployer det som har endret seg
- ✅ Spar ressurser og kostnader
- ✅ Rask feedback på endringer

### 4. Deploy Studio Workflow (deploy-studio.yml)

**Trigger:** Kun manuell kjøring

**Hva den gjør:**
1. Bygger Studio Docker image
2. Deployer til Cloud Run
3. Returnerer Studio URL

**Merk:** Dette er valgfritt! Sanity anbefaler å bruke deres hosting:
```bash
cd apps/studio
npm run deploy
```

Cloud Run-alternativet er nyttig hvis du vil:
- Ha full kontroll over hosting
- Kjøre custom middleware
- Integrere med andre GCP-tjenester

### 5. Cleanup Workflow (cleanup-preview.yml)

**Trigger:** Når en PR lukkes (merge eller close)

**Hva den gjør:**
1. **Cleanup Frontend:**
   - Sletter Cloud Run preview service
   - Sletter tilhørende Docker images
   
2. **Cleanup Studio:**
   - Artifacts slettes automatisk etter 7 dager
   
3. **Comment on PR:**
   - Bekrefter at cleanup er gjort

---

## 🔍 Troubleshooting

### Workflow feiler med "Permission denied"

**Problem:** Service account mangler rettigheter

**Løsning:**
```bash
# Sjekk eksisterende roller
gcloud projects get-iam-policy ${GCP_PROJECT_ID} \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:github-actions@${GCP_PROJECT_ID}.iam.gserviceaccount.com"

# Legg til manglende rolle
gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID} \
  --member="serviceAccount:github-actions@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/MISSING_ROLE"
```

### Docker build feiler

**Problem:** Ikke nok minne eller disk space i GitHub Actions runner

**Løsning:** Legg til i workflow før build:

```yaml
- name: Free up disk space
  run: |
    sudo rm -rf /usr/share/dotnet
    sudo rm -rf /opt/ghc
    sudo rm -rf "/usr/local/share/boost"
    sudo rm -rf "$AGENT_TOOLSDIRECTORY"
```

### Secret ikke tilgjengelig i Cloud Run

**Problem:** Cloud Run kan ikke lese secrets fra Secret Manager

**Løsning:**
```bash
# Gi Cloud Run Compute service account tilgang
PROJECT_NUMBER=$(gcloud projects describe ${GCP_PROJECT_ID} --format="value(projectNumber)")

gcloud secrets add-iam-policy-binding SECRET_NAME \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Workload Identity Federation feiler

**Problem:** "Failed to generate Google Cloud access token"

**Løsning:**
1. Verifiser at repository match er korrekt (username/repo)
2. Sjekk at service account har `workloadIdentityUser` role
3. Verifiser provider navn er korrekt i GitHub Secrets

---

## 📊 Monitoring og Logs

### Se workflow-kjøringer

```bash
# List kjøringer
gh run list

# Se detaljer for en kjøring
gh run view RUN_ID

# Se logs for en jobb
gh run view RUN_ID --log
```

### Se Cloud Run logs etter deploy

```bash
# Live logs
gcloud run services logs tail santan-frontend --region=europe-west1

# Søk i logs
gcloud run services logs read santan-frontend \
  --region=europe-west1 \
  --limit=100 \
  --format="table(timestamp,severity,textPayload)"
```

---

## 🎨 Custom Environments

For å sette opp staging environment:

### 1. Opprett staging environment i GitHub

Settings → Environments → New environment → `staging`

### 2. Legg til environment-spesifikke secrets

I staging environment settings, legg til:
- `SANITY_DATASET` = `staging`

### 3. Deploy til staging

Push til `develop` branch eller kjør manuelt:
```bash
gh workflow run deploy-cloud-run.yml -f environment=staging
```

---

## 💡 Best Practices

### ✅ DO:

- ✅ Bruk Workload Identity Federation i produksjon
- ✅ Begrens service account permissions (principle of least privilege)
- ✅ Bruk forskjellige service accounts for prod/staging
- ✅ Aktiver branch protection på `main`
- ✅ Krev at CI er grønn før merge
- ✅ Roter service account keys regelmessig

### ❌ DON'T:

- ❌ Commit service account keys til git
- ❌ Gi `Owner` rolle til service accounts
- ❌ Bruk samme secrets for prod og staging
- ❌ Deaktiver security scanning
- ❌ Skip testing i CI

---

## 🔐 Security Checklist

- [ ] Service account keys er lagret kun i GitHub Secrets
- [ ] Service accounts har minimum nødvendige permissions
- [ ] Branch protection er aktivert på `main`
- [ ] Secrets rotation er planlagt
- [ ] Dependabot er aktivert for sikkerhetoppdateringer
- [ ] Code scanning (CodeQL) er aktivert

For å aktivere CodeQL:
```bash
# Legg til .github/workflows/codeql.yml (kan gjøres via GitHub UI)
# Security → Code scanning alerts → Set up scanning → CodeQL
```

---

## 📚 Ressurser

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Google Cloud Run CI/CD](https://cloud.google.com/run/docs/continuous-deployment)
- [Workload Identity Federation](https://cloud.google.com/iam/docs/workload-identity-federation)
- [GitHub Actions Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

---

## 🆘 Support

Hvis du møter på problemer:

1. **Sjekk workflow logs** i GitHub Actions tab
2. **Verifiser secrets** er satt korrekt
3. **Test lokalt** først med Docker
4. **Se Cloud Run logs** for runtime errors
5. **Åpne en issue** hvis problemet vedvarer

For mer hjelp, se vår [Deployment Guide](./CLOUD_RUN_DEPLOYMENT.md).

