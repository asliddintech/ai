import { compileScenePrompt } from '../utils/promptCompiler';
import { VIDEO_MODELS } from '../data/modelPresets';

/**
 * Intelligent Cinematic AI Engine Service
 * Provides clean abstraction layer for LLM providers (Gemini, OpenAI, Anthropic, or local server)
 */

export const AI_GENERATION_STEPS = [
  { id: 'analyze', label: 'ANALYZING IDEA', detail: 'Deconstructing core premise, narrative stakes, and aesthetic tone...' },
  { id: 'story', label: 'BUILDING STORY', detail: 'Constructing four-act narrative pacing and emotional arc...' },
  { id: 'scenes', label: 'DESIGNING SCENES', detail: 'Calculating shot coverage, blocking subjects, and environmental layers...' },
  { id: 'cinematography', label: 'GENERATING CINEMATOGRAPHY', detail: 'Assigning focal lengths, camera movement, volumetric lighting, and color grading...' },
  { id: 'optimize', label: 'OPTIMIZING PROMPTS', detail: 'Encoding tokens for target generative video model syntax...' }
];

export const aiService = {
  /**
   * Generates a complete project from a user idea and configuration
   * @param {Object} params - { idea, duration, aspectRatio, style, model, language, onProgress }
   */
  async generateProject(params) {
    const { idea, duration = '30 sec', aspectRatio = '16:9', style = 'Cinematic', model = 'veo', language = 'English', onProgress } = params;

    // Report progressive AI thought stages
    if (onProgress) onProgress({ stepIndex: 0, status: 'in-progress' });
    await delay(700);

    if (onProgress) onProgress({ stepIndex: 1, status: 'in-progress' });
    await delay(800);

    const concept = await this.generateConcept({ idea, style, language });

    if (onProgress) onProgress({ stepIndex: 2, status: 'in-progress' });
    await delay(900);

    const storyStructure = await this.generateStoryStructure({ idea, concept, duration });

    if (onProgress) onProgress({ stepIndex: 3, status: 'in-progress' });
    await delay(1000);

    const scenes = await this.generateScenes({ idea, concept, duration, model, style });

    if (onProgress) onProgress({ stepIndex: 4, status: 'in-progress' });
    await delay(700);

    if (onProgress) onProgress({ stepIndex: 5, status: 'done' });

    return {
      id: `proj-${Date.now()}`,
      title: concept.title,
      idea,
      duration,
      aspectRatio,
      style,
      model,
      language,
      status: 'Generated',
      concept,
      storyStructure,
      scenes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  /**
   * Generates creative concept details from user idea
   */
  async generateConcept({ idea, style = 'Cinematic', language = 'English' }) {
    // Detect keywords in idea for dynamic cinematic customization
    const lower = idea.toLowerCase();
    const isTashkent = lower.includes('tashkent') || lower.includes('samarkand') || lower.includes('uzbek');
    const isCyberpunk = lower.includes('cyber') || lower.includes('future') || lower.includes('ai') || lower.includes('neon') || lower.includes('robot');
    const isCar = lower.includes('car') || lower.includes('drive') || lower.includes('race') || lower.includes('speed');
    const isNature = lower.includes('nature') || lower.includes('mountain') || lower.includes('ocean') || lower.includes('forest');
    const isSpace = lower.includes('space') || lower.includes('astronaut') || lower.includes('planet') || lower.includes('star');

    let title = 'Cinematic Odyssey';
    let logline = `A cinematic exploration inspired by: "${idea}"`;
    let visualDirection = 'High-contrast cinematic lighting with deep photographic shadow detail and restrained color grading.';
    let mood = 'Contemplative, immersive, visually stunning.';
    let colorPalette = ['#080A10', '#1E293B', '#38BDF8', '#F59E0B', '#E2E8F0'];
    let styleTags = ['35mm Film', 'Volumetric Haze', 'Anamorphic Optics', '24fps Cadence'];

    if (isTashkent) {
      title = 'Silicon Oasis: Tashkent Horizon';
      logline = 'An AI engineer navigates the vibrant intersection of Central Asian heritage and futuristic cybernetic infrastructure beneath midnight skies.';
      visualDirection = 'Futuristic Silk Road aesthetics. Illuminated geometric Islamic arches fused with optical glass and cyan fiber optic pulses.';
      mood = 'Visionary, mysterious, culturally resonant, technologically majestic.';
      colorPalette = ['#050811', '#06B6D4', '#EAB308', '#6366F1', '#F8FAFC'];
      styleTags = ['Anamorphic 2.39:1', 'Cyan & Amber Dual Neon', 'Wet Asphalt Reflections', 'Kodak 5219 Print'];
    } else if (isCyberpunk) {
      title = 'Neural Protocol: Synthetic Dawn';
      logline = 'An operative uncovers an evolving synthetic consciousness hidden within the electrified spires of an ultra-dense metropolis.';
      visualDirection = 'Near-future cyberpunk realism. Heavy industrial rain, multi-tiered holographic advertisements, and steam-shrouded alleyways.';
      mood = 'Suspenseful, high-tech, gritty, visceral.';
      colorPalette = ['#090A0F', '#EC4899', '#06B6D4', '#8B5CF6', '#F1F5F9'];
      styleTags = ['Blade Runner Aesthetic', 'Volumetric Rain Haze', 'Chiaroscuro Shadows', 'Chroma Halation'];
    } else if (isCar) {
      title = 'Apex Velocity: Cold Night';
      logline = 'A bespoke high-performance machine tests the outer limits of traction along mountain passes drenched in moonlight.';
      visualDirection = 'Aggressive automotive commercial realism. Razor-sharp reflections across carbon fiber and glowing ceramic brake rotors.';
      mood = 'Adrenaline, precision, aerodynamic power.';
      colorPalette = ['#050505', '#18181B', '#EF4444', '#3B82F6', '#FAFAFA'];
      styleTags = ['Russian Arm Chase Cam', '60fps Fluid Slow-Mo', 'Wet Tarmac', 'Precision Tracking'];
    } else if (isSpace) {
      title = 'Beyond the Celestial Veil';
      logline = 'A lone explorer crosses deep cosmic silence to uncover an enigmatic alien structure floating near a gas giant ring system.';
      visualDirection = 'Interstellar hard sci-fi realism. Cold cosmic blackness accented by radiant planetary rings and golden suit beacons.';
      mood = 'Cosmic awe, reverence, existential solitude.';
      colorPalette = ['#02040A', '#0284C7', '#F59E0B', '#38BDF8', '#FFFFFF'];
      styleTags = ['65mm IMAX Ratio', 'Zero-Gravity Drift', 'Stark Sunbeam Lighting', 'Deep Field Space'];
    } else {
      title = generateTitleFromIdea(idea);
      logline = `A focused cinematic vision exploring ${idea.trim()}, directed with deliberate pacing and masterful visual depth.`;
      visualDirection = `${style} direction featuring organic optical roll-off, balanced highlights, and tactile atmospheric density.`;
      mood = 'Dramatic, cinematic, evocative, poetic.';
      colorPalette = ['#0B0D13', '#1F2937', '#6366F1', '#10B981', '#F3F4F6'];
      styleTags = ['Master Shot Composition', 'Volumetric Atmosphere', 'Naturalistic Lighting', 'Filmic Color Science'];
    }

    return {
      title,
      logline,
      visualDirection,
      mood,
      colorPalette,
      styleTags
    };
  },

  /**
   * Generates four-act story structure
   */
  async generateStoryStructure({ idea, concept, duration = '30 sec' }) {
    return [
      {
        act: 'Act I: The Inciting Frame',
        timecode: '00:00 — 00:05',
        beat: `Atmospheric wide establishing shot grounding the premise of ${concept.title}, introducing the subject in their natural environment.`
      },
      {
        act: 'Act II: The Engagement',
        timecode: '00:05 — 00:15',
        beat: 'Camera moves closer as the subject initiates key action, establishing internal tension and focal technology.'
      },
      {
        act: 'Act III: The Climax / Convergence',
        timecode: '00:15 — 00:25',
        beat: 'Visual intensity peaks with dynamic camera tracking, sweeping scale, and kinetic environmental interaction.'
      },
      {
        act: 'Act IV: The Resolution / Vanishing Point',
        timecode: '00:25 — 00:30',
        beat: 'Poetic wide frame or lingering macro reveal resolving the narrative arc with unforgettable visual weight.'
      }
    ];
  },

  /**
   * Generates structured scenes from concept
   */
  async generateScenes({ idea, concept, duration = '30 sec', model = 'veo', style = 'Cinematic' }) {
    const sceneCount = duration === '10 sec' ? 2 : duration === '20 sec' ? 4 : duration === '60 sec' ? 8 : 6;
    const durPerScene = Math.max(3, Math.floor(parseInt(duration) / sceneCount));

    const scenes = [];
    const titles = [
      'Establishing Vista',
      'The Subject Enters',
      'Focal Interaction',
      'Atmospheric Shift',
      'Kinetic Convergence',
      'The Lingering Horizon',
      'Final Resonance',
      'Epilogue in Silence'
    ];

    const cameraSet = [
      'Slow cinematic dolly forward with gentle low-angle tilt',
      'Orbit / Arc Shot rotating 90 degrees around subject',
      'Tracking / Follow Pan parallel with motion',
      'Crane / Jib Vertical Rise revealing scope',
      'Static Lock-Off with subtle micro-focus pull',
      'Russian Arm sweeping glide'
    ];

    const lensSet = [
      '35mm Anamorphic (2.39:1)',
      '50mm Prime f/1.2',
      '24mm Ultra-Wide Cine',
      '85mm Portrait Cine Prime',
      'Cooke S4/i Prime 40mm'
    ];

    const lightingSet = [
      'Soft volumetric city lighting, deep cyan ambient with warm tungsten accents',
      'High-contrast chiaroscuro with sculpted edge highlights',
      'Golden hour rim light casting long deep shadows',
      'Cyan & amber dual neon with natural skin roll-off',
      'Soft diffused atmospheric overcast'
    ];

    for (let i = 0; i < sceneCount; i++) {
      const startSec = i * durPerScene;
      const endSec = (i + 1) * durPerScene;
      const startTime = formatTime(startSec);
      const endTime = formatTime(endSec);

      const scene = {
        id: `scene-${i + 1}`,
        sceneNumber: i + 1,
        title: titles[i % titles.length],
        startTime,
        endTime,
        description: `Cinematic progression ${i + 1} for ${concept.title}: The subject navigates dynamic visual beats within ${idea.slice(0, 50)}...`,
        subject: `Key focal character/subject exhibiting authentic physical motion, precise garment physics, and focused intention.`,
        environment: `Richly textured environment with deep layered geometry, authentic architectural forms, and subtle atmospheric depth.`,
        camera: cameraSet[i % cameraSet.length],
        lens: lensSet[i % lensSet.length],
        composition: i === 0 || i === sceneCount - 1 ? 'Wide Establishing Silhouette with leading perspective lines' : 'Center-Weighted Symmetry with balanced depth planes',
        lighting: lightingSet[i % lightingSet.length],
        color: 'Teal & Orange Blockbuster Grade with deep shadow retention and Kodak 2383 LUT',
        motion: 'Organic 24fps motion cadence with natural fluid physics and soft momentum',
        atmosphere: 'Light mist and suspended microscopic particles catching directional light beams',
        effects: 'Subtle anamorphic horizontal streak flare, fine 35mm film grain, optical halation',
        audio: 'Low cinematic electronic sub-drone (30Hz) layered with spatial environmental acoustics and subtle foley',
        negativePrompt: 'cartoon, oversaturated, blurry, low resolution, plastic skin, 3D render look, jerky camera, artifacts, floating limbs',
        prompt: ''
      };

      scene.prompt = compileScenePrompt(scene, model);
      scenes.push(scene);
    }

    return scenes;
  },

  /**
   * Generates single prompt string
   */
  async generatePrompt(scene, model = 'generic') {
    await delay(300);
    return compileScenePrompt(scene, model);
  },

  /**
   * Optimizes prompt for specific target model
   */
  async optimizePrompt(prompt, model = 'veo', scene) {
    await delay(350);
    const targetModel = VIDEO_MODELS.find(m => m.id === model) || VIDEO_MODELS[0];
    if (scene && typeof targetModel.optimize === 'function') {
      return targetModel.optimize(prompt, scene);
    }
    return `[${targetModel.name} 4K Optimized] ${prompt}`;
  },

  /**
   * Regenerates a single scene with fresh creative variation
   */
  async regenerateScene(scene, model = 'veo', focusStyle = 'cinematic') {
    await delay(600);
    const updated = {
      ...scene,
      description: `Refined variation: ${scene.description} Captured with heightened atmospheric fidelity and nuanced character dynamics.`,
      camera: scene.camera.includes('dolly') ? 'Sweeping Orbit / Arc Shot with smooth low-angle framing' : 'Slow cinematic dolly forward with gentle low-angle tilt',
      lighting: scene.lighting.includes('volumetric') ? 'Golden hour rim lighting with deep chiaroscuro fill' : 'Soft volumetric atmospheric haze with dual neon rim highlights',
      atmosphere: 'Suspended micro-particles catching lens flares with fresh rain puddle reflections',
    };
    updated.prompt = compileScenePrompt(updated, model);
    return updated;
  }
};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function generateTitleFromIdea(idea) {
  const words = idea.split(' ').filter(w => w.length > 3).slice(0, 3);
  if (!words.length) return 'Cinematic Vision';
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).replace(/[^a-zA-Z]/g, '')).join(' ') + ' Project';
}
