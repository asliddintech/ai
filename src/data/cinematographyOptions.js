export const CAMERA_MOVEMENTS = [
  { id: 'dolly-in', label: 'Slow Dolly Forward / Push-in', description: 'Draws focus into the subject with smooth linear forward tracking.' },
  { id: 'orbit', label: 'Orbit / Arc Shot', description: 'Revolves 360 or 180 degrees around the focal subject.' },
  { id: 'static', label: 'Static Lock-Off', description: 'Rock-solid tripod frame emphasizing subject motion.' },
  { id: 'handheld', label: 'Kinetic Handheld', description: 'Visceral, documentary-style organic camera shake.' },
  { id: 'crane-rise', label: 'Crane / Jib Vertical Rise', description: 'Sweeping upward vertical reveal exposing the broader scale.' },
  { id: 'tracking', label: 'Lateral Tracking / Follow Pan', description: 'Tracks parallel with the moving subject.' },
  { id: 'drone-aerial', label: 'Drone Top-Down Aerial', description: 'Bird-eye perspective slowly descending or rotating.' },
  { id: 'dolly-zoom', label: 'Vertigo Dolly Zoom (Zolly)', description: 'Focal compression distortion warping the background perspective.' },
  { id: 'whip-pan', label: 'Kinetic Whip Pan', description: 'High-speed directional blur transition into the frame.' }
];

export const LENSES = [
  { id: '35mm-anamorphic', label: '35mm Anamorphic (2.39:1)', description: 'Horizontal flare streaks, distinctive oval bokeh, wide cinematic vista.' },
  { id: '50mm-prime', label: '50mm Prime f/1.2', description: 'Natural human eye field of view with creamy shallow depth of field.' },
  { id: '24mm-wide', label: '24mm Ultra-Wide Cine', description: 'Expansive environmental perspective with dramatic edge scale.' },
  { id: '85mm-portrait', label: '85mm Portrait Cine Prime', description: 'Subtle facial compression, intimate isolation from background.' },
  { id: '100mm-macro', label: '100mm Macro Cine Probe', description: 'Hyper-detailed close-up on minute textures and mechanical gears.' },
  { id: 'cooke-s4', label: 'Cooke S4/i Prime ("Cooke Look")', description: 'Warm organic skin tones, smooth roll-off, vintage cinematic gentleness.' },
  { id: 'arri-signature', label: 'Arri Signature Prime 40mm', description: 'Modern pristine optical sharpness, velvet out-of-focus transition.' },
  { id: '16mm-bolex', label: '16mm Vintage Bolex Optical', description: 'Textured grain, organic vignette, archival indie warmth.' }
];

export const COMPOSITIONS = [
  { id: 'center-symmetry', label: 'Center-Weighted Symmetry', description: 'Stanley Kubrick style one-point perspective and architectural balance.' },
  { id: 'rule-thirds', label: 'Rule of Thirds Horizon', description: 'Subject positioned along focal intersecting quadrant points.' },
  { id: 'golden-spiral', label: 'Golden Spiral (Fibonacci)', description: 'Flowing natural eye path guiding attention through the environment.' },
  { id: 'deep-focus', label: 'Deep Focus Multi-Plane', description: 'Simultaneous sharp clarity in foreground, midground, and background.' },
  { id: 'extreme-closeup', label: 'Extreme Close-Up (ECU)', description: 'Frame filled exclusively with subject eyes or focal detail.' },
  { id: 'dutch-angle', label: 'Dutch Angle / Canting', description: 'Tilted horizon communicating psychological tension or disequilibrium.' },
  { id: 'silhouette', label: 'Wide Establishing Silhouette', description: 'Tiny lone figure framed against gargantuan illuminated backdrop.' }
];

export const LIGHTING_STYLES = [
  { id: 'volumetric-haze', label: 'Volumetric Atmospheric Haze', description: 'Visible god-rays slicing through airborne mist and dust.' },
  { id: 'chiaroscuro', label: 'High-Contrast Chiaroscuro', description: 'Deep Rembrandt shadows with sculpted edge highlights.' },
  { id: 'golden-hour', label: 'Golden Hour Rim Light', description: 'Warm 3200K sunset backlight casting long golden shadows.' },
  { id: 'cyan-amber-neon', label: 'Cyan & Amber Dual Neon', description: 'Cyberpunk contrasting dual-tone practical street lighting.' },
  { id: 'soft-diffused', label: 'Soft Diffused Overcast', description: 'Shadowless moody Nordic daylight bouncing off neutral architecture.' },
  { id: 'harsh-noon', label: 'Harsh Midday Noir Shadows', description: 'Razor-sharp directional shadows through blinds or industrial grids.' },
  { id: 'bioluminescent', label: 'Bioluminescent Ambient Glow', description: 'Ethereal sub-surface organic luminescence in deep darkness.' },
  { id: 'tungsten-practical', label: 'Tungsten 2800K Warm Practicals', description: 'Intimate desk lamps and glowing filament bulbs in low-light room.' }
];

export const COLOR_TREATMENTS = [
  { id: 'teal-orange', label: 'Teal & Orange Blockbuster Grade', description: 'Warm skin tones contrasted against deep cyan environmental shadows.' },
  { id: 'bleach-bypass', label: 'Bleach Bypass Silver Halide', description: 'High contrast, muted desaturated palette, gritty industrial metallic sheen.' },
  { id: 'kodak-2383', label: 'Kodak Vision3 5219 / 2383 Print LUT', description: 'Classic 35mm Hollywood film negative color science with rich blacks.' },
  { id: 'monochrome', label: 'Monochromatic Film Noir (Kodak Tri-X)', description: 'Rich monochrome silver gradient with deep blacks and bright silver whites.' },
  { id: 'ektachrome', label: 'Ektachrome Vivid Saturated', description: 'Hyper-saturated primary colors with punchy mid-tones and crisp whites.' },
  { id: 'muted-dystopian', label: 'Desaturated Muted Dystopian', description: 'Neutral olive and slate palette with near-absent vibrant primaries.' },
  { id: 'technicolor-3strip', label: 'Technicolor 3-Strip Nostalgia', description: 'Vibrant vintage 1950s dye transfer color separation.' }
];

export const MOTION_PROFILES = [
  { id: 'slow-mo-60', label: '60fps Hyper-Fluid Slow-Mo', description: 'Graceful slowed time emphasizing physics, cloth ripples, and water droplets.' },
  { id: '24fps-cinematic', label: '24fps Organic Cinematic Motion Blur', description: '180-degree shutter standard movie cadence and natural motion cadence.' },
  { id: 'staccato-90deg', label: '90-degree High-Shutter Staccato', description: 'Crisp action-cam shutter (Saving Private Ryan / Gladiator combat feel).' },
  { id: 'zero-gravity', label: 'Zero-Gravity Floating Drift', description: 'Weightless micro-movements drifting organically in space.' },
  { id: 'kinetic-burst', label: 'Kinetic High-Velocity Sprint', description: 'Rapid acceleration bursts with dynamic camera momentum.' }
];

export const ATMOSPHERES = [
  { id: 'light-mist', label: 'Light Mist & Suspended Particles', description: 'Subtle airborne humidity catching ambient volumetric headlights.' },
  { id: 'wet-asphalt', label: 'Wet Asphalt Neon Reflections', description: 'Fresh rain puddles creating mirror-like reflections of urban lighting.' },
  { id: 'heavy-fog', label: 'Heavy Ground Steam & Industrial Fog', description: 'Dense vapor billowing from subway grates or cooling vents.' },
  { id: 'dust-motes', label: 'Microscopic Dust Motes in Light Beam', description: 'Floating particles suspended in dramatic window sunbeams.' },
  { id: 'rain-streaked', label: 'Rain-Streaked Glass Foreground', description: 'Water droplets cascading down optical glass with bokeh behind.' },
  { id: 'heat-shimmer', label: 'Desert Atmospheric Heat Shimmer', description: 'Optical refractive mirage ripples rising from sun-baked surface.' }
];

export const AUDIO_DIRECTIONS = [
  { id: 'sub-drone', label: 'Low Cinematic Electronic Sub-Drone (30Hz)', description: 'Deep bass tension hum resonating through cinematic soundstage.' },
  { id: 'spatial-rain', label: 'Spatial Binaural Rain & Neon Hum', description: 'Wet drizzle spatial panning with electrical transformer buzz.' },
  { id: 'synth-arpeggio', label: 'Vangelis-Style Analog Synth Arpeggio', description: 'Blade Runner CS-80 nostalgic brass lead and warm reverb.' },
  { id: 'orchestral-swell', label: 'Hans Zimmer Cello Swell & Low Brass', description: 'Building symphonic tension with pounding taiko heartbeat drums.' },
  { id: 'asmr-foley', label: 'Tactile Mechanical ASMR Foley', description: 'Subtle clicks of relays, keyboard mechanical switches, and leather footsteps.' },
  { id: 'silent-void', label: 'Muffled Sub-Surface Vacuum Silence', description: 'Internalized breathing and muffled low-pass heartbeat only.' }
];
