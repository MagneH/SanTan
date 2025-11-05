# GitHub Actions Workflows

Dette prosjektet bruker GitHub Actions for automatisk testing, bygging og deployment av et **monorepo med frontend og studio**.

## 🏗️ Monorepo Structure

Prosjektet består av:
- `apps/frontend` - React frontend (TanStack Start)
- `apps/studio` - Sanity Studio CMS
- `packages/shared` - Delte TypeScript types (generert fra Sanity schemas)

**Viktig:** `packages/shared` må bygges først siden både frontend og studio bruker disse typene.

## 🔄 Workflows

### 1. CI (ci.yml)
**Trigger:** Push/PR til `main` eller `develop`

Kjører kvalitetssjekker:
- ✅ ESLint
- ✅ TypeScript type checking
- ✅ Build alle packages
- ✅ Kjør tester

**Status badge:**
```markdown
![CI](https://github.com/USERNAME/REPO/actions/workflows/ci.yml/badge.svg)
```

### 2. Deploy to Cloud Run (deploy-cloud-run.yml)
**Trigger:** 
- Push til `main` eller `production`
- Manuell kjøring via Actions UI
- Kun ved endringer i `apps/frontend/**` eller `packages/**`

Deployer til Google Cloud Run:
1. Bygger Docker image
2. Pusher til Google Container Registry
3. Deployer til Cloud Run
4. Rapporterer deployment URL

**Status badge:**
```markdown
![Deploy](https://github.com/USERNAME/REPO/actions/workflows/deploy-cloud-run.yml/badge.svg)
```

### 3. PR Preview (pr-preview.yml)
**Trigger:** PR åpnes eller oppdateres

Lager preview deployment:
1. Bygger Docker image for PR
2. Deployer til separat Cloud Run service (`santan-pr-{number}`)
3. Kommenterer på PR med preview URL
4. Oppdaterer kommentar ved nye commits

**Preview URL format:**
```
https://santan-pr-123-abc123-ew.a.run.app
```

### 4. Cleanup Preview (cleanup-preview.yml)
**Trigger:** PR lukkes (merge eller close)

Rydder opp:
1. Sletter Cloud Run preview service
2. Sletter Docker images
3. Kommenterer på PR

## 🔑 Required Secrets

Legg til i GitHub: **Settings → Secrets and variables → Actions**

### Metode 1: Service Account Key (enklest)
| Secret | Beskrivelse |
|--------|-------------|
| `GCP_PROJECT_ID` | Google Cloud Project ID |
| `GCP_SA_KEY` | Service Account Key JSON |
| `SANITY_PROJECT_ID` | Sanity Project ID |
| `SANITY_DATASET` | Sanity Dataset (production/staging) |

### Metode 2: Workload Identity Federation (anbefalt)
| Secret | Beskrivelse |
|--------|-------------|
| `GCP_PROJECT_ID` | Google Cloud Project ID |
| `WIF_PROVIDER` | Workload Identity Provider |
| `WIF_SERVICE_ACCOUNT` | Service Account Email |
| `SANITY_PROJECT_ID` | Sanity Project ID |
| `SANITY_DATASET` | Sanity Dataset |

## 🚀 Quick Setup

```bash
# Kjør setup script
./setup-github-ci.sh

# Følg instruksjonene for å legge til secrets i GitHub
```

**Full guide:** Se [GITHUB_CI_SETUP.md](../GITHUB_CI_SETUP.md)

## 📊 Viewing Workflow Runs

### Via GitHub UI
1. Gå til **Actions** tab
2. Velg workflow i venstre meny
3. Klikk på en kjøring for detaljer

### Via CLI (GitHub CLI)
```bash
# List runs
gh run list

# Se detaljer
gh run view RUN_ID

# Se logs
gh run view RUN_ID --log

# Watch live
gh run watch
```

## 🔧 Customization

### Endre deploy region
I `deploy-cloud-run.yml`:
```yaml
env:
  REGION: europe-west1  # Endre til din region
```

### Justere resources
I deploy-kommandoen:
```yaml
--memory 1Gi       # 512Mi, 1Gi, 2Gi, etc.
--cpu 1            # 1, 2, 4
--min-instances 0  # 0 = scale to zero
--max-instances 10 # Max concurrent instances
```

### Disable PR previews
Fjern eller kommenter ut `pr-preview.yml` og `cleanup-preview.yml`

### Add staging environment
Dupliser `deploy-cloud-run.yml` og endre:
```yaml
on:
  push:
    branches:
      - develop  # Deploy staging fra develop branch

env:
  SERVICE_NAME: santan-frontend-staging
```

## 🐛 Troubleshooting

### Workflow feiler med authentication error
1. Verifiser at secrets er lagt til korrekt
2. Sjekk at service account har nødvendige rettigheter:
   ```bash
   gcloud projects get-iam-policy $GCP_PROJECT_ID \
     --flatten="bindings[].members" \
     --filter="bindings.members:serviceAccount:github-actions@"
   ```

### Build feiler
1. Test lokalt først:
   ```bash
   cd apps/frontend
   docker build -t test -f Dockerfile ../../
   ```
2. Sjekk workflow logs for spesifikke feilmeldinger
3. Verifiser at alle dependencies er i package.json

### Preview deployment feiler
1. Sjekk at GCP quota ikke er nådd
2. Verifiser at service account kan opprette Cloud Run services
3. Se Cloud Build logs i GCP Console

## 📈 Monitoring

### GitHub Actions
- **Dashboard:** `https://github.com/USERNAME/REPO/actions`
- **Workflow runs:** Se historikk og status
- **Artifacts:** Last ned build artifacts

### Google Cloud
```bash
# Se logs
gcloud run services logs read santan-frontend --region=europe-west1

# Se service status
gcloud run services describe santan-frontend --region=europe-west1

# List alle services
gcloud run services list
```

## 💡 Best Practices

✅ **Require CI to pass** før merge til main  
✅ **Enable branch protection** på main branch  
✅ **Use preview deployments** for testing  
✅ **Monitor workflow costs** i GitHub billing  
✅ **Set up notifications** for failed workflows  
✅ **Regularly update actions** til nyeste versjon  
✅ **Use caching** for raskere builds (allerede konfigurert)  

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Google Cloud Run CI/CD](https://cloud.google.com/run/docs/continuous-deployment)
- [Complete Setup Guide](../GITHUB_CI_SETUP.md)
- [Deployment Guide](../CLOUD_RUN_DEPLOYMENT.md)

## 🆘 Support

For problemer eller spørsmål:
1. Sjekk [troubleshooting section](#-troubleshooting)
2. Les [full dokumentasjon](../GITHUB_CI_SETUP.md)
3. Åpne en issue på GitHub

