const { getDefaultVariation } = require('./exerciseVariations');

const MALE_EXERCISE_DEMONSTRATIONS = Object.freeze({
  'abs-1--reverse': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/abs-1--reverse/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/abs-1--reverse/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/abs-1--reverse/male-finish.jpg'),
  }),
  'abs-1--stability-ball': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/abs-1--stability-ball/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/abs-1--stability-ball/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/abs-1--stability-ball/male-finish.jpg'),
  }),
  'abs-1--standard': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/abs-1--standard/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/abs-1--standard/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/abs-1--standard/male-finish.jpg'),
  }),
  'abs-1--weighted': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/abs-1--weighted/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/abs-1--weighted/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/abs-1--weighted/male-finish.jpg'),
  }),
  'abs-2--forearm': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/abs-2--forearm/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/abs-2--forearm/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/abs-2--forearm/male-finish.jpg'),
  }),
  'abs-2--high': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/abs-2--high/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/abs-2--high/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/abs-2--high/male-finish.jpg'),
  }),
  'abs-2--long-lever': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/abs-2--long-lever/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/abs-2--long-lever/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/abs-2--long-lever/male-finish.jpg'),
  }),
  'abs-2--side': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/abs-2--side/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/abs-2--side/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/abs-2--side/male-finish.jpg'),
  }),
  'abs-3--bent-knee-pelvic-curl': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/abs-3--bent-knee-pelvic-curl/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/abs-3--bent-knee-pelvic-curl/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/abs-3--bent-knee-pelvic-curl/male-finish.jpg'),
  }),
  'abs-3--captains-chair': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/abs-3--captains-chair/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/abs-3--captains-chair/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/abs-3--captains-chair/male-finish.jpg'),
  }),
  'abs-3--straight-leg': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/abs-3--straight-leg/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/abs-3--straight-leg/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/abs-3--straight-leg/male-finish.jpg'),
  }),
  'abs-3--toes-to-bar': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/abs-3--toes-to-bar/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/abs-3--toes-to-bar/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/abs-3--toes-to-bar/male-finish.jpg'),
  }),
  'abs-4--cable-rotation': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/abs-4--cable-rotation/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/abs-4--cable-rotation/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/abs-4--cable-rotation/male-finish.jpg'),
  }),
  'abs-4--feet-down': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/abs-4--feet-down/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/abs-4--feet-down/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/abs-4--feet-down/male-finish.jpg'),
  }),
  'abs-4--feet-up': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/abs-4--feet-up/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/abs-4--feet-up/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/abs-4--feet-up/male-finish.jpg'),
  }),
  'abs-4--medicine-ball': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/abs-4--medicine-ball/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/abs-4--medicine-ball/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/abs-4--medicine-ball/male-finish.jpg'),
  }),
  'abs-5--kneeling-rope': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/abs-5--kneeling-rope/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/abs-5--kneeling-rope/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/abs-5--kneeling-rope/male-finish.jpg'),
  }),
  'abs-5--machine': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/abs-5--machine/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/abs-5--machine/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/abs-5--machine/male-finish.jpg'),
  }),
  'abs-5--single-side': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/abs-5--single-side/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/abs-5--single-side/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/abs-5--single-side/male-finish.jpg'),
  }),
  'abs-5--standing': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/abs-5--standing/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/abs-5--standing/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/abs-5--standing/male-finish.jpg'),
  }),
  'arms-1--ez-bar': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-1--ez-bar/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-1--ez-bar/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-1--ez-bar/male-finish.jpg'),
  }),
  'arms-1--medium-grip': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-1--medium-grip/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-1--medium-grip/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-1--medium-grip/male-finish.jpg'),
  }),
  'arms-1--reverse-grip': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-1--reverse-grip/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-1--reverse-grip/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-1--reverse-grip/male-finish.jpg'),
  }),
  'arms-1--strict-wall': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-1--strict-wall/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-1--strict-wall/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-1--strict-wall/male-finish.jpg'),
  }),
  'arms-2--reverse-grip': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-2--reverse-grip/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-2--reverse-grip/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-2--reverse-grip/male-finish.jpg'),
  }),
  'arms-2--rope': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-2--rope/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-2--rope/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-2--rope/male-finish.jpg'),
  }),
  'arms-2--single-arm': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-2--single-arm/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-2--single-arm/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-2--single-arm/male-finish.jpg'),
  }),
  'arms-2--straight-bar': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-2--straight-bar/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-2--straight-bar/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-2--straight-bar/male-finish.jpg'),
  }),
  'arms-3--cross-body': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-3--cross-body/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-3--cross-body/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-3--cross-body/male-finish.jpg'),
  }),
  'arms-3--incline': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-3--incline/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-3--incline/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-3--incline/male-finish.jpg'),
  }),
  'arms-3--rope-cable': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-3--rope-cable/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-3--rope-cable/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-3--rope-cable/male-finish.jpg'),
  }),
  'arms-3--standard': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-3--standard/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-3--standard/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-3--standard/male-finish.jpg'),
  }),
  'arms-4--rope-cable': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-4--rope-cable/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-4--rope-cable/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-4--rope-cable/male-finish.jpg'),
  }),
  'arms-4--seated-ez': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-4--seated-ez/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-4--seated-ez/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-4--seated-ez/male-finish.jpg'),
  }),
  'arms-4--single-arm': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-4--single-arm/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-4--single-arm/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-4--single-arm/male-finish.jpg'),
  }),
  'arms-4--two-hand-dumbbell': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-4--two-hand-dumbbell/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-4--two-hand-dumbbell/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-4--two-hand-dumbbell/male-finish.jpg'),
  }),
  'arms-5--cable': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-5--cable/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-5--cable/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-5--cable/male-finish.jpg'),
  }),
  'arms-5--seated': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-5--seated/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-5--seated/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-5--seated/male-finish.jpg'),
  }),
  'arms-5--standing': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-5--standing/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-5--standing/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-5--standing/male-finish.jpg'),
  }),
  'arms-5--supinating': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-5--supinating/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-5--supinating/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-5--supinating/male-finish.jpg'),
  }),
  'arms-6--behind-head': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-6--behind-head/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-6--behind-head/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-6--behind-head/male-finish.jpg'),
  }),
  'arms-6--cable': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-6--cable/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-6--cable/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-6--cable/male-finish.jpg'),
  }),
  'arms-6--dumbbell-neutral': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-6--dumbbell-neutral/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-6--dumbbell-neutral/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-6--dumbbell-neutral/male-finish.jpg'),
  }),
  'arms-6--ez-bar-forehead': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/arms-6--ez-bar-forehead/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/arms-6--ez-bar-forehead/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/arms-6--ez-bar-forehead/male-finish.jpg'),
  }),
  'back-1--assisted': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-1--assisted/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-1--assisted/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-1--assisted/male-finish.jpg'),
  }),
  'back-1--chin-up': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-1--chin-up/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-1--chin-up/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-1--chin-up/male-finish.jpg'),
  }),
  'back-1--neutral-grip': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-1--neutral-grip/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-1--neutral-grip/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-1--neutral-grip/male-finish.jpg'),
  }),
  'back-1--pronated': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-1--pronated/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-1--pronated/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-1--pronated/male-finish.jpg'),
  }),
  'back-2--close-neutral': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-2--close-neutral/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-2--close-neutral/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-2--close-neutral/male-finish.jpg'),
  }),
  'back-2--medium-pronated': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-2--medium-pronated/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-2--medium-pronated/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-2--medium-pronated/male-finish.jpg'),
  }),
  'back-2--single-arm': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-2--single-arm/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-2--single-arm/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-2--single-arm/male-finish.jpg'),
  }),
  'back-2--underhand': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-2--underhand/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-2--underhand/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-2--underhand/male-finish.jpg'),
  }),
  'back-3--pendlay': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-3--pendlay/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-3--pendlay/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-3--pendlay/male-finish.jpg'),
  }),
  'back-3--pronated': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-3--pronated/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-3--pronated/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-3--pronated/male-finish.jpg'),
  }),
  'back-3--underhand': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-3--underhand/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-3--underhand/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-3--underhand/male-finish.jpg'),
  }),
  'back-3--wide-grip': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-3--wide-grip/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-3--wide-grip/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-3--wide-grip/male-finish.jpg'),
  }),
  'back-4--close-neutral': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-4--close-neutral/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-4--close-neutral/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-4--close-neutral/male-finish.jpg'),
  }),
  'back-4--high-row': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-4--high-row/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-4--high-row/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-4--high-row/male-finish.jpg'),
  }),
  'back-4--single-arm': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-4--single-arm/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-4--single-arm/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-4--single-arm/male-finish.jpg'),
  }),
  'back-4--wide-pronated': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-4--wide-pronated/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-4--wide-pronated/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-4--wide-pronated/male-finish.jpg'),
  }),
  'back-5--chest-supported': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-5--chest-supported/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-5--chest-supported/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-5--chest-supported/male-finish.jpg'),
  }),
  'back-5--dead-stop': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-5--dead-stop/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-5--dead-stop/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-5--dead-stop/male-finish.jpg'),
  }),
  'back-5--elbow-out': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-5--elbow-out/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-5--elbow-out/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-5--elbow-out/male-finish.jpg'),
  }),
  'back-5--elbow-to-hip': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-5--elbow-to-hip/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-5--elbow-to-hip/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-5--elbow-to-hip/male-finish.jpg'),
  }),
  'back-6--chest-supported': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-6--chest-supported/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-6--chest-supported/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-6--chest-supported/male-finish.jpg'),
  }),
  'back-6--close-neutral': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-6--close-neutral/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-6--close-neutral/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-6--close-neutral/male-finish.jpg'),
  }),
  'back-6--single-arm-landmine': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-6--single-arm-landmine/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-6--single-arm-landmine/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-6--single-arm-landmine/male-finish.jpg'),
  }),
  'back-6--wide-pronated': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/back-6--wide-pronated/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/back-6--wide-pronated/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/back-6--wide-pronated/male-finish.jpg'),
  }),
  'chest-1--close-grip': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-1--close-grip/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-1--close-grip/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-1--close-grip/male-finish.jpg'),
  }),
  'chest-1--decline': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-1--decline/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-1--decline/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-1--decline/male-finish.jpg'),
  }),
  'chest-1--flat-medium-grip': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-1--flat-medium-grip/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-1--flat-medium-grip/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-1--flat-medium-grip/male-finish.jpg'),
  }),
  'chest-1--incline-30': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-1--incline-30/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-1--incline-30/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-1--incline-30/male-finish.jpg'),
  }),
  'chest-2--incline-30': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-2--incline-30/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-2--incline-30/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-2--incline-30/male-finish.jpg'),
  }),
  'chest-2--low-incline-15': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-2--low-incline-15/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-2--low-incline-15/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-2--low-incline-15/male-finish.jpg'),
  }),
  'chest-2--neutral-grip': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-2--neutral-grip/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-2--neutral-grip/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-2--neutral-grip/male-finish.jpg'),
  }),
  'chest-2--single-arm': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-2--single-arm/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-2--single-arm/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-2--single-arm/male-finish.jpg'),
  }),
  'chest-3--decline': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-3--decline/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-3--decline/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-3--decline/male-finish.jpg'),
  }),
  'chest-3--diamond': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-3--diamond/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-3--diamond/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-3--diamond/male-finish.jpg'),
  }),
  'chest-3--incline': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-3--incline/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-3--incline/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-3--incline/male-finish.jpg'),
  }),
  'chest-3--standard': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-3--standard/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-3--standard/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-3--standard/male-finish.jpg'),
  }),
  'chest-4--high-to-low': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-4--high-to-low/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-4--high-to-low/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-4--high-to-low/male-finish.jpg'),
  }),
  'chest-4--low-to-high': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-4--low-to-high/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-4--low-to-high/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-4--low-to-high/male-finish.jpg'),
  }),
  'chest-4--midline': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-4--midline/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-4--midline/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-4--midline/male-finish.jpg'),
  }),
  'chest-4--single-arm': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-4--single-arm/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-4--single-arm/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-4--single-arm/male-finish.jpg'),
  }),
  'chest-5--assisted': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-5--assisted/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-5--assisted/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-5--assisted/male-finish.jpg'),
  }),
  'chest-5--forward-lean': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-5--forward-lean/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-5--forward-lean/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-5--forward-lean/male-finish.jpg'),
  }),
  'chest-5--upright': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-5--upright/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-5--upright/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-5--upright/male-finish.jpg'),
  }),
  'chest-5--weighted': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-5--weighted/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-5--weighted/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-5--weighted/male-finish.jpg'),
  }),
  'chest-6--low-seat': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-6--low-seat/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-6--low-seat/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-6--low-seat/male-finish.jpg'),
  }),
  'chest-6--paused': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-6--paused/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-6--paused/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-6--paused/male-finish.jpg'),
  }),
  'chest-6--single-arm': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-6--single-arm/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-6--single-arm/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-6--single-arm/male-finish.jpg'),
  }),
  'chest-6--standard': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/chest-6--standard/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/chest-6--standard/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/chest-6--standard/male-finish.jpg'),
  }),
  'glutes-1--b-stance': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/glutes-1--b-stance/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/glutes-1--b-stance/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/glutes-1--b-stance/male-finish.jpg'),
  }),
  'glutes-1--barbell': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/glutes-1--barbell/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/glutes-1--barbell/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/glutes-1--barbell/male-finish.jpg'),
  }),
  'glutes-1--machine': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/glutes-1--machine/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/glutes-1--machine/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/glutes-1--machine/male-finish.jpg'),
  }),
  'glutes-1--single-leg': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/glutes-1--single-leg/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/glutes-1--single-leg/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/glutes-1--single-leg/male-finish.jpg'),
  }),
  'glutes-2--bent-knee-cable': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/glutes-2--bent-knee-cable/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/glutes-2--bent-knee-cable/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/glutes-2--bent-knee-cable/male-finish.jpg'),
  }),
  'glutes-2--diagonal': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/glutes-2--diagonal/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/glutes-2--diagonal/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/glutes-2--diagonal/male-finish.jpg'),
  }),
  'glutes-2--machine': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/glutes-2--machine/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/glutes-2--machine/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/glutes-2--machine/male-finish.jpg'),
  }),
  'glutes-2--straight-leg-cable': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/glutes-2--straight-leg-cable/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/glutes-2--straight-leg-cable/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/glutes-2--straight-leg-cable/male-finish.jpg'),
  }),
  'glutes-3--balanced': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/glutes-3--balanced/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/glutes-3--balanced/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/glutes-3--balanced/male-finish.jpg'),
  }),
  'glutes-3--heel-elevated': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/glutes-3--heel-elevated/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/glutes-3--heel-elevated/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/glutes-3--heel-elevated/male-finish.jpg'),
  }),
  'glutes-3--long-stride': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/glutes-3--long-stride/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/glutes-3--long-stride/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/glutes-3--long-stride/male-finish.jpg'),
  }),
  'glutes-3--smith': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/glutes-3--smith/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/glutes-3--smith/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/glutes-3--smith/male-finish.jpg'),
  }),
  'glutes-4--deficit': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/glutes-4--deficit/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/glutes-4--deficit/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/glutes-4--deficit/male-finish.jpg'),
  }),
  'glutes-4--kettlebell': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/glutes-4--kettlebell/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/glutes-4--kettlebell/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/glutes-4--kettlebell/male-finish.jpg'),
  }),
  'glutes-4--moderate-stance': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/glutes-4--moderate-stance/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/glutes-4--moderate-stance/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/glutes-4--moderate-stance/male-finish.jpg'),
  }),
  'glutes-4--standard': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/glutes-4--standard/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/glutes-4--standard/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/glutes-4--standard/male-finish.jpg'),
  }),
  'glutes-5--band': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/glutes-5--band/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/glutes-5--band/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/glutes-5--band/male-finish.jpg'),
  }),
  'glutes-5--paused': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/glutes-5--paused/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/glutes-5--paused/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/glutes-5--paused/male-finish.jpg'),
  }),
  'glutes-5--rope': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/glutes-5--rope/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/glutes-5--rope/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/glutes-5--rope/male-finish.jpg'),
  }),
  'glutes-5--wide-stance': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/glutes-5--wide-stance/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/glutes-5--wide-stance/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/glutes-5--wide-stance/male-finish.jpg'),
  }),
  'legs-1--front': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-1--front/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-1--front/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-1--front/male-finish.jpg'),
  }),
  'legs-1--heel-elevated': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-1--heel-elevated/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-1--heel-elevated/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-1--heel-elevated/male-finish.jpg'),
  }),
  'legs-1--high-bar': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-1--high-bar/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-1--high-bar/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-1--high-bar/male-finish.jpg'),
  }),
  'legs-1--low-bar': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-1--low-bar/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-1--low-bar/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-1--low-bar/male-finish.jpg'),
  }),
  'legs-2--high-foot': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-2--high-foot/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-2--high-foot/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-2--high-foot/male-finish.jpg'),
  }),
  'legs-2--low-foot': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-2--low-foot/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-2--low-foot/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-2--low-foot/male-finish.jpg'),
  }),
  'legs-2--single-leg': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-2--single-leg/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-2--single-leg/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-2--single-leg/male-finish.jpg'),
  }),
  'legs-2--standard': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-2--standard/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-2--standard/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-2--standard/male-finish.jpg'),
  }),
  'legs-3--b-stance': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-3--b-stance/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-3--b-stance/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-3--b-stance/male-finish.jpg'),
  }),
  'legs-3--barbell': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-3--barbell/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-3--barbell/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-3--barbell/male-finish.jpg'),
  }),
  'legs-3--dumbbell': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-3--dumbbell/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-3--dumbbell/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-3--dumbbell/male-finish.jpg'),
  }),
  'legs-3--single-leg': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-3--single-leg/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-3--single-leg/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-3--single-leg/male-finish.jpg'),
  }),
  'legs-4--bilateral': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-4--bilateral/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-4--bilateral/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-4--bilateral/male-finish.jpg'),
  }),
  'legs-4--paused': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-4--paused/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-4--paused/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-4--paused/male-finish.jpg'),
  }),
  'legs-4--reclined': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-4--reclined/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-4--reclined/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-4--reclined/male-finish.jpg'),
  }),
  'legs-4--single-leg': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-4--single-leg/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-4--single-leg/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-4--single-leg/male-finish.jpg'),
  }),
  'legs-5--lying': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-5--lying/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-5--lying/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-5--lying/male-finish.jpg'),
  }),
  'legs-5--seated': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-5--seated/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-5--seated/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-5--seated/male-finish.jpg'),
  }),
  'legs-5--slider': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-5--slider/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-5--slider/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-5--slider/male-finish.jpg'),
  }),
  'legs-5--standing-single-leg': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-5--standing-single-leg/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-5--standing-single-leg/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-5--standing-single-leg/male-finish.jpg'),
  }),
  'legs-6--leg-press': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-6--leg-press/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-6--leg-press/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-6--leg-press/male-finish.jpg'),
  }),
  'legs-6--seated': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-6--seated/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-6--seated/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-6--seated/male-finish.jpg'),
  }),
  'legs-6--single-leg': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-6--single-leg/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-6--single-leg/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-6--single-leg/male-finish.jpg'),
  }),
  'legs-6--standing': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/legs-6--standing/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/legs-6--standing/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/legs-6--standing/male-finish.jpg'),
  }),
  'shoulder-1--neutral-grip': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-1--neutral-grip/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-1--neutral-grip/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-1--neutral-grip/male-finish.jpg'),
  }),
  'shoulder-1--seated-dumbbell': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-1--seated-dumbbell/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-1--seated-dumbbell/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-1--seated-dumbbell/male-finish.jpg'),
  }),
  'shoulder-1--single-arm-landmine': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-1--single-arm-landmine/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-1--single-arm-landmine/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-1--single-arm-landmine/male-finish.jpg'),
  }),
  'shoulder-1--standing-barbell': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-1--standing-barbell/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-1--standing-barbell/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-1--standing-barbell/male-finish.jpg'),
  }),
  'shoulder-2--behind-body-cable': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-2--behind-body-cable/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-2--behind-body-cable/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-2--behind-body-cable/male-finish.jpg'),
  }),
  'shoulder-2--cable': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-2--cable/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-2--cable/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-2--cable/male-finish.jpg'),
  }),
  'shoulder-2--machine': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-2--machine/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-2--machine/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-2--machine/male-finish.jpg'),
  }),
  'shoulder-2--standing': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-2--standing/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-2--standing/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-2--standing/male-finish.jpg'),
  }),
  'shoulder-3--alternating': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-3--alternating/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-3--alternating/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-3--alternating/male-finish.jpg'),
  }),
  'shoulder-3--cable': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-3--cable/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-3--cable/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-3--cable/male-finish.jpg'),
  }),
  'shoulder-3--neutral-grip': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-3--neutral-grip/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-3--neutral-grip/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-3--neutral-grip/male-finish.jpg'),
  }),
  'shoulder-3--plate': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-3--plate/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-3--plate/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-3--plate/male-finish.jpg'),
  }),
  'shoulder-4--cable-reverse-fly': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-4--cable-reverse-fly/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-4--cable-reverse-fly/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-4--cable-reverse-fly/male-finish.jpg'),
  }),
  'shoulder-4--high-elbow': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-4--high-elbow/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-4--high-elbow/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-4--high-elbow/male-finish.jpg'),
  }),
  'shoulder-4--single-arm': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-4--single-arm/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-4--single-arm/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-4--single-arm/male-finish.jpg'),
  }),
  'shoulder-4--standard': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-4--standard/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-4--standard/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-4--standard/male-finish.jpg'),
  }),
  'shoulder-5--alternating': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-5--alternating/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-5--alternating/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-5--alternating/male-finish.jpg'),
  }),
  'shoulder-5--seated': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-5--seated/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-5--seated/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-5--seated/male-finish.jpg'),
  }),
  'shoulder-5--single-arm': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-5--single-arm/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-5--single-arm/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-5--single-arm/male-finish.jpg'),
  }),
  'shoulder-5--standing': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-5--standing/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-5--standing/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-5--standing/male-finish.jpg'),
  }),
  'shoulder-6--banded': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-6--banded/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-6--banded/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-6--banded/male-finish.jpg'),
  }),
  'shoulder-6--external-rotation': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-6--external-rotation/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-6--external-rotation/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-6--external-rotation/male-finish.jpg'),
  }),
  'shoulder-6--rope-forehead': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-6--rope-forehead/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-6--rope-forehead/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-6--rope-forehead/male-finish.jpg'),
  }),
  'shoulder-6--seated': Object.freeze({
    thumbnail: require('../../assets/images/exercises/demonstrations/shoulder-6--seated/male-thumbnail.jpg'),
    start: require('../../assets/images/exercises/demonstrations/shoulder-6--seated/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/shoulder-6--seated/male-finish.jpg'),
  }),
});

const normalizeGender = (gender) => String(gender || 'male').trim().toLowerCase();

const getDefaultExerciseDemonstration = (familyId, gender = 'male') => {
  if (normalizeGender(gender) !== 'male') return null;
  const defaultVariation = getDefaultVariation(familyId);
  return defaultVariation
    ? MALE_EXERCISE_DEMONSTRATIONS[defaultVariation.id] || null
    : null;
};

const resolveExerciseDemonstration = (variationId, familyId, gender = 'male') => {
  if (normalizeGender(gender) !== 'male') return null;
  if (MALE_EXERCISE_DEMONSTRATIONS[variationId]) {
    return MALE_EXERCISE_DEMONSTRATIONS[variationId];
  }

  return getDefaultExerciseDemonstration(familyId || variationId, gender);
};

module.exports = {
  MALE_EXERCISE_DEMONSTRATIONS,
  getDefaultExerciseDemonstration,
  resolveExerciseDemonstration,
};
