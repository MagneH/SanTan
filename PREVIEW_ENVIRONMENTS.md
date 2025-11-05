# 🔄 Preview Environments Setup Guide

Dette dokumentet beskriver hvordan du setter opp preview environments for PR-er.

## 📋 Hva er Preview Environments?

Preview environments gir deg:
- ✅ **Automatisk deployment** av både Frontend og Studio for hver PR
- ✅ **Isolerte test-miljøer** - hver PR får sine egne URLs
- ✅ **Rask feedback** - test endringer før merge
- ✅ **Automatisk cleanup** - alt slettes når PR lukkes

## 🎯 Workflow Oversikt

```
PR åpnes → Deploy Preview (Frontend + Studio) → Comment på PR med URLs
          ↓
PR oppdateres → Redeploy Preview (oppdaterte URLs)
          ↓
PR lukkes → Cleanup (sletter alt automatisk)
```

## 🔧 Setup i GitHub

### 1. Opprett "preview" Environment

**Gå til:** Repository → **Settings** → **Environments** → **New environment**

**Navn:** `preview`

**Protection rules:**
- ✅ **Deployment branches**: All branches (slik at alle PRs kan deploye)
- ❌ **Required reviewers**: (ikke nødvendig for previews)
- ❌ **Wait timer**: 0 minutes

**Environment secrets:**

Legg til disse secrets i preview environment:

| Secret Name | Value | Beskrivelse |
|-------------|-------|-------------|
| `SANITY_PROJECT_ID` | `88hgbtze` | Sanity prosjekt-ID |
| `SANITY_DATASET` | `production` | Dataset (eller `staging` hvis du har det) |
| `VITE_SANITY_PROJECT_ID` | `88hgbtze` | Sanity prosjekt-ID (public) |
| `VITE_SANITY_DATASET` | `production` | Dataset (public) |

### 2. Verifiser Repository Secrets

**Gå til:** Repository → **Settings** → **Secrets and variables** → **Actions**

Disse må finnes på **repository**-nivå (ikke environment):

| Secret Name | Beskrivelse |
|-------------|-------------|
| `GCP_PROJECT_ID` | Google Cloud Project ID |
| `GCP_SA_KEY` | Service Account Key (base64) |

Disse må finnes i **Secret Manager** (GCP):

| Secret Name | Beskrivelse |
|-------------|-------------|
| `sanity-api-read-token` | Sanity read token for preview mode |
| `session-secret` | Session secret for preview mode |

## 🚀 Workflows

### pr-preview.yml

**Trigger:** PR åpnes, oppdateres, eller reopenes

**Hva den gjør:**
1. Bygger og deployer **Studio preview** til Cloud Run
2. Bygger og deployer **Frontend preview** til Cloud Run
3. Kobler Frontend til Studio (via environment variables)
4. Kobler Studio til Frontend (Presentation Tool)
5. Kommenterer på PR med begge URLs

**Service naming:**
- Studio: `santan-studio-pr-{PR_NUMBER}`
- Frontend: `santan-frontend-pr-{PR_NUMBER}`

### cleanup-preview.yml

**Trigger:** PR lukkes (merged eller closed)

**Hva den gjør:**
1. Sletter Frontend Cloud Run service
2. Sletter Studio Cloud Run service
3. Sletter alle Docker images for denne PR
4. Kommenterer på PR at cleanup er gjort

## 📊 PR Comment Eksempel

Når preview er klar, får du en kommentar på PR-en:

```markdown
## 🚀 Preview Environment Ready!

### Frontend
**URL:** https://santan-frontend-pr-42-xyz123-ew.a.run.app

### Studio
**URL:** https://santan-studio-pr-42-abc456-ew.a.run.app

---

**Details:**
- **PR:** #42
- **Commit:** `abc1234`
- **Built at:** 2025-11-05T10:30:00Z

<details>
<summary>Preview Configuration</summary>

- **Region:** europe-west1
- **Resources:** 512Mi memory, 1 CPU
- **Min instances:** 0 (scales to zero)
- **Max instances:** 1

Both frontend and studio are configured to work together:
- Frontend knows about Studio URL
- Studio Presentation Tool points to Frontend

</details>

⚠️ These preview URLs will be automatically deleted when this PR is closed.
```

## 🔗 Hvordan det fungerer

### 1. Studio deployes først

```bash
gcloud run deploy santan-studio-pr-42 \
  --image gcr.io/PROJECT/santan-studio-pr-42:COMMIT_SHA \
  --set-env-vars SANITY_STUDIO_PROJECT_ID=88hgbtze
```

**Output:** Studio URL (f.eks. `https://santan-studio-pr-42-abc.run.app`)

### 2. Frontend deployes med Studio URL

```bash
gcloud run deploy santan-frontend-pr-42 \
  --image gcr.io/PROJECT/santan-frontend-pr-42:COMMIT_SHA \
  --set-env-vars VITE_SANITY_STUDIO_URL=<studio-url-from-step-1>
```

**Output:** Frontend URL (f.eks. `https://santan-frontend-pr-42-xyz.run.app`)

### 3. Studio oppdateres med Frontend URL

```bash
gcloud run services update santan-studio-pr-42 \
  --set-env-vars SANITY_STUDIO_FRONTEND_URL=<frontend-url-from-step-2>
```

**Resultat:** Studio Presentation Tool kan nå embedde Frontend!

## 💰 Kostnader

**Per PR Preview:**
- **Frontend:** 512Mi memory, 0-1 instances
- **Studio:** 512Mi memory, 0-1 instances
- **Estimat:** ~$1-3 per PR per måned (hvis den er aktiv hele måneden)

**Med scale-to-zero:**
- Ingen kostnad når preview ikke brukes
- Betaler kun for faktisk bruk

**Best practices:**
- ✅ Lukk PRs når de ikke trengs (automatic cleanup)
- ✅ Begrens antall samtidige PRs
- ✅ Preview environments er ment for testing, ikke langvarig bruk

## 🧪 Teste Preview Environments

### 1. Lag en test-PR

```bash
# Lag en ny branch
git checkout -b test/preview-deployment

# Gjør en endring
echo "# Testing Preview" >> TEST.md
git add TEST.md
git commit -m "Test preview deployment"

# Push til GitHub
git push origin test/preview-deployment
```

### 2. Opprett PR på GitHub

**Gå til:** Repository → **Pull requests** → **New pull request**

- Base: `main`
- Compare: `test/preview-deployment`
- Klikk **Create pull request**

### 3. Vent på deployment

**Gå til:** PR → **Checks** tab

Se at `deploy-preview` workflow kjører. Når den er ferdig:

**Gå til:** PR → **Conversation** tab

Scroll ned og se kommentaren fra GitHub Actions bot med preview URLs!

### 4. Test preview environment

Åpne begge URLs:
1. **Frontend URL** - Test at frontend laster
2. **Studio URL** - Test at Studio laster
3. I Studio: Gå til **Presentation** tool
4. Verifiser at frontend vises embedded i Studio

### 5. Lukk PR for å teste cleanup

**Gå til:** PR → **Close pull request**

Se at `cleanup-preview` workflow kjører automatisk og sletter alt.

## 🐛 Troubleshooting

### Preview deployment feiler

**Sjekk workflow logs:**

Gå til PR → **Checks** → **deploy-preview** → Se logs

**Vanlige problemer:**

1. **"Service account not found"**
   - Verifiser at `GCP_SA_KEY` er satt i repository secrets
   - Sjekk at service account har `roles/run.admin`

2. **"Secret not found"**
   - Verifiser at `sanity-api-read-token` og `session-secret` finnes i Secret Manager
   - Sjekk at Cloud Run service account har `roles/secretmanager.secretAccessor`

3. **"Build failed"**
   - Sjekk at Dockerfiler bygger fra repository root
   - Se Docker build logs i workflow

### Preview fungerer ikke

**Frontend laster ikke:**
```bash
# Test URL
curl -I https://santan-frontend-pr-42-xyz.run.app

# Sjekk logs
gcloud run services logs read santan-frontend-pr-42 --region europe-west1
```

**Studio laster ikke:**
```bash
# Test URL
curl -I https://santan-studio-pr-42-abc.run.app

# Sjekk logs
gcloud run services logs read santan-studio-pr-42 --region europe-west1
```

### Cleanup feiler

Hvis cleanup ikke kjører automatisk, slett manuelt:

```bash
# Slett Frontend
gcloud run services delete santan-frontend-pr-42 --region europe-west1

# Slett Studio
gcloud run services delete santan-studio-pr-42 --region europe-west1

# Slett Docker images
gcloud container images delete gcr.io/PROJECT/santan-frontend-pr-42
gcloud container images delete gcr.io/PROJECT/santan-studio-pr-42
```

## 📈 Monitoring

### Se alle aktive preview deployments

```bash
# List alle Cloud Run services med "pr" i navnet
gcloud run services list --region europe-west1 | grep "pr-"
```

### Se kostnader

**Gå til:** Google Cloud Console → **Billing** → **Reports**

Filter på:
- Service: Cloud Run
- Labels: `pr-*`

## 🔒 Sikkerhet

### Environment Variables

**Preview environments bruker:**
- ✅ Same Sanity project som production (`88hgbtze`)
- ✅ Same dataset (`production`)
- ✅ Same secrets fra Secret Manager
- ⚠️ `NODE_ENV=preview` (ikke `production`)

**Advarsel:** Preview environments har tilgang til production data!

**Hvis du vil isolere preview environments:**

1. Opprett et `staging` dataset i Sanity
2. Oppdater `preview` environment secrets:
   ```
   SANITY_DATASET=staging
   VITE_SANITY_DATASET=staging
   ```

### Access Control

**Hvem kan deploye previews?**
- Alle som kan åpne PRs i repository
- Beskytt med branch protection rules hvis nødvendig

**Begrens tilgang:**
- Sett **Required reviewers** på `preview` environment
- Krever godkjenning før preview deployes

## 💡 Best Practices

### ✅ DO:

1. **Test i preview før merge**
   - Verifiser at endringer fungerer
   - Test både frontend og studio

2. **Lukk PRs når ikke i bruk**
   - Automatic cleanup sparer kostnader

3. **Bruk beskrivende PR-titler**
   - Lettere å identifisere hvilken preview som er hvilken

4. **Sjekk preview logs**
   - Fang feil tidlig før production

### ❌ DON'T:

1. ❌ Bruk preview for langvarig testing
2. ❌ Ha for mange samtidige PRs åpne
3. ❌ Ignorer preview deployment feil
4. ❌ Test med production-kritisk data i preview

## 🎉 Sammendrag

Med preview environments får du:

- ✅ **Automatisk deployment** av både Frontend og Studio
- ✅ **Isolerte test-miljøer** per PR
- ✅ **Rask feedback loop** før merge
- ✅ **Automatisk cleanup** når PR lukkes
- ✅ **Klar til bruk** - bare opprett en PR!

Start testing nå ved å opprette din første PR! 🚀

