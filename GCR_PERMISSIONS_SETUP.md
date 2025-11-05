# 🔐 GCR/Artifact Registry Permissions Setup

Denne guiden forklarer hvordan du gir GitHub Actions service account tillatelse til å pushe Docker images til Google Container Registry (gcr.io).

## 🚨 Feilen du får

```
denied: gcr.io repo does not exist. Creating on push requires the 
artifactregistry.repositories.createOnPush permission
```

Dette betyr at:
1. Service account mangler tillatelse til å opprette repositories automatisk
2. Service account mangler tillatelse til å pushe images til gcr.io

## ✅ Løsning: Gi nødvendige IAM roller

### Metode 1: Automatisk med script (anbefalt)

```bash
# Kjør setup scriptet
PROJECT_ID=your-gcp-project-id ./setup-gcr-permissions.sh
```

### Metode 2: Manuelt via gcloud CLI

```bash
# Sett project ID
export PROJECT_ID="your-gcp-project-id"
export SERVICE_ACCOUNT="github-actions@${PROJECT_ID}.iam.gserviceaccount.com"

# Aktiver nødvendige APIs
gcloud services enable artifactregistry.googleapis.com --project=$PROJECT_ID
gcloud services enable storage-api.googleapis.com --project=$PROJECT_ID

# Gi Storage Admin rolle (gcr.io bruker Cloud Storage)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/storage.admin"

# Gi Artifact Registry Writer rolle (for å pushe images)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/artifactregistry.writer"

# Gi Artifact Registry Admin rolle (for auto-create repositories)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/artifactregistry.admin"
```

### Metode 3: Via Google Cloud Console

1. Gå til [IAM & Admin](https://console.cloud.google.com/iam-admin/iam)
2. Finn service account: `github-actions@PROJECT_ID.iam.gserviceaccount.com`
3. Klikk ✏️ (Edit principal)
4. Klikk **ADD ANOTHER ROLE** (3 ganger)
5. Legg til disse rollene:
   - **Storage Admin** (`roles/storage.admin`)
   - **Artifact Registry Writer** (`roles/artifactregistry.writer`)
   - **Artifact Registry Administrator** (`roles/artifactregistry.admin`)
6. Klikk **Save**

## 🔍 Verifiser at rollene er lagt til

```bash
# List alle roller for service account
gcloud projects get-iam-policy $PROJECT_ID \
    --flatten="bindings[].members" \
    --filter="bindings.members:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
    --format="table(bindings.role)"
```

Du skal se:
```
ROLE
roles/artifactregistry.admin
roles/artifactregistry.writer
roles/iam.serviceAccountUser
roles/run.admin
roles/storage.admin
```

## 📋 Hva hver rolle gjør

| Rolle | Formål | Nødvendig for |
|-------|--------|---------------|
| **Storage Admin** | Full tilgang til Cloud Storage | Push til gcr.io (bruker Cloud Storage) |
| **Artifact Registry Writer** | Skrive/pushe images | Push Docker images |
| **Artifact Registry Admin** | Opprette repositories | Auto-create repos on first push |
| **Cloud Run Admin** | Deploy til Cloud Run | Deploy services (allerede satt opp) |
| **Service Account User** | Bruke service account | All Cloud Run deployment (allerede satt opp) |

## 🔄 Etter du har gitt tillatelser

1. **Ingen endringer nødvendig i koden** - Workflows er allerede konfigurert riktig
2. **Re-run GitHub Actions workflow:**
   - Gå til failed workflow i GitHub Actions
   - Klikk **Re-run failed jobs**
   - Docker push skal nå fungere! ✅

## 🐛 Troubleshooting

### Feilen vedvarer etter å ha gitt roller

**Vent 60 sekunder** - IAM endringer kan ta opptil 60 sekunder å propagere.

```bash
# Test om service account har tilgang
gcloud auth activate-service-account \
    github-actions@${PROJECT_ID}.iam.gserviceaccount.com \
    --key-file=path/to/key.json

# Test push (krever lokal key file)
docker tag test gcr.io/${PROJECT_ID}/test:latest
docker push gcr.io/${PROJECT_ID}/test:latest
```

### "Service account does not exist"

Service account må opprettes først:

```bash
# Opprett service account (hvis den ikke finnes)
gcloud iam service-accounts create github-actions \
    --display-name="GitHub Actions" \
    --project=$PROJECT_ID

# Opprett ny nøkkel
gcloud iam service-accounts keys create key.json \
    --iam-account=github-actions@${PROJECT_ID}.iam.gserviceaccount.com

# Encode til base64 for GitHub Secret
cat key.json | base64
```

### Alternative: Opprett repository manuelt først

Hvis du ikke vil gi Admin-tillatelser, kan du opprette repositories manuelt:

```bash
# Opprett gcr.io repository (hvis det ikke finnes)
gcloud artifacts repositories create gcr.io \
    --repository-format=docker \
    --location=us \
    --description="Docker repository for GitHub Actions" \
    --project=$PROJECT_ID
```

Da trenger du kun `roles/artifactregistry.writer` og `roles/storage.admin`.

## 📚 Relaterte dokumenter

- [GITHUB_CI_SETUP.md](GITHUB_CI_SETUP.md) - GitHub Actions setup
- [CLOUD_RUN_DEPLOYMENT.md](CLOUD_RUN_DEPLOYMENT.md) - Cloud Run deployment
- [PREVIEW_ENVIRONMENTS.md](PREVIEW_ENVIRONMENTS.md) - PR preview environments

## ✅ Sjekkliste

- [ ] Service account finnes (`github-actions@PROJECT_ID.iam.gserviceaccount.com`)
- [ ] Artifact Registry API er aktivert
- [ ] Storage API er aktivert
- [ ] Service account har `Storage Admin` rolle
- [ ] Service account har `Artifact Registry Writer` rolle
- [ ] Service account har `Artifact Registry Admin` rolle (eller repository er opprettet manuelt)
- [ ] IAM endringer har propagert (vent 60 sekunder)
- [ ] GitHub Actions workflow re-run

## 🎉 Success!

Når alt er satt opp riktig, vil du se i GitHub Actions:

```
✅ Build Studio Docker image
✅ Push Studio Docker image
✅ Deploy Studio Preview
✅ Build Frontend Docker image
✅ Push Frontend Docker image
✅ Deploy Frontend Preview
✅ Comment PR with preview URLs
```

Og du får en kommentar på PR med preview URLs! 🚀

