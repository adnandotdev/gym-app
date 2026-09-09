# Native release readiness

Audit date: 2026-09-09. This is a preparation checklist, not a declaration that the app is approved or ready for submission. Local JavaScript exports do not create signed native store binaries or prove device behavior.

## Prepared locally

- `eas.json` contains an internal release-mode `preview` profile (Android APK) and a store `production` profile (Android App Bundle). Both explicitly disable the development client. iOS internal installation still requires registered devices and signing; TestFlight uses a store build.
- Production build numbers use EAS remote version management with automatic increments. No Expo project, credentials, accounts, or store records were created.
- The permanent native identity is configured as `com.adnandotdev.liftsutra` for iOS and Android. The owner still needs to link the app with `eas init`, which writes the real `extra.eas.projectId`.
- Release app requests require an explicitly configured HTTPS API URL with a DNS hostname. Missing, insecure, local-IP, credential-bearing, or malformed URLs show a configuration error before any authenticated request. The development fallback remains available only with `__DEV__` enabled.
- The `eas-build-post-install` hook also stops preview/production native builds when that URL is absent or invalid, using the same resolver as the app. It checks the EAS environment without reading local dotenv files. Local `expo export` does not invoke this hook, so asset/UI bundle validation remains available. See [EAS lifecycle hooks](https://docs.expo.dev/build-reference/npm-hooks/). This validates configuration syntax, not live service availability.
- With `NODE_ENV=production`, the backend refuses startup without MongoDB configuration and a signing secret of at least 32 characters; it exits if the initial DB connection fails. Later DB outages return 503, including readiness checks. The development memory store itself rejects every production call, preventing a request-time outage from storing user data in temporary memory.
- Native bearer tokens use `expo-secure-store`, with one-time migration away from legacy AsyncStorage. Web tokens are session-only. The backend applies Helmet, an exact HTTPS CORS allowlist, JSON size limits, general API throttling, stricter auth throttling, JWT issuer/audience checks, validation and stable error responses.
- The Render Blueprint, sanitized environment examples, and step-by-step deployment guide are present in the repository.

## The floating reload/home menu

The app does not define an Expo-style reload/home menu. Those controls belong to Expo Go or a development client. The menu described by the user is consistent with that host UI; verify this on the actual device. It is not included in a normal standalone release build. Do not remove debugging tools from development sessions to imitate a production build; install the release-mode preview when validating the final experience. See [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/) and [build profiles](https://docs.expo.dev/build/eas-json/).

## Remaining release gates

1. **Store account setup:** link the owner's Expo project (`extra.eas.projectId`) and supply signing credentials through the official account flows. Finish store screenshots, support URL, age rating, content declarations, privacy answers and review account. Confirm tablet layouts because `supportsTablet` is currently true.
2. **Public backend:** deploy and test a persistent HTTPS backend; set `EXPO_PUBLIC_API_URL` in both EAS preview and production environments to its exact API base path. Public Expo variables are embedded in the app and must never contain secrets. Do not ship the current LAN fallback or treat a successful local export as an API connectivity test.
3. **Account recovery:** provide a real, expiring, single-use email reset flow with generic responses, abuse controls and a configured delivery provider. A frontend message is not delivery. The former simulated success is being removed in this UI pass.
4. **Account deletion:** implement authenticated in-app deletion for the account and associated server/local data, including recovery from partial failures. Publish the external deletion-request page for Google Play and define lawful retention. Apple requires an in-app initiation path for apps with account creation; Google additionally requires a web resource. See [Apple deletion guidance](https://developer.apple.com/support/offering-account-deletion-in-your-app/) and [Google deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en).
5. **Privacy and security operations:** publish a policy matching actual email, profile, body measurements, injury and workout storage; complete Apple privacy and Google Data Safety disclosures. Rotate the exposed MongoDB credential and JWT secret, configure managed secrets, backups and restore procedures, and decide whether to purge the old Git history. Add refresh-token rotation/revocation before treating the current seven-day access token as a long-lived session system.
6. **Truthful working controls:** the audit found profile support/privacy entries without handlers, sample notification data, reminder preferences without a scheduling integration, and unavailable social sign-in. Finish or omit unavailable features in the release. Validate the final UI after concurrent changes; these are findings at audit time.
7. **Fitness content review:** have a qualified reviewer check generated exercise poses, equipment cues, warm-up guidance and injury logic. Confirm image/font rights and that no generated image teaches unsafe form. Describe the app as general exercise guidance, without promising diagnosis or injury treatment.
8. **Native QA:** run real release builds on Android and iPhone, plus supported tablets, through first launch, onboarding, keyboard use, profile save/error, search/filter, plan edits, sessions/pause/skip/finish, background/resume, logout, offline/reconnect, account isolation, accessibility text sizes and screen readers. Verify every content area clears system bars and the keyboard. Test notification permission denied if notifications are implemented.
9. **Signed build checks:** local dependency, test, audit and export gates now pass. A signed EAS preview still needs the owner's Expo account, real EAS project ID, Apple/Google credentials and deployed API. Test that binary on physical devices before store submission.

### Additional confirmed implementation gaps

- Verify and finish durable substitution/skip lineage in the workout session and activity persistence path. Preserve the original planned exercise, performed replacement, skip/substitution reason, and completion state through finish, reload and history review; the current tracking does not provide a complete reliable history of these decisions. Do not market that history as complete until covered by integration tests.
- `FormTipsCarousel` currently supplies generic mocked cues rather than reviewed variation-specific instructions. Replace them with validated content, including equipment setup and safety cues appropriate to each movement, before presenting them as personalized form coaching.

## Release sequence after the gates are closed

### Verification from this UI pass

- The full repository suite passes: 169 tests, 0 failures.
- Expo Doctor passes all 21 checks and `expo install --check` reports SDK-compatible dependencies.
- Online app and backend dependency audits report 0 known vulnerabilities.
- Final iOS, Android and web exports completed successfully. These are JavaScript/asset bundles, not signed native applications.
- Replacing the opaque anatomy PNGs with visually verified high-quality JPEGs reduced the all-platform export from about 349 MB to about 110 MB and reduced checked-out application assets from about 370 MB to about 79 MB.
- Live desktop web preview checked Home, Profile, Edit Profile, Calendar and Exercise Library using a temporary in-memory test account, not the owner's data. Mobile viewport automation was unavailable in this run; small-device, large-text and native safe-area checks remain required.
- White-shirt home coach derivative verified as an RGBA PNG and bottom-aligned over the purple hero banner; the opaque generated draft remains only as its source artifact.
- Temporary export folders were cleaned after validation because available disk space was critically low. Free additional disk space before native builds.

These commands are instructions for an authorized release operator; none were run as remote actions in this pass.

1. Rotate the exposed MongoDB password and JWT secret, then log into the owner’s Expo account and link the approved project with EAS CLI.
2. Configure preview and production environment variables in EAS; use a separate staging backend for preview where practical.
3. Run `npx expo-doctor` and `npx expo install --check`; run the application's tests, then native exports and on-device checks.
4. Run `npx eas-cli@latest build --platform android --profile preview` for internal Android testing. Use a registered iOS device with the preview profile or a production build for TestFlight.
5. After release approval, run `npx eas-cli@latest build --platform all --profile production`. This consumes EAS build capacity and requires credentials.
6. Submit the verified build through the owner’s store accounts, starting with internal testing/TestFlight. Finish store metadata and review questionnaires before requesting public release. EAS submission is a separate step; building does not publish the app.

Reference: [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/), [EAS configuration](https://docs.expo.dev/build/eas-json/).
