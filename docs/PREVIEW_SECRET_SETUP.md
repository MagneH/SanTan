# Preview Secret Setup Guide

This guide explains how the Sanity preview secret works in this repository, how to create and manage it, and how to verify preview functionality locally and in Cloud Run.

## 1. What Is the Preview Secret?
A document of type `sanity.previewUrlSecret` stored in your Sanity dataset containing a single `secret` string. It allows the frontend (`/api/preview`) and the Studio Presentation Tool to validate draft preview requests.

## 2. Required Environment Variables
Place these in either the repo root `.env.local` or `apps/frontend/.env.local`.

Minimum for read-only validation (Preview mode access):
- `SANITY_READ_TOKEN` (Can be an Editor token; must have read operations for dataset)

Required for management scripts (create/delete/publish):
- `SANITY_API_TOKEN` (Editor or Administrator permissions)

Project metadata (already used elsewhere):
- `SANITY_PROJECT_ID` / `VITE_SANITY_PROJECT_ID`
- `SANITY_DATASET` / `VITE_SANITY_DATASET`
- `SANITY_API_VERSION` / `VITE_SANITY_API_VERSION`

Optional debug (prints loaded env files & token resolution):
- `PREVIEW_SECRET_DEBUG=1`

## 3. Core Scripts (Frontend)
Run from repo root with `npm --prefix apps/frontend run <script>` or `cd apps/frontend`.

- `setup:preview-secret` – Creates a secret if none exists (static default value).
- `create:proper-preview-secret` – Generates a fresh random secret, deletes any existing, creates a new one.
- `publish:preview-secret` – Publishes newest draft secret (if draft) and outputs URL.
- `cleanup:preview-secrets` – Keeps newest secret, deletes older ones, publishes if needed.
- `get:preview-secret` – Lists existing secrets (published first) and shows preview URL.
- `verify:preview-secret [secret?]` – Verifies a specific secret exists & is published.

## 4. Recommended Initial Setup
```bash
# 1. Ensure tokens
export SANITY_API_TOKEN=your_editor_token
export SANITY_READ_TOKEN=$SANITY_API_TOKEN

# 2. Generate & normalize a single published secret
npm --prefix apps/frontend run create:proper-preview-secret
npm --prefix apps/frontend run publish:preview-secret   # Only needed if output indicates draft

# 3. Verify
npm --prefix apps/frontend run get:preview-secret
npm --prefix apps/frontend run verify:preview-secret

# 4. Test manual preview in browser
open "http://localhost:3000/api/preview?secret=THESECRET&slug=/"
```

## 5. Using Studio Presentation Tool
1. Run both Studio and Frontend locally:
   - Studio: `cd apps/studio && npm run dev`
   - Frontend: `cd apps/frontend && npm run dev`
2. Open a document in Studio.
3. Click the Presentation tab / eye icon.
4. You should be redirected to the frontend with draft content visible.

If it fails:
- Ensure the secret is published (use `get:preview-secret`).
- Confirm `SANITY_STUDIO_FRONTEND_URL` includes protocol (e.g. `http://localhost:3000`).
- Check that only one published secret exists (run `cleanup:preview-secrets`).

## 6. Preview URL Anatomy
`http://localhost:3000/api/preview?secret=<secret>&slug=/your/path`
- `secret` – Must match the `secret` field of the published `sanity.previewUrlSecret` document.
- `slug` – Optional path to redirect after enabling preview (defaults to `/`).

## 7. Rotation Strategy
When rotating the secret:
```bash
npm --prefix apps/frontend run create:proper-preview-secret  # creates new draft secret
npm --prefix apps/frontend run publish:preview-secret
npm --prefix apps/frontend run cleanup:preview-secrets       # ensures only newest published remains
```
Distribute the new secret only after publishing; old preview URLs will stop working.

## 8. Cloud Run / Preview Environments
For PR preview deployments:
- Set `SANITY_API_TOKEN` & `SANITY_READ_TOKEN` as secrets in Cloud Build / GitHub Actions and inject into both Frontend and Studio services.
- Ensure `SANITY_STUDIO_FRONTEND_URL` points to the generated frontend URL (protocol required).
- Run `create:proper-preview-secret` once per dataset (not per deployment) unless intentionally rotating.

## 9. Debugging Checklist
| Symptom | Action |
|---------|--------|
| 401 Invalid secret | Run `get:preview-secret` and use published secret value |
| Multiple secrets causing mismatch | Run `cleanup:preview-secrets` |
| Presentation Tool fails but manual URL works | Check protocol on `SANITY_STUDIO_FRONTEND_URL` |
| Script says no token found | Add `SANITY_API_TOKEN` to `.env.local` and try with `PREVIEW_SECRET_DEBUG=1` |
| Manual /api/preview returns 302 but no drafts shown | Ensure preview cookie set; verify session logic |

## 10. Internal Validation Logic
In `apps/frontend/src/routes/api.preview.ts`:
- GET handler uses `validatePreviewUrl` first (Studio integration).
- Falls back to GROQ query if direct `secret` param supplied.
- Sets a session cookie upon success (draft content visible).

## 11. Security Notes
- Treat the preview secret like a token; keep it out of public code snippets.
- Rotate periodically or when sharing access widely.
- Prefer an Editor token for management; restrict usage to CI and local development.

## 12. Common Pitfalls
- Missing protocol (`localhost:3000` vs `http://localhost:3000`) -> Presentation errors.
- Having multiple draft secrets -> Validation picks unintended one.
- Using a Read token to delete documents -> Permission errors (403).

## 13. One-Line Quick Fixes
```bash
# Publish newest draft secret quickly
npm --prefix apps/frontend run publish:preview-secret

# Clean & publish in one go
npm --prefix apps/frontend run cleanup:preview-secrets

# Inspect with debug output
PREVIEW_SECRET_DEBUG=1 npm --prefix apps/frontend run get:preview-secret
```

## 14. Next Improvements (Optional)
- Add CI step that verifies secret presence & publishes if draft.
- Add automated secret rotation scheduled (monthly) with notification.
- Add health endpoint that returns preview status for environment.

---
Maintained in `docs/PREVIEW_SECRET_SETUP.md`. Update this doc whenever preview handling changes.

