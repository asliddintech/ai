# AI Video Prompt Studio

> A professional AI-powered creative workspace for generating structured cinematic video prompts, scene breakdowns, and cinematography direction from simple user ideas.

Built for filmmakers, AI creators, and creative technologists. Designed with a dark, cinematic, minimal, and futuristic visual identity.

---

## 📽️ Core Product Workflow

```
USER IDEA
  ↓
AI ANALYSIS
  ↓
CREATIVE CONCEPT
  ↓
STORY STRUCTURE (4 Acts)
  ↓
SCENE BREAKDOWN (10s — 60s)
  ↓
CINEMATOGRAPHY (Camera, Lens, Composition, Lighting, Color, Motion, Atmosphere, Audio)
  ↓
VIDEO MODEL OPTIMIZATION (Google Veo 2, OpenAI Sora, Runway Gen-3 Alpha, Kling AI, Pika 2.0)
  ↓
FINAL COMPILED PROMPTS
  ↓
COPY / EXPORT (Markdown Treatment, JSON, EDL CSV, Prompts Bundle)
```

---

## ⚡ Key Features

- **Cinematic Landing Page:** Abstract production interface preview, real-time prompt generation showcase, workflow phases, and supported generative video engines.
- **Creator Dashboard:** Quick-start production cards (Cinematic Film, Product Commercial, AI Technology, Social Media Reel, Storytelling, Music Video), recent projects grid, and compute usage tracker.
- **Focused New Project Pipeline:** Visually dominant creative prompt input with quick inspiration pills, duration controls (10s, 20s, 30s, 60s, custom), aspect ratios (16:9, 2.39:1, 9:16, 1:1), style directors, and target engines.
- **Intelligent Generation Engine:** Multi-stage simulated generation lifecycle with real-time token logs:
  - `ANALYZING IDEA`
  - `BUILDING STORY`
  - `DESIGNING SCENES`
  - `GENERATING CINEMATOGRAPHY`
  - `OPTIMIZING PROMPTS`
- **Comprehensive Studio Workspace:**
  - **Left Panel:** Project navigation & interactive shot coverage tree.
  - **Center Canvas:** Creative Concept card, 4-Act Story Structure, Horizontal Timeline track, and structured Scene Cut cards.
  - **Right Panel:** Live target engine optimizer and inspector.
- **Structured Scene Cards & Full Scene Editor:**
  - Timecodes, scene titles, and narrative actions.
  - Granular parameters: Subject, Environment, Camera Movement, Optical Lens (35mm Anamorphic, 50mm Prime, etc.), Framing/Composition, Volumetric Lighting, Color Grade/LUT, Motion Dynamics, Atmosphere & Suspended Particles, Audio Soundscape, and Negative Prompts.
  - Real-time prompt recompilation as parameters change.
- **Systematic Prompt & Token Inspector:**
  - Tokenized node inspector inspired by modern code editors.
  - 1-click model optimization buttons: **Optimize for Veo**, **Optimize for Sora**, **Optimize for Runway**, **Optimize for Kling**, **Optimize for Pika**.
  - Quick action modifiers: **Shorten** (condense to high-density tokens) & **Expand** (enrich with optical descriptors).
- **Cinematic Storyboard Simulation:**
  - Director HUD playback simulator with REC indicators, crosshair reticle, aspect ratio framing (16:9, 2.39:1 theatrical, 9:16 vertical), timecode ticker, and ambient sound design cues.
- **Curated Templates Library:**
  - 10 production categories: Cinematic, Technology, Product, Automotive, Fashion, Travel, Architecture, Sci-Fi, Social Media, and Storytelling.
- **Searchable Project History:**
  - Filters: All, Generated, Draft, Archived.
  - Open in Studio, Duplicate, Inline Rename, and Delete with safe confirmation modal.
- **Workspace Settings:**
  - Creator profile customization, default model/duration/aspect ratio preferences, themes, and API key management (Gemini, OpenAI, Runway, custom endpoints).

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 18, Vite 5, Tailwind CSS, Lucide React, Framer Motion
- **Backend:** Node.js, Express, CORS
- **Storage:** LocalStorage with automatic seed data and session persistence
- **AI Layer:** Clean abstraction in `/src/services/aiService.js` separating generation logic from UI components.

```
src/
├── components/
│   ├── ui/               # Button, Badge, Card, Modal, Toast
│   ├── layout/           # Sidebar, Topbar, AppShell
│   ├── studio/           # ConceptCard, StoryStructure, TimelineView, VisualizerModal, ExportModal, GenerationProgressModal
│   ├── scenes/           # SceneCard, SceneEditorModal
│   └── prompts/          # SystematicPromptEditor
├── pages/
│   ├── Landing.jsx       # Cinematic hero & interface preview
│   ├── Dashboard.jsx     # Creator dashboard & quick start
│   ├── NewProject.jsx    # Creation interface
│   ├── Studio.jsx        # 3-panel production workspace
│   ├── Templates.jsx     # 10-category template library
│   ├── History.jsx       # Searchable project archive
│   └── Settings.jsx      # Preferences & API keys
├── services/
│   ├── aiService.js      # Clean AI abstraction layer
│   ├── projectService.js # Local persistence & project CRUD
│   └── authService.js    # Profile & settings storage
├── data/
│   ├── defaultProjects.js
│   ├── templatesData.js
│   ├── cinematographyOptions.js
│   └── modelPresets.js
├── utils/
│   ├── promptCompiler.js
│   ├── exportFormats.js
│   └── timecode.js
└── context/
    └── StudioContext.jsx # Global workspace state
```

---

## 🚀 Running the Application

### Development Mode (with Vite HMR)
```bash
npm run dev
# Running on http://localhost:5173
```

### Production Full-Stack Server
```bash
npm run build
npm run server
# Running on http://localhost:3001
```
