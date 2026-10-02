export const VIDEO_MODELS = [
  {
    id: 'veo',
    name: 'Google Veo 2',
    tagline: 'High-definition 4K cinematic coherence and physics',
    promptStyle: 'natural-narrative',
    recommendedAspects: ['16:9', '2.39:1'],
    strengths: ['Temporal consistency', 'Volumetric lighting', 'Realistic physical fluids'],
    optimize: (basePrompt, scene) => {
      return `[4K Cinematic, Photorealistic Arri Alexa LF] ${scene.description}. Focal subject: ${scene.subject}. Environment: ${scene.environment}. Cinematography: ${scene.camera}, ${scene.lens}, ${scene.composition}. Lighting: ${scene.lighting}. Color Grade: ${scene.color}. Natural physics, ${scene.motion}, ${scene.atmosphere}. High temporal consistency, master film shot, 24fps motion cadence, Kodak 5219 grain structure, award-winning cinematography.`;
    }
  },
  {
    id: 'sora',
    name: 'OpenAI Sora',
    tagline: 'Complex spatial interaction, multi-subject continuity',
    promptStyle: 'hyper-detailed-world',
    recommendedAspects: ['16:9', '9:16', '1:1'],
    strengths: ['Complex narrative physics', 'Persistent 3D geometry', 'Nuanced character expression'],
    optimize: (basePrompt, scene) => {
      return `A hyper-realistic cinematic continuous sequence. In ${scene.environment}, ${scene.subject}. Captured with ${scene.camera} using a ${scene.lens} with ${scene.composition}. The scene is illuminated by ${scene.lighting}, creating an authentic atmosphere of ${scene.atmosphere}. Color palette features ${scene.color}. Movement dynamic: ${scene.motion}. Physically accurate light bounces, subsurface scattering, realistic motion blur, shallow depth of field, 35mm filmic texture.`;
    }
  },
  {
    id: 'runway',
    name: 'Runway Gen-3 Alpha',
    tagline: 'Director camera controls, motion weight syntax',
    promptStyle: 'syntax-driven',
    recommendedAspects: ['16:9', '9:16'],
    strengths: ['Direct camera motion commands', 'Cinematic motion brush', 'Stylistic versatility'],
    optimize: (basePrompt, scene) => {
      const cameraKeyword = scene.camera.toLowerCase().includes('dolly') ? 'dolly in' :
        scene.camera.toLowerCase().includes('orbit') ? 'orbit left' :
        scene.camera.toLowerCase().includes('crane') ? 'crane up' : 'slow track';
      return `FPOV cinematic master shot: ${scene.description}. Subject: ${scene.subject}. Setting: ${scene.environment}. Optical setup: ${scene.lens}, ${scene.lighting}, ${scene.atmosphere}. --camera ${cameraKeyword} --motion 5 --seed 42 --cinematic true --upscale`;
    }
  },
  {
    id: 'kling',
    name: 'Kling AI 1.5',
    tagline: 'High-realism human kinematics and fine textures',
    promptStyle: 'photorealistic-weight',
    recommendedAspects: ['16:9', '9:16', '1:1'],
    strengths: ['Facial realism', 'Clothing physics', 'Asian cinema lighting aesthetics'],
    optimize: (basePrompt, scene) => {
      return `Masterpiece cinematic video, 8K raw footage, ${scene.subject} in ${scene.environment}. ${scene.camera}, ${scene.lens}, ${scene.composition}. Lighting: ${scene.lighting}. Color tone: ${scene.color}. Details: ${scene.atmosphere}, ${scene.motion}. Extremely lifelike skin pore textures, micro-movements, cinematic film grade, no CGI artifacts.`;
    }
  },
  {
    id: 'pika',
    name: 'Pika 2.0',
    tagline: 'Dynamic camera zooms, snappy movement',
    promptStyle: 'concise-tags',
    recommendedAspects: ['16:9', '9:16'],
    strengths: ['Fast rendering', 'Camera pan & zoom', 'Stylized effects'],
    optimize: (basePrompt, scene) => {
      return `${scene.description}, ${scene.subject}, ${scene.environment}, ${scene.lighting}, ${scene.atmosphere} -camera zoom in -fps 24 -motion 2`;
    }
  },
  {
    id: 'generic',
    name: 'Universal Director Prompt',
    tagline: 'Compatible with all generative video engines',
    promptStyle: 'universal',
    recommendedAspects: ['16:9', '9:16', '1:1', '2.39:1'],
    strengths: ['Interoperable format', 'Strict cinematography descriptors'],
    optimize: (basePrompt, scene) => {
      return `${scene.description}. Subject: ${scene.subject}. Environment: ${scene.environment}. Camera: ${scene.camera}. Lens: ${scene.lens}. Composition: ${scene.composition}. Lighting: ${scene.lighting}. Color: ${scene.color}. Motion: ${scene.motion}. Atmosphere: ${scene.atmosphere}. Audio cues: ${scene.audio}.`;
    }
  }
];

export const ASPECT_RATIOS = [
  { id: '16:9', label: '16:9 Widescreen', description: 'Standard cinematic landscape for YouTube & TV', cssAspect: 'aspect-video' },
  { id: '2.39:1', label: '2.39:1 Anamorphic', description: 'Ultra-wide cinematic theatrical scope', cssAspect: 'aspect-[2.39/1]' },
  { id: '9:16', label: '9:16 Vertical Reel', description: 'Mobile vertical for TikTok, Reels & Shorts', cssAspect: 'aspect-[9/16]' },
  { id: '1:1', label: '1:1 Square Frame', description: 'Classic square format for feed showcases', cssAspect: 'aspect-square' }
];

export const DURATION_OPTIONS = [
  { id: '10', label: '10 sec', scenesCount: 2, description: 'Snappy teaser or micro-commercial' },
  { id: '20', label: '20 sec', scenesCount: 4, description: 'Engaging product or social story' },
  { id: '30', label: '30 sec', scenesCount: 6, description: 'Standard TV commercial / film trailer' },
  { id: '60', label: '60 sec', scenesCount: 10, description: 'Deep narrative cinematic short' },
  { id: 'custom', label: 'Custom', scenesCount: 5, description: 'User-specified scene structure' }
];

export const STYLE_OPTIONS = [
  { id: 'cinematic', label: 'Cinematic Movie', badge: 'Popular' },
  { id: 'photorealistic', label: 'Photorealistic Hyper-real' },
  { id: 'sci-fi', label: 'Sci-Fi Futuristic' },
  { id: 'commercial', label: 'Luxury Brand Commercial' },
  { id: 'documentary', label: 'Documentary Realism' },
  { id: 'anime', label: 'Makoto Shinkai Anime Style' },
  { id: 'custom', label: 'Custom Director Vision' }
];

export const LANGUAGE_OPTIONS = [
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
  { id: 'ru', label: 'Русский', flag: '🇷🇺' }
];
