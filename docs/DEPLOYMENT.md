# LiftSutra deployment

## Production architecture

The mobile app calls a public HTTPS API. The free testing and early-user setup is:

`Expo/EAS app -> api.liftsutra.example/api -> Render web service -> MongoDB Atlas`

The included Blueprint uses Render's `free` web-service plan. Free Render services sleep after 15 minutes without traffic and can take about a minute to wake up, so upgrade to an always-on plan before expecting production-grade responsiveness.

Use a custom API domain when available. It allows the backend host to change later without shipping a new mobile build.

## 1. Rotate exposed credentials

The old MongoDB credential and JWT secret were previously committed. Rotate both before any deployment. A new JWT secret invalidates all existing sessions. Never copy the old values into Render.

## 2. Configure MongoDB Atlas

1. Create separate staging and production databases.
2. Create a least-privilege application database user for each environment.
3. Choose the Atlas region closest to the Render region.
4. Add only Render's outbound IP ranges to the Atlas IP access list.
5. Enable backups and alerts, and test restoring a backup.

## 3. Deploy the API to Render

1. In Render, create a Blueprint from this repository. `render.yaml` selects `backend/` as the service root and the free compute plan.
2. Configure `MONGO_URI` with the rotated Atlas URI.
3. Let the Blueprint generate and securely store `JWT_SECRET` automatically. Rotating it later logs every user out.
4. If you publish Expo web, set `CORS_ORIGINS` to its comma-separated exact HTTPS origins. Leave it unset for a native-only release; Android and iOS requests without a browser origin remain allowed.
5. Deploy and verify both endpoints:
   - `/health` returns 200 when the process is alive.
   - `/ready` returns 200 only when MongoDB is connected.
6. Add the custom API domain and verify TLS.

Native iOS and Android requests do not require a browser CORS origin. Browser origins remain allowlisted for the web build.

## 4. Connect EAS builds to the public API

The API URL is public configuration and must end in `/api`. Do not put database credentials or signing secrets in any `EXPO_PUBLIC_*` value.

```sh
npx eas-cli@latest env:set --name EXPO_PUBLIC_API_URL --value https://api.liftsutra.example/api --environment preview --visibility plaintext
npx eas-cli@latest env:set --name EXPO_PUBLIC_API_URL --value https://api.liftsutra.example/api --environment production --visibility plaintext
```

Link the app to the owner's Expo account once:

```sh
npx eas-cli@latest login
npx eas-cli@latest init
```

`eas init` writes the real EAS project ID. Do not invent or copy a project ID from another application.

## 5. Verify and build

```sh
npm ci
npm test
npx expo install --check
npx expo-doctor
EXPO_PUBLIC_API_URL=https://api.liftsutra.example/api EAS_BUILD_PROFILE=preview npm run check:release
npx eas-cli@latest build --profile preview --platform all
```

Test the preview build on real Android and iOS devices before store builds. Then use the `production` profile to build an Android App Bundle and iOS archive.
