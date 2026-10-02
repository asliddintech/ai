import { VIDEO_MODELS } from '../data/modelPresets';

/**
 * Compiles a structured scene object into a cohesive, high-impact prompt
 */
export function compileScenePrompt(scene, modelId = 'generic') {
  if (!scene) return '';

  const modelPreset = VIDEO_MODELS.find(m => m.id === modelId) || VIDEO_MODELS.find(m => m.id === 'generic');
  
  if (modelPreset && typeof modelPreset.optimize === 'function') {
    return modelPreset.optimize(scene.prompt || '', scene);
  }

  // Fallback universal systematic prompt
  const parts = [];
  if (scene.description) parts.push(scene.description);
  if (scene.subject) parts.push(`Subject: ${scene.subject}`);
  if (scene.environment) parts.push(`Environment: ${scene.environment}`);
  if (scene.camera) parts.push(`Camera: ${scene.camera}`);
  if (scene.lens) parts.push(`Lens: ${scene.lens}`);
  if (scene.composition) parts.push(`Composition: ${scene.composition}`);
  if (scene.lighting) parts.push(`Lighting: ${scene.lighting}`);
  if (scene.color) parts.push(`Color: ${scene.color}`);
  if (scene.motion) parts.push(`Motion: ${scene.motion}`);
  if (scene.atmosphere) parts.push(`Atmosphere: ${scene.atmosphere}`);
  if (scene.effects) parts.push(`VFX: ${scene.effects}`);

  return parts.join('. ') + '.';
}

/**
 * Shortens a prompt into concise token-dense keywords
 */
export function shortenPrompt(fullPrompt) {
  if (!fullPrompt) return '';
  return fullPrompt
    .replace(/^(Photorealistic|Cinematic master shot:|A hyper-realistic cinematic continuous sequence\.)/i, '')
    .replace(/Subject:|Environment:|Camera:|Lens:|Composition:|Lighting:|Color:|Motion:|Atmosphere:|VFX:/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Expands a prompt with rich cinematography enhancement descriptors
 */
export function expandPrompt(scene, modelId = 'generic') {
  const base = compileScenePrompt(scene, modelId);
  return `${base} Filmed on Arri Alexa LF with Master Prime optics, shot at 24fps with organic 180-degree motion blur, true optical halation, Kodak Vision3 5219 35mm grain structure, professional Hollywood color grading, pristine volumetric lighting, zero artifacts.`;
}

/**
 * Parses a prompt into systematic token sections
 */
export function parsePromptBreakdown(scene) {
  return [
    { label: 'SCENE ACTION', value: scene.description, key: 'description' },
    { label: 'SUBJECT', value: scene.subject, key: 'subject' },
    { label: 'ENVIRONMENT', value: scene.environment, key: 'environment' },
    { label: 'CAMERA', value: scene.camera, key: 'camera' },
    { label: 'LENS', value: scene.lens, key: 'lens' },
    { label: 'LIGHTING', value: scene.lighting, key: 'lighting' },
    { label: 'MOTION', value: scene.motion, key: 'motion' },
    { label: 'ATMOSPHERE', value: scene.atmosphere, key: 'atmosphere' },
    { label: 'COLOR GRADE', value: scene.color, key: 'color' },
    { label: 'AUDIO DIRECTION', value: scene.audio, key: 'audio' },
    { label: 'NEGATIVE PROMPT', value: scene.negativePrompt, key: 'negativePrompt' }
  ];
}
