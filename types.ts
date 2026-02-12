
export type MotionType = 'projectile' | 'free_fall' | 'vertical_throw' | 'newton_second_law' | 'spring' | 'inclined_plane';

export interface PhysicsParams {
  actor?: 'human' | 'cannon' | 'none';
  object: 'ball' | 'block' | 'crate' | 'stone' | 'box';
  motion_type: MotionType;
  initial_velocity: number;
  angle: number;
  initial_height: number;
  mass: number;
  gravity: number;
  force?: number;
  friction?: number;
  spring_k?: number;
  location_name?: string;
  environment_context?: 'tower' | 'cliff' | 'bridge' | 'standard' | 'moon';
}

export interface SimulationState {
  time: number;
  posX: number;
  posY: number;
  velX: number;
  velY: number;
  accX: number;
  accY: number;
  isCompleted: boolean;
  history: { t: number; x: number; y: number; vx: number; vy: number; ax: number; ay: number }[];
}

export enum LocationGravity {
  EARTH = 9.81,
  MOON = 1.62,
  MARS = 3.71,
  JUPITER = 24.79,
}
