
import { MotionType } from './types';

export const CATEGORIES = [
  { id: 'projectile', title: 'Projectile Motion', icon: '🎯' },
  { id: 'free_fall', title: 'Free Fall', icon: '🪂' },
  { id: 'newton_second_law', title: 'Newton\'s Laws', icon: '⚖️' },
  { id: 'spring', title: 'Spring Oscillation', icon: '🌀' },
  { id: 'inclined_plane', title: 'Inclined Plane', icon: '📐' },
];

export const PLACEHOLDERS: Record<string, string[]> = {
  projectile: [
    "A human throws a ball at 45° with 20 m/s from ground level",
    "A stone is launched from a 10m cliff at 30°",
    "A cannon fires a projectile with 50 m/s"
  ],
  free_fall: [
    "A ball drops from a 15m tower",
    "A stone falls from a 50m building",
    "An object is dropped from a bridge"
  ],
  inclined_plane: [
    "A 10kg crate is pushed up a 20° incline with 100N force",
    "A 2kg block slides down a 30° incline with friction",
    "A box slides without friction on a 45° ramp"
  ],
  spring: [
    "A 1kg mass attached to a spring (k=500 N/m) oscillates",
    "A spring stretched 0.2m and released",
    "Oscillate a block with mass 0.5kg on a k=200 spring"
  ],
  newton_second_law: [
    "A 5kg object experiences 20N force",
    "Two forces act on a 10kg block",
    "Net force of 50N applied to 25kg object"
  ]
};

export const DEFAULT_PARAMS: Record<MotionType, any> = {
  projectile: { initial_velocity: 20, angle: 45, initial_height: 0, gravity: 9.81, mass: 1, object: 'ball' },
  free_fall: { initial_velocity: 0, angle: 0, initial_height: 50, gravity: 9.81, mass: 1, object: 'stone' },
  vertical_throw: { initial_velocity: 15, angle: 90, initial_height: 1, gravity: 9.81, mass: 1, object: 'ball' },
  newton_second_law: { force: 50, mass: 5, initial_velocity: 0, gravity: 9.81, object: 'block' },
  spring: { mass: 1, spring_k: 200, initial_height: 0, initial_velocity: 0, gravity: 9.81, object: 'block' },
  inclined_plane: { angle: 20, mass: 10, friction: 0.1, force: 100, gravity: 9.81, object: 'crate' },
};
