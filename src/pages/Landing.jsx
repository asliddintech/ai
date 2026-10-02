import React, { useState } from 'react';
import { 
  Sparkles, 
  Film, 
  ArrowRight, 
  Play, 
  Camera, 
  Sun, 
  Layers, 
  Sliders, 
  Cpu, 
  CheckCircle2, 
  ChevronRight, 
  Maximize2,
  Copy,
  Check,
  Send
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LanguageToggle } from '../components/ui/LanguageToggle';
import { VIDEO_MODELS } from '../data/modelPresets';

export function Landing() {
  const { 
    navigateTo, 
    generateNewProject, 
    isGenerating, 
    telegramUser, 
    setCabinetModalOpen, 
    setAuthModalOpen, 
    t 
  } = useStudio();
  const [quickIdea, setQuickIdea] = useState('An AI engineer building a futuristic application in Tashkent at night.');
  const [copiedDemo, setCopiedDemo] = useState(false);

  const handleHeroGenerate = () => {
    generateNewProject({
      idea: quickIdea,
      duration: '30 sec',
      aspectRatio: '16:9',
      style: 'Sci-Fi',
      model: 'veo',
      language: 'English'
    });
  };

  const sampleCompiledPrompt = "Photorealistic cinematic master shot: An Uzbek AI engineer in a sleek dark climate coat walking across a suspended luminous glass bridge in futuristic Tashkent at night. Sweeping view of architectural towers with glowing geometric patterns and elevated maglev transit. 35mm anamorphic lens, slow dolly forward, volumetric cyan and amber city haze, gentle rain mist reflections, 24fps film cadence, Arri Alexa LF color science, high temporal coherence.";

  const handleCopySample = () => {
    navigator.clipboard.writeText(sampleCompiledPrompt);
    setCopiedDemo(true);
    setTimeout(() => setCopiedDemo(false), 2000);
  };

  return (
    <div className="min-h-screen bg-studio-950 text-studio-100 overflow-x-hidden selection:bg-indigo-500/30">
      {/* Top Navigation */}
      <nav className="h-16 border-b border-white/[0.07] bg-studio-950/80 backdrop-blur-md px-6 lg:px-12 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-glow-indigo/50 border border-white/20">
            <Film className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white font-display">
            {t('brandTitle')}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-mono text-studio-400">
          <button onClick={() => navigateTo('dashboard')} className="hover:text-white transition-colors uppercase">
            {t('navDashboard')}
          </button>
          <button onClick={() => navigateTo('templates')} className="hover:text-white transition-colors uppercase">
            {t('navTemplates')}
          </button>
          <button onClick={() => navigateTo('history')} className="hover:text-white transition-colors uppercase">
            {t('navHistory')}
          </button>
          <button onClick={() => navigateTo('settings')} className="hover:text-white transition-colors uppercase">
            {t('navSettings')}
          </button>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <LanguageToggle variant="pill" />

          {telegramUser ? (
            <button
              onClick={() => setCabinetModalOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-studio-900 border border-white/10 hover:border-indigo-500/40 text-xs text-white transition-all"
              title="Shaxsiy Kabinet"
            >
              <img
                src={telegramUser.avatarUrl}
                alt=""
                className="w-5 h-5 rounded-full object-cover border border-indigo-400/30"
              />
              <span className="font-medium hidden sm:inline text-xs truncate max-w-[120px]">
                {telegramUser.fullName || telegramUser.name}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#229ED9]/15 hover:bg-[#229ED9]/25 border border-[#229ED9]/40 text-xs text-[#229ED9] hover:text-white font-medium transition-all shadow-sm"
              title="Telegram orqali kirish"
            >
              <Send className="w-3.5 h-3.5 -translate-x-0.5" />
              <span>Telegram Kirish</span>
            </button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTo('dashboard')}
            className="hidden sm:inline-flex text-xs font-mono"
          >
            {t('exploreStudio')}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigateTo('new-project')}
            className="bg-indigo-600 hover:bg-indigo-500 text-xs font-mono shadow-glow-indigo/50"
          >
            {t('createVideo')}
          </Button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-16 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Soft Ambient Radial Background Lights */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-indigo-600/15 via-cyan-500/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-6 relative z-10">
          {/* Small Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-studio-900 border border-white/10 text-[11px] font-mono tracking-widest text-indigo-300 uppercase shadow-inner-light">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t('brandTitle')}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight font-display text-glow">
            {t('tagline')}
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-lg text-studio-300 font-normal max-w-2xl mx-auto leading-relaxed">
            {t('supportingText')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Button
              variant="primary"
              size="lg"
              icon={Sparkles}
              onClick={() => navigateTo('new-project')}
              className="w-full sm:w-auto px-8 bg-indigo-600 hover:bg-indigo-500 shadow-glow-indigo text-white font-semibold text-sm"
            >
              {t('createVideo')}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={Film}
              onClick={() => navigateTo('dashboard')}
              className="w-full sm:w-auto px-6 text-sm"
            >
              {t('exploreStudio')}
            </Button>
          </div>
        </div>

        {/* HERO VISUAL: Abstract Cinematic AI Production Interface Preview */}
        <div className="mt-14 sm:mt-20 relative max-w-6xl mx-auto">
          {/* Outer Border Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-indigo-500/20 rounded-2xl blur-lg opacity-70 pointer-events-none" />

          {/* Mockup Container */}
          <div className="relative rounded-xl bg-studio-900/90 border border-white/15 shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Window Top Bar */}
            <div className="px-4 py-3 bg-studio-950/90 border-b border-white/10 flex items-center justify-between text-xs font-mono text-studio-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                <span className="ml-2 text-studio-300 font-sans font-medium">
                  Studio Workspace — Future of Tashkent: Silicon Oasis
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  Target: Google Veo 2
                </span>
                <span className="text-studio-400">2.39:1 Anamorphic</span>
              </div>
            </div>

            {/* Interface Content Preview */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Top Row: Timeline & Camera Controls Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left: Cinematic Preview Area (7 cols) */}
                <div className="lg:col-span-7 bg-studio-950 rounded-xl border border-white/10 p-5 relative overflow-hidden flex flex-col justify-between min-h-[260px]">
                  {/* Subtle Simulated Film Atmosphere */}
                  <div className="absolute inset-0 bg-film-grid opacity-25 pointer-events-none" />
                  <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-cyan-500/15 rounded-full blur-[80px] pointer-events-none animate-pulse-subtle" />

                  {/* Top HUD */}
                  <div className="flex items-center justify-between text-[11px] font-mono relative z-10">
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950 border border-red-500/30 text-red-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      REC • SCENE 01
                    </span>
                    <span className="text-studio-400">00:00 — 00:05</span>
                  </div>

                  {/* Center Shot Detail */}
                  <div className="relative z-10 py-6 text-center max-w-md mx-auto">
                    <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase block mb-1">
                      ARRIVAL IN THE ELECTRIC CITY
                    </span>
                    <p className="text-sm font-medium text-white leading-relaxed">
                      "An Uzbek AI engineer walking through illuminated geometric glass minarets in midnight Tashkent."
                    </p>
                  </div>

                  {/* Bottom Camera Controls HUD */}
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/5 text-[10px] font-mono text-studio-400">
                    <span className="flex items-center gap-1 text-cyan-300">
                      <Camera className="w-3 h-3" />
                      Slow Dolly Forward • 35mm Anamorphic
                    </span>
                    <span className="flex items-center gap-1 text-amber-300">
                      <Sun className="w-3 h-3" />
                      Cyan & Amber Volumetric Haze
                    </span>
                  </div>
                </div>

                {/* Right: Scene Card & Token Generator (5 cols) */}
                <div className="lg:col-span-5 bg-studio-950 rounded-xl border border-white/10 p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-white/5 text-studio-400">
                      <span className="text-indigo-400 font-semibold uppercase">PROMPT COMPILER</span>
                      <span className="text-emerald-400 font-mono text-[10px]">● VEO 2 OPTIMIZED</span>
                    </div>

                    <div className="mt-3 space-y-2 text-xs font-mono">
                      <div className="p-2 rounded bg-studio-900 border border-white/5">
                        <span className="text-[9px] text-studio-500 uppercase block">[SUBJECT]</span>
                        <span className="text-studio-200">Uzbek AI engineer in dark climate coat</span>
                      </div>
                      <div className="p-2 rounded bg-studio-900 border border-white/5">
                        <span className="text-[9px] text-studio-500 uppercase block">[OPTICS & LIGHT]</span>
                        <span className="text-studio-200">35mm Anamorphic, 2.39:1 oval bokeh, mist</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-studio-900 border border-indigo-500/20">
                    <div className="flex items-center justify-between text-[10px] font-mono text-indigo-300 mb-1">
                      <span>COMPILED MODEL TOKENS</span>
                      <button 
                        onClick={handleCopySample}
                        className="text-studio-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        {copiedDemo ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedDemo ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-[11px] font-mono text-studio-300 line-clamp-3 leading-relaxed">
                      "{sampleCompiledPrompt}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom: Timeline Rail Preview */}
              <div className="bg-studio-950 rounded-xl border border-white/10 p-3 flex items-center gap-3 overflow-x-auto text-xs font-mono">
                <span className="text-[10px] uppercase text-studio-500 shrink-0">TIMELINE:</span>
                {[
                  { cut: 'CUT 01', title: 'Arrival', time: '00:00 - 00:05', active: true },
                  { cut: 'CUT 02', title: 'Neural Interface', time: '00:05 - 00:10', active: false },
                  { cut: 'CUT 03', title: 'Architectural Pulse', time: '00:10 - 00:15', active: false },
                  { cut: 'CUT 04', title: 'Autonomous Symphony', time: '00:15 - 00:20', active: false },
                  { cut: 'CUT 05', title: 'Dawn Over Tashkent', time: '00:20 - 00:30', active: false },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-2 rounded-lg border shrink-0 transition-all ${
                      item.active
                        ? 'bg-indigo-950/80 border-indigo-500/50 text-white'
                        : 'bg-studio-900 border-white/5 text-studio-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className={item.active ? 'text-indigo-400 font-bold' : 'text-studio-500'}>
                        {item.cut}
                      </span>
                      <span>{item.time}</span>
                    </div>
                    <span className="font-sans text-xs text-studio-200 mt-0.5 block">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE WORKFLOW BREAKDOWN SECTION */}
      <section className="py-20 border-t border-white/[0.06] bg-studio-950/60 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            PRODUCTION ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display">
            The Filmmaking Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-studio-400">
            How simple ideas become multi-scene cinematic productions.
          </p>
        </div>

        {/* Workflow Diagram Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'USER IDEA & INTENT',
              desc: 'Input raw premises or loglines. The AI deconstructs core themes, stakes, and narrative velocity.',
              color: 'text-indigo-400'
            },
            {
              step: '02',
              title: 'CREATIVE CONCEPT & STORY',
              desc: 'Calculates four-act story progression, visual treatments, and atmospheric mood palettes.',
              color: 'text-cyan-400'
            },
            {
              step: '03',
              title: 'CINEMATOGRAPHY & OPTICS',
              desc: 'Assigns 35mm anamorphic lenses, lighting styles, camera movements, and audio cues.',
              color: 'text-amber-400'
            },
            {
              step: '04',
              title: 'MODEL-SPECIFIC OPTIMIZATION',
              desc: 'Compiles token-dense prompts tailored for Veo, Sora, Runway Gen-3, Kling, or Pika.',
              color: 'text-emerald-400'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-studio-900 border border-white/5 hover:border-white/15 transition-all space-y-3 flex flex-col justify-between"
            >
              <div>
                <span className={`text-xs font-mono font-bold tracking-wider ${item.color}`}>
                  PHASE {item.step}
                </span>
                <h3 className="text-sm font-semibold text-white mt-1 font-display">
                  {item.title}
                </h3>
                <p className="text-xs text-studio-400 mt-2 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.04] text-[10px] font-mono text-studio-500">
                PROCEED →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SUPPORTED VIDEO MODELS SECTION */}
      <section className="py-20 border-t border-white/[0.06] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
            VIDEO MODEL ECOSYSTEM
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display">
            Optimized for Every Generation Engine
          </h2>
          <p className="text-xs sm:text-sm text-studio-400">
            Each video model interprets keywords differently. AI Video Prompt Studio generates tailored syntaxes automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {VIDEO_MODELS.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-xl bg-studio-900 border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="text-xs font-semibold text-white font-display block">
                  {m.name}
                </span>
                <p className="text-[11px] text-studio-400 mt-1 leading-snug">
                  {m.tagline}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.04] space-y-1">
                <span className="text-[9px] font-mono text-studio-500 uppercase block">Strengths</span>
                <div className="flex flex-wrap gap-1">
                  {m.strengths.slice(0, 2).map((s, idx) => (
                    <span key={idx} className="text-[9px] font-mono text-studio-300 bg-studio-800 px-1.5 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="py-20 border-t border-white/[0.06] bg-studio-950/80 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display">
          Ready to direct your next production?
        </h2>
        <p className="text-sm text-studio-400 max-w-xl mx-auto">
          Start building production-ready cinematic prompts, scene breakdowns, and shotlists right now.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            icon={Sparkles}
            onClick={() => navigateTo('new-project')}
            className="w-full sm:w-auto px-8 bg-indigo-600 hover:bg-indigo-500 shadow-glow-indigo text-white font-semibold"
          >
            {t('newProject')}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigateTo('dashboard')}
            className="w-full sm:w-auto px-6"
          >
            {t('openDashboard')}
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] py-8 px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-studio-500">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-indigo-400" />
          <span className="text-studio-300 font-sans font-semibold">AI Video Prompt Studio</span>
          <span>• Production Grade AI Filmmaking Workspace</span>
        </div>
        <div>
          <span>Crafted for Creators & Technologists</span>
        </div>
      </footer>
    </div>
  );
}
