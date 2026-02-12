
import { PhysicsParams, MotionType } from '../types';
import { DEFAULT_PARAMS } from '../constants';

export const parsePhysicsPrompt = (text: string, category: MotionType): PhysicsParams => {
  const lowercaseText = text.toLowerCase();
  let params: PhysicsParams = { ...DEFAULT_PARAMS[category], motion_type: category };

  // Detect Actor
  if (lowercaseText.includes('human') || lowercaseText.includes('man') || lowercaseText.includes('person')) {
    params.actor = 'human';
  } else if (lowercaseText.includes('cannon')) {
    params.actor = 'cannon';
  }

  // Detect Object
  if (lowercaseText.includes('ball')) params.object = 'ball';
  else if (lowercaseText.includes('crate')) params.object = 'crate';
  else if (lowercaseText.includes('block')) params.object = 'block';
  else if (lowercaseText.includes('stone')) params.object = 'stone';

  // Extract Numbers with context
  const velocityMatch = lowercaseText.match(/(\d+(\.\d+)?)\s*(m\/s|velocity|speed)/);
  if (velocityMatch) params.initial_velocity = parseFloat(velocityMatch[1]);

  const angleMatch = lowercaseText.match(/(\d+(\.\d+)?)\s*(degree|°|angle)/);
  if (angleMatch) params.angle = parseFloat(angleMatch[1]);

  const heightMatch = lowercaseText.match(/(\d+(\.\d+)?)\s*(m|meter|height|tall|high)/);
  if (heightMatch) params.initial_height = parseFloat(heightMatch[1]);

  const massMatch = lowercaseText.match(/(\d+(\.\d+)?)\s*(kg|mass)/);
  if (massMatch) params.mass = parseFloat(massMatch[1]);

  const forceMatch = lowercaseText.match(/(\d+(\.\d+)?)\s*(n|newton|force)/);
  if (forceMatch) params.force = parseFloat(forceMatch[1]);

  const springKMatch = lowercaseText.match(/k\s*=\s*(\d+(\.\d+)?)/);
  if (springKMatch) params.spring_k = parseFloat(springKMatch[1]);

  // Detect Environment Context
  if (lowercaseText.includes('moon')) {
    params.gravity = 1.62;
    params.environment_context = 'moon';
  } else if (lowercaseText.includes('mars')) {
    params.gravity = 3.71;
  } else if (lowercaseText.includes('jupiter')) {
    params.gravity = 24.79;
  } else if (lowercaseText.includes('tower') || lowercaseText.includes('building') || lowercaseText.includes('eiffel') || (category === 'free_fall' && params.initial_height > 10)) {
    params.environment_context = 'tower';
  } else if (lowercaseText.includes('cliff')) {
    params.environment_context = 'cliff';
  } else if (lowercaseText.includes('bridge')) {
    params.environment_context = 'bridge';
  } else if (params.initial_height > 0) {
    // Default to a platform if height is present but no specific context is mentioned
    params.environment_context = 'standard';
  }

  return params;
};
