# LiftSutra — selected application identity

LiftSutra was selected by the user. The application display name, shared header logo, auth/onboarding branding, loading artwork, web title/favicon and launcher icon now use this identity. The project slug and persistence identifiers are unchanged. Store listings have not been published; trademark/domain clearance remains outstanding.

## Selected assets

- `assets/branding/liftsutra-lockup.png`: unchanged approved artwork from `output/branding-v2/03-liftsutra.png`.
- `assets/branding/liftsutra-icon.png`: 1024px symbol-only launcher derivative, also used alongside the live wordmark in compact headers.
- `assets/branding/liftsutra-favicon.png`: 64px web icon.
- `assets/branding/liftsutra-adaptive.png`: 1024px transparent Android foreground with safe margins, separately generated and alpha verified. Built-in edit prompt: “Use case: background-extraction. Edit this exact approved LiftSutra app icon. Remove only the white background to genuine alpha transparency. Preserve the purple arm and charcoal dumbbell exactly, geometry and colors unchanged. Keep the existing square canvas and existing generous clear padding (symbol central 60%). No text, no white rectangle, no checkerboard pixels, no shadow. Deliver transparent PNG foreground for Android adaptive app icon.”
- `app/components/BrandLogo.js`: shared accessible identity component; existing purple/ink theme retained.

The symbol derivative was prepared with the built-in image-generation tool and visually checked. Prompt: “Use case: precise-object-edit. Edit target: approved LiftSutra logo in the reference. Create a 1024x1024 app launcher icon. Remove ONLY the LiftSutra lettering and preserve the exact purple bent arm gripping charcoal dumbbell symbol, its geometry, orientation and colors unchanged. Center the symbol on solid pure white background, with entire symbol inside central 60% of the square (safe padding for Android circular icon masks). Flat crisp logo, no redesign, no new shapes, no text, no shadows, no rounded outer frame. Output one square icon.” Generated output was mechanically resized to the required icon dimensions.

Native launcher changes require a fresh build/install. Existing Expo development servers may need restarting to refresh cached app metadata. The native pre-JavaScript splash has not been separately customized; the branded loading artwork is in the application itself. Original proposals below are historical, superseded by this selection.

## Brand purpose

Help people walk into a gym knowing which movement to do, how to use the equipment, and what comes next. The identity should feel capable, welcoming and precise, not aggressive or like a generic AI assistant.

Keep the existing purple (#7C4DFF), near-black (#1E1E22), white and cool-grey surfaces. Use a flat, memorable mark that works at 24px and in one colour. Avoid muscle mascots, sparks, glossy gradients, tiny anatomical details and stock dumbbell badges.

## Six proposals

| Name | Meaning and positioning | Logo/image direction |
| --- | --- | --- |
| **Formnook** | An approachable place to learn good exercise form. Best if beginner guidance leads the product. | 01: One continuous angular path forming an F. Solid purple mark, black wordmark, wide clear space. |
| **RepTula** | A coined name intended to evoke balanced, controlled repetitions. Short and friendly. | 02: Two balanced arcs around a single point, suggesting control and range of motion. |
| **LiftSutra** | Lifting knowledge presented as a connected, step-by-step guide. More culturally distinctive; test associations with the intended audience. | 03: A simple thread-like L with one upward turn. No religious symbol or ornamental lettering. |
| **Kineloft** | Movement plus an uplifting training space. Broad enough for strength, warm-up and mobility. | 04: Two linked, rounded chevrons indicating the next movement. Confident but not aggressive. |
| **GymWaymark** | The most explicit promise: a guide through exercises and gym equipment. Less compact, but easy to understand. | 05: A solid wayfinding mark with rising bars and a directional notch. No map-pin cliché. |
| **RepTandem** | Training with a knowledgeable companion, one set at a time. | 06: Two parallel bent strokes moving together, readable as a compact companion monogram. |

My preferred directions are **Formnook + 01** for a welcoming guidance-first product, or **RepTula + 02** for a shorter, more distinctive brand. Names and marks can be mixed; choose a name for its meaning, not because a draft drawing happens to fit it.

## Research and limits

Reviewed [Hevy's official press/brand page](https://www.hevyapp.com/press/) and [Strong's official product identity](https://www.strong.app/) as market references, not assets to copy. The proposed visual approach is an original design judgment.

Preliminary web searches rejected several obvious alternatives: [RepRoute](https://reprouteapp.com/), [LiftCue](https://apps.apple.com/br/app/liftcue-0f021c/id6792940755), and [Setlume](https://setlume.com/) already identify fitness products. Searches are incomplete and absence of a result is not proof of availability for the six proposals above.

## Next step after approval

Develop the selected mark as a flat vector master; check silhouette at 24/48px, monochrome and light/dark backgrounds. Produce the wordmark, square store icon, Android adaptive foreground/background and splash assets. Rename display text only after approval; choose permanent iOS/Android identifiers before the first store submission. Do not put the draft six-mark presentation sheet in the application.

## Home and onboarding imagery

The homepage uses the approved generated coach in a white shirt, holding a dumbbell and giving a thumbs-up. The generated draft painted its transparency checkerboard, so its subject was extracted and edge-refined into `assets/images/home/training-coach-white.png`. The installed 1183×1024 PNG has genuine alpha, uses contain sizing, and is anchored to the bottom edge of the purple banner.

Onboarding goals and gender use clear icons; body-shape choices use readable labels instead of defective assets with adjacent limbs or baked checkerboards. Existing files are retained, but those defective illustrations are no longer displayed there.
