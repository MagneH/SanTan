# 🔐 Sanity CORS Setup for Dynamic Preview URLs

## Problemet

Når Studio deployes til dynamiske URLs (f.eks. `https://santan-studio-pr-2-abc123.run.app`), må disse URL-ene være whitelistet i Sanity's CORS-konfigurasjon for at frontend skal kunne kommunisere med Sanity API.

## Løsning: Automatisk CORS-oppdatering

Vi har satt opp automatisk CORS-whitelisting via Sanity Management API i GitHub Actions workflow.

### 🔧 Setup

#### 1. Opprett Sanity Auth Token

1. Gå til [Sanity Personal Tokens](https://www.sanity.io/manage/personal/tokens)
2. Klikk **Create new token**
3. Navn: `GitHub Actions CORS`
4. Permissions: **Project Admin** (nødvendig for å oppdatere CORS)
5. Kopier token (vises kun én gang!)

#### 2. Legg til GitHub Secret

1. Gå til GitHub Repository → **Settings** → **Secrets and variables** → **Actions**
2. Klikk **New repository secret**
3. Name: `SANITY_AUTH_TOKEN`
4. Value: (lim inn token fra steg 1)
5. Klikk **Add secret**

### ✅ Hva skjer automatisk

Når en PR deployes:

1. ✅ Studio deployes til Cloud Run → får unik URL
2. ✅ Frontend deployes til Cloud Run → får unik URL
3. ✅ **Workflow legger automatisk til begge URLs i Sanity CORS whitelist**
4. ✅ Frontend kan nå kommunisere med Sanity API
5. ✅ Studio Presentation Tool fungerer

### 📋 Manuell CORS-oppdatering (hvis token ikke er satt)

Hvis `SANITY_AUTH_TOKEN` ikke er satt, må du legge til URLs manuelt:

1. Gå til [Sanity Project API Settings](https://www.sanity.io/manage/project/qzo347ei/api)
2. Scroll ned til **CORS Origins**
3. Klikk **Add CORS origin**
4. Legg til begge preview URLs:
   - Studio URL: `https://santan-studio-pr-X-xxxxx.run.app`
   - Frontend URL: `https://santan-frontend-pr-X-xxxxx.run.app`
5. Enable **Allow credentials**
6. Klikk **Save**

### 🛠️ Manuelt script

Du kan også bruke scriptet for å legge til CORS manuelt:

```bash
# Fra repository root
./apps/studio/add-studio-cors.sh https://santan-studio-pr-2-abc123.run.app
```

Scriptet vil:
- Autentisere med Sanity CLI (hvis nødvendig)
- Legge til URL-en i CORS whitelist
- Vise oppdatert liste over CORS origins

### 🔍 Verifiser CORS-konfigurasjon

**Via Sanity Dashboard:**
```
https://www.sanity.io/manage/project/qzo347ei/api
```

**Via Sanity CLI:**
```bash
cd apps/studio
sanity cors list --project qzo347ei
```

**Via Management API:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.sanity.io/v2021-06-07/projects/qzo347ei/cors
```

### 📊 Workflow Detaljer

Workflow-steget som håndterer CORS:

```yaml
- name: Add preview URLs to Sanity CORS whitelist
  env:
    SANITY_AUTH_TOKEN: ${{ secrets.SANITY_AUTH_TOKEN }}
  run: |
    # Legger til både Studio og Frontend URLs
    # Håndterer duplikater automatisk
    # Feiler gracefully hvis token mangler
```

### 🐛 Troubleshooting

#### CORS-feil i browser console

```
Access to fetch at 'https://qzo347ei.api.sanity.io/...' from origin 
'https://santan-studio-pr-2-xxx.run.app' has been blocked by CORS policy
```

**Løsning:**
1. Sjekk at `SANITY_AUTH_TOKEN` er satt i GitHub Secrets
2. Re-run workflow (det vil prøve å legge til CORS på nytt)
3. Eller legg til manuelt via Sanity Dashboard

#### Token har ikke riktige permissions

```
403 Forbidden
```

**Løsning:**
- Token må ha **Project Admin** permissions
- Opprett ny token med riktige permissions

#### URL allerede eksisterer (409 Conflict)

```
409 Conflict - Origin already exists
```

**Dette er OK!** Workflowen håndterer dette gracefully. URL-en er allerede whitelistet.

### 🔄 Cleanup

Når en PR lukkes:

1. ✅ Cloud Run services slettes (`cleanup-preview.yml`)
2. ❌ CORS origins blir **IKKE** slettet automatisk

**Hvorfor?** 
- Sanity API har rate limits
- CORS origins tar liten plass
- Gamle URLs er uansett inaktive

**Manuell cleanup (valgfritt):**

```bash
# List alle CORS origins
sanity cors list --project qzo347ei

# Slett en origin
sanity cors delete <ID> --project qzo347ei
```

Eller via Dashboard → API Settings → CORS Origins → Delete

### 💡 Best Practices

1. ✅ **Bruk wildcard for development:**
   ```
   http://localhost:*
   ```

2. ✅ **Legg til production domains statisk:**
   ```
   https://yourdomain.com
   ```

3. ✅ **Preview URLs legges til dynamisk** (via workflow)

4. ❌ **Ikke bruk wildcard i production:**
   ```
   ❌ https://*.run.app (for bredt!)
   ```

### 📚 Relaterte Filer

- **Workflow:** `.github/workflows/pr-preview.yml`
- **Manual Script:** `apps/studio/add-studio-cors.sh`
- **Cleanup:** `.github/workflows/cleanup-preview.yml`
- **Documentation:** `PREVIEW_ENVIRONMENTS.md`

### 🔗 Nyttige Lenker

- [Sanity CORS Documentation](https://www.sanity.io/docs/cors)
- [Sanity Management API](https://www.sanity.io/docs/management-api)
- [Sanity Personal Tokens](https://www.sanity.io/manage/personal/tokens)
- [Project API Settings](https://www.sanity.io/manage/project/qzo347ei/api)

---

## ✅ Quick Start

**For å aktivere automatisk CORS:**

```bash
# 1. Opprett token på Sanity.io
open https://www.sanity.io/manage/personal/tokens

# 2. Legg til i GitHub
open https://github.com/YOUR_USERNAME/SanTan/settings/secrets/actions

# 3. Navn: SANITY_AUTH_TOKEN
# 4. Value: <din token>

# 5. Test ved å åpne/oppdatere en PR
# Workflow vil automatisk legge til CORS!
```

**Ferdig! 🎉**
