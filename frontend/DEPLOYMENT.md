# Musallih Frontend — Production Deployment

This document covers production builds and deployment for the consumer web app, consumer mobile app, and optional CI.

## Environment variables

### Consumer Web (`apps/musallih/web`)

Copy `apps/musallih/web/.env.example` to `apps/musallih/web/.env` and set:

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (e.g. `https://api.musallih.dev/v1`) |
| `VITE_FIREBASE_*` | Firebase project config (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId) |

All `VITE_*` vars are baked into the build; do not put secrets in them.

### Consumer Mobile (`apps/musallih/mobile`)

Copy `apps/musallih/mobile/.env.example` to `apps/musallih/mobile/.env` and set:

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_API_URL` | Backend API base URL |
| `EXPO_PUBLIC_FIREBASE_*` | Same Firebase config (no measurementId required for mobile) |

---

## Web (consumer) — Static host

1. **Build**

   From `frontend/`:

   ```bash
   npm run build:web
   ```

   Output: `apps/musallih/web/dist/`.

2. **Deploy** the contents of `dist/` to a static host (e.g. Azure Static Web Apps, Vercel, Netlify, Cloudflare Pages).

3. **SPA fallback**  
   Configure the host so all routes (e.g. `/map`, `/entities/:id`) serve `index.html`. The app uses React Router and handles routes client-side.

4. **Cache**  
   - `index.html`: no-store or short max-age  
   - `assets/*`: long max-age with immutable/cache-busting filenames (Vite does this by default)

5. **Optional**  
   - Map tiles: consumer map uses `https://demotiles.maplibre.org/...` by default. For production you may switch to your own tile URL or a commercial provider and set it in the map component.

---

## Mobile (consumer) — EAS Build

The mobile app uses **Expo** and **MapLibre React Native**, which requires a **development build** (not Expo Go).

1. **Install EAS CLI** (if needed)

   ```bash
   npm i -g eas-cli
   eas login
   ```

2. **Configure**  
   Ensure `apps/musallih/mobile/app.json` has the MapLibre plugin and correct `slug`, `ios.bundleIdentifier`, `android.package`.

3. **Build**

   From `frontend/apps/musallih/mobile/`:

   ```bash
   eas build --platform all --profile production
   ```

   Use `eas.json` to define profiles (e.g. `development`, `preview`, `production`) and env vars per profile if needed.

4. **Submit** (optional)  
   To ship to stores:

   ```bash
   eas submit --platform all --latest --profile production
   ```

5. **Over-the-air (OTA)**  
   For JS-only updates without a new native build, use Expo Updates and a channel tied to your production profile.

---

## Backend alignment

- **Map / nearby**  
  The consumer map calls `GET /organizations/nearby` with query params: `bbox`, `category`, `sect`, `timing`, `distanceBand`, `facilities`. If the backend does not implement this yet, the frontend falls back to sample data and shows a short message. Implement the endpoint for production use.

- **Auth**  
  Firebase ID token → `POST /v1/auth/token` → JWT. Ensure the API and Firebase project are configured for your domains and bundle IDs.

- **Analytics**  
  Web: Firebase Analytics. Mobile: events can be sent to `API_BASE_URL/analytics/events` and/or forwarded to your analytics pipeline.

---

## CI (optional)

Suggested pipeline:

1. **Lint**  
   `npm run lint` (or per-app lint scripts).

2. **Typecheck**  
   - Web: `npm run build:web` (Vite runs tsc).  
   - Mobile: `cd apps/musallih/mobile && npx tsc --noEmit`.

3. **Tests**  
   Run unit tests (e.g. `npm run test` in workspace or per app).

4. **Build**  
   - `npm run build:web`  
   - `npm run build:dashboard`  
   - For mobile: `eas build --platform all --profile production --non-interactive` (with EAS configured).

5. **Deploy**  
   Deploy web `dist/` to staging/production using the host’s CLI or API (e.g. Azure SWA, Vercel, Netlify). Optionally run smoke tests after deploy.

---

## Observability

- **Web**: Firebase Analytics is initialized; ensure `measurementId` is set in production.
- **Auth**: Monitor token exchange and 401s; use runbooks for “users can’t sign in” (Firebase + API health).
- **Map**: If you use your own tiles, monitor tile endpoint errors and latency.
