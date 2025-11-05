# 🚀 CI/CD Quick Reference - Monorepo Edition

## 📦 Workflows Oversikt

| Workflow | Trigger | Hva den gjør | Monorepo Handling |
|----------|---------|--------------|-------------------|
| **CI** | Push/PR | Lint, type-check, build, test | Bygger shared først, deretter kun endrede apper |
| **Deploy Frontend** | Push til main/production | Deploy til Cloud Run | Docker bygger shared automatisk |
| **Deploy Studio** | Manuell | Deploy til Cloud Run (valgfri) | Docker bygger shared automatisk |
| **PR Preview** | Open PR | Lager preview deployments | Deployer kun endrede apper |
| **Cleanup** | Close PR | Sletter preview deployments | Rydder både frontend og studio |

## 🏗️ Build Order (Viktig!)

```
1. packages/shared (ALLTID FØRST - inneholder Sanity types)
   ↓
2. apps/frontend (bruker types fra shared)
   ↓
3. apps/studio (bruker types fra shared)
```

**Workflows håndterer dette automatisk via:**
- GitHub Actions: `needs: [build-shared]` + artifacts
- Docker: Multi-stage build
- Turborepo: `dependsOn: ["^build"]`

## 🔧 Setup Commands

```bash
# Full setup (one command)
./setup-github-ci.sh

# Eller manuelt:
cd apps/frontend
cp .env.example .env.production
nano .env.production
./setup-secrets.sh
./deploy.sh production
```

## 🏗️ Local Build Commands (følg rekkefølgen!)

```bash
# 1. ALLTID bygg shared først
npm run build --workspace=@santan/shared

# 2. Deretter bygg appene
npm run build --workspace=@santan/frontend
npm run build --workspace=@santan/studio

# Eller bygg alt (Turborepo håndterer rekkefølgen)
npm run build

# Test med Turborepo dev mode (hot reload)
npm run dev
```

## 🔄 Type Generation (viktig for monorepo!)

```bash
# Når du endrer Sanity schemas, generer nye types
cd apps/studio
npm run generate-types

# Dette oppdaterer packages/shared/src/types/
# Commit ALLTID sammen med schema-endringer
git add apps/studio/src/schemaTypes packages/shared/src/types
git commit -m "Add new content type with generated types"
```

## 🔑 Required GitHub Secrets

### Metode 1: Service Account Key (enklest)
```
GCP_PROJECT_ID          = your-project-id
GCP_SA_KEY              = {...json content...}
SANITY_PROJECT_ID       = abc123xyz
SANITY_DATASET          = production
```

### Metode 2: Workload Identity (anbefalt)
```
GCP_PROJECT_ID          = your-project-id
WIF_PROVIDER            = projects/123.../github-provider
WIF_SERVICE_ACCOUNT     = github-actions@project.iam.gserviceaccount.com
SANITY_PROJECT_ID       = abc123xyz
SANITY_DATASET          = production
```

## 📊 Monitoring

```bash
# Se workflow status
gh run list

# Se logs fra en kjøring
gh run view RUN_ID --log

# Se Cloud Run logs
gcloud run services logs tail santan-frontend --region=europe-west1

# Åpne GitHub Actions i browser
open "https://github.com/$(git config --get remote.origin.url | sed 's/.*://;s/.git$//')/actions"
```

## 🔄 Common Tasks

### Deploy manuelt
```bash
cd apps/frontend
./deploy.sh production
```

### Trigger workflow manuelt
```bash
gh workflow run deploy-cloud-run.yml -f environment=production
```

### Oppdatere secrets
```bash
# I GitHub UI
gh secret set GCP_PROJECT_ID

# Eller via CLI
gh secret set GCP_PROJECT_ID --body "your-project-id"
```

### Se alle secrets
```bash
gh secret list
```

## 🐛 Troubleshooting

### "Cannot find module @santan/shared"
```bash
# Shared package ikke bygget
npm run build --workspace=@santan/shared

# Eller reinstaller alt
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install
npm run build --workspace=@santan/shared
```

### Type errors etter schema-endringer
```bash
# Regenerer types
cd apps/studio
npm run generate-types

# Restart TypeScript i IDE
# VS Code: CMD+Shift+P → "TypeScript: Restart TS Server"
```

### CI bygger feil rekkefølge
```bash
# Workflows bruker 'needs: [build-shared]'
# Sjekk workflow logs at shared bygges først
# Se MONOREPO_CI_CD.md for detaljer
```

### Workflow feiler med auth error
```bash
# Verifiser secrets er satt
gh secret list

# Test auth lokalt
gcloud auth list
gcloud config get-value project
```

### Preview deployment feiler
```bash
# Sjekk at service account har riktige rettigheter
gcloud projects get-iam-policy $GCP_PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:github-actions@"
```

### Docker build feiler
```bash
# Test build lokalt for frontend
cd apps/frontend
docker build -t santan-test -f Dockerfile ../../

# Test build lokalt for studio
cd apps/studio
docker build -t santan-studio-test -f Dockerfile ../../

# Sjekk for errors
docker run -p 8080:8080 santan-test
```

## 📝 Workflow Files

```
.github/workflows/
├── ci.yml                  # Test & build på hver push/PR
├── deploy-cloud-run.yml    # Deploy til production
├── pr-preview.yml          # Preview deployments for PRs
└── cleanup-preview.yml     # Cleanup når PR lukkes
```

## 🎯 Branch Strategy

```
main (protected)
  ├─ feature/new-feature → PR → PR Preview → Merge → Deploy
  ├─ fix/bug-fix → PR → PR Preview → Merge → Deploy
  └─ develop → Merge → Deploy to staging (optional)
```

## 💰 Cost Optimization

### Reduser preview costs
I `pr-preview.yml`:
```yaml
--memory 512Mi          # Mindre memory
--min-instances 0       # Scale to zero
--max-instances 1       # Maks 1 instans
--timeout 60            # Kortere timeout
```

### Limit preview deployments
```yaml
on:
  pull_request:
    types: [opened, synchronize]
    branches: [main]
    paths:
      - 'apps/frontend/**'  # Kun ved frontend changes
```

## 🔒 Security Best Practices

✅ Bruk Workload Identity Federation  
✅ Limit service account permissions  
✅ Enable branch protection på main  
✅ Require PR reviews  
✅ Enable Dependabot  
✅ Enable CodeQL scanning  
✅ Roter secrets regelmessig  

## 📚 Full Documentation

- [MONOREPO_CI_CD.md](./MONOREPO_CI_CD.md) - **Hvordan CI/CD håndterer monorepo**
- [GITHUB_CI_SETUP.md](./GITHUB_CI_SETUP.md) - Komplett setup guide
- [CLOUD_RUN_DEPLOYMENT.md](./CLOUD_RUN_DEPLOYMENT.md) - Cloud Run details
- [QUICKSTART_CLOUD_RUN.md](./QUICKSTART_CLOUD_RUN.md) - Quick start guide
- [TYPE_MIGRATION.md](./TYPE_MIGRATION.md) - Type generation workflow

