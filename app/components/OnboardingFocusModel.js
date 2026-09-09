import React from 'react';
import { View, Text, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { resolveExerciseAnatomyImage } from '../data/exerciseAnatomyImages';
import { radius } from '../theme/colors';
import { useAppTheme } from '../context/ThemeContext';
import useThemedStyles from '../theme/useThemedStyles';

// Coordinates follow the existing 849 x 926 neutral model canvases.
const FRONT = {
  Chest: 'M350 208 Q425 182 500 208 Q505 244 497 277 Q425 300 351 277 Q344 244 350 208 Z',
  Abs: 'M366 294 Q425 307 486 294 Q492 342 484 390 Q425 408 364 390 Q358 342 366 294 Z',
  Arms: 'M315 243 Q331 249 340 263 Q332 301 315 332 Q292 379 264 419 Q252 418 246 409 Q257 362 276 324 Q291 276 315 243 Z M535 243 Q519 249 510 263 Q518 301 535 332 Q558 379 586 419 Q598 418 604 409 Q593 362 574 324 Q559 276 535 243 Z',
  Legs: 'M343 565 Q375 561 408 568 Q402 626 390 680 Q379 750 368 820 Q355 826 347 820 Q339 770 340 712 Q344 674 354 645 Q348 606 343 565 Z M444 568 Q477 561 509 565 Q504 606 498 645 Q508 674 512 712 Q513 770 501 820 Q493 826 480 820 Q469 750 458 680 Q448 626 444 568 Z',
};
const BACK = {
  Back: 'M351 214 Q425 175 500 214 Q506 258 499 303 Q493 356 482 404 Q425 414 367 404 Q356 356 350 303 Q344 258 351 214 Z',
  Glutes: 'M355 433 Q425 412 495 433 Q507 470 505 510 Q466 543 427 517 Q389 543 346 510 Q344 470 355 433 Z',
  Arms: FRONT.Arms,
  Legs: FRONT.Legs,
};
const FEMALE_FRONT = {
  ...FRONT,
  Chest: 'M364 236 Q425 253 487 236 Q493 269 488 300 Q425 318 363 300 Q357 269 364 236 Z',
  Abs: 'M371 330 Q425 319 479 330 Q488 361 484 391 Q425 407 364 391 Q360 361 371 330 Z',
  Arms: 'M316 248 Q330 250 339 261 Q323 298 302 330 Q270 380 239 422 Q228 421 223 412 Q247 364 278 318 Q293 276 316 248 Z M534 248 Q520 250 511 261 Q527 298 548 330 Q580 380 611 422 Q622 421 627 412 Q603 364 572 318 Q557 276 534 248 Z',
  Legs: 'M341 546 Q376 540 411 546 Q405 618 394 691 Q384 774 375 855 Q362 861 353 855 Q340 790 340 713 Q344 674 353 641 Q347 594 341 546 Z M443 546 Q474 540 509 546 Q503 594 498 641 Q507 674 508 713 Q508 790 496 855 Q487 861 474 855 Q465 774 455 691 Q447 618 443 546 Z',
};
const FEMALE_BACK = { ...BACK, Arms: FEMALE_FRONT.Arms, Legs: FEMALE_FRONT.Legs };

export default function OnboardingFocusModel({ gender, selectedAreas }) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const female = String(gender).toLowerCase() === 'female';
  const fullBody = selectedAreas.includes('Full Body');
  return (
    <View style={styles.models}>
      {['front', 'back'].map((view) => {
        const regions = view === 'front' ? (female ? FEMALE_FRONT : FRONT) : (female ? FEMALE_BACK : BACK);
        return (
          <View key={view}>
            <View style={styles.canvas} accessible accessibilityRole="image" accessibilityLabel={`${view} body view. Selected areas: ${selectedAreas.join(', ') || 'none'}`}>
              <Image source={resolveExerciseAnatomyImage(null, gender, view)} style={styles.layer} resizeMode="contain" />
              <Svg pointerEvents="none" width="100%" height="100%" viewBox="0 0 849 926" style={styles.layer}>
                {Object.entries(regions).filter(([area]) => fullBody || selectedAreas.includes(area)).map(([area, d]) => (
                  <Path
                    key={area}
                    d={d}
                    fill={colors.danger}
                    fillOpacity={0.5}
                    stroke={colors.danger}
                    strokeOpacity={0.92}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
              </Svg>
            </View>
            <Text style={styles.label}>{view === 'front' ? 'Front' : 'Back'}</Text>
          </View>
        );
      })}
    </View>
  );
}

const createStyles = (colors) => ({
  models: { width: '100%', gap: 8 },
  canvas: {
    width: '100%',
    aspectRatio: 849 / 926,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderCurve: 'continuous',
  },
  layer: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: radius.card },
  label: { color: colors.textSecondary, fontSize: 12, textAlign: 'center', marginTop: 4 },
});
