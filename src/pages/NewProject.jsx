import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  Film, 
  Cpu, 
  Languages, 
  Maximize, 
  Palette, 
  ArrowRight,
  Lightbulb,
  Check
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  DURATION_OPTIONS, 
  ASPECT_RATIOS, 
  STYLE_OPTIONS, 
  VIDEO_MODELS, 
  LANGUAGE_OPTIONS 
} from '../data/modelPresets';

const QUICK_INSPIRATION_PROMPTS = [
  "An AI engineer building a futuristic application in Tashkent at night.",
  "A matte black electric hypercar drifting on wet alpine switchbacks at 2 AM.",
  "An astronaut finding a glowing alien archival sphere deep in Titan crystal caverns.",
  "Macro probe lens moving through glowing sapphire gears of a luxury titanium watch."
];

export function NewProject() {
  const { generateNewProject, isGenerating, navigateTo, t } = useStudio();

  const [idea, setIdea] = useState('');
  const [duration, setDuration] = useState('30 sec');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [style, setStyle] = useState('Cinematic');
  const [model, setModel] = useState('veo');
  const [language, setLanguage] = useState('English');
  const [customDuration, setCustomDuration] = useState('45');
  const [isCustomDuration, setIsCustomDuration] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!idea.trim()) return;

    const finalDuration = isCustomDuration ? `${customDuration} sec` : duration;

    generateNewProject({
      idea: idea.trim(),
      duration: finalDuration,
      aspectRatio,
      style,
      model,
      language
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateTo('dashboard')}
          className="text-xs font-mono text-studio-400 hover:text-white transition-colors"
        >
          {t('returnToDashboard')}
        </button>
        <Badge variant="indigo" size="sm" icon={Sparkles}>
          {t('newPipelineBadge')}
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Dominant Main Input Header */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight font-display">
            {t('whatToCreateHeading')}
          </h1>
          <p className="text-xs sm:text-sm text-studio-400">
            {t('whatToCreateSub')}
          </p>
        </div>

        {/* Large Visually Dominant Textarea */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-2xl blur opacity-75 group-focus-within:opacity-100 transition duration-300 pointer-events-none" />
          <div className="relative bg-studio-900 rounded-xl border border-white/10 group-focus-within:border-indigo-500/50 p-4 sm:p-5 shadow-2xl">
            <textarea
              rows={4}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder={t('ideaPlaceholder')}
              className="w-full bg-transparent text-sm sm:text-base text-white placeholder-studio-500 focus:outline-none resize-none leading-relaxed font-sans"
              required
            />

            {/* Quick Inspiration Pills */}
            <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono text-studio-400 flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-amber-400" />
                {t('tryInspiration')}
              </span>
              {QUICK_INSPIRATION_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdea(prompt)}
                  className="text-[11px] font-mono text-studio-300 hover:text-white bg-studio-800/80 hover:bg-studio-750 px-2.5 py-1 rounded border border-white/5 transition-all text-left truncate max-w-xs sm:max-w-md"
                >
                  "{prompt.slice(0, 45)}..."
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Configuration Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* 1. Target Duration */}
          <div className="p-4 rounded-xl bg-studio-900 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-studio-400">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-studio-300">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                {t('durationLabel')}
              </span>
              <span>{isCustomDuration ? `${customDuration} sec` : duration}</span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {['10 sec', '20 sec', '30 sec', '60 sec'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => { setDuration(d); setIsCustomDuration(false); }}
                  className={`py-2 px-1 rounded-lg text-xs font-mono transition-all text-center ${
                    !isCustomDuration && duration === d
                      ? 'bg-indigo-600 text-white font-medium shadow-sm'
                      : 'bg-studio-850 text-studio-300 hover:text-white hover:bg-studio-800 border border-white/5'
                  }`}
                >
                  {d.replace(' sec', 's')}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustomDuration(true)}
                className={`py-2 px-1 rounded-lg text-xs font-mono transition-all text-center ${
                  isCustomDuration
                    ? 'bg-indigo-600 text-white font-medium shadow-sm'
                    : 'bg-studio-850 text-studio-300 hover:text-white hover:bg-studio-800 border border-white/5'
                }`}
              >
                Custom
              </button>
            </div>

            {isCustomDuration && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                  className="bg-studio-850 border border-white/10 rounded px-3 py-1.5 text-xs text-white font-mono w-24 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <span className="text-xs font-mono text-studio-400">{t('customDurationPlaceholder')}</span>
              </div>
            )}
          </div>

          {/* 2. Aspect Ratio */}
          <div className="p-4 rounded-xl bg-studio-900 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-studio-400">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-studio-300">
                <Maximize className="w-3.5 h-3.5 text-cyan-400" />
                {t('aspectRatioLabel')}
              </span>
              <span>{aspectRatio}</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar.id}
                  type="button"
                  onClick={() => setAspectRatio(ar.id)}
                  className={`py-2 px-1 rounded-lg text-xs font-mono transition-all text-center ${
                    aspectRatio === ar.id
                      ? 'bg-indigo-600 text-white font-medium shadow-sm'
                      : 'bg-studio-850 text-studio-300 hover:text-white hover:bg-studio-800 border border-white/5'
                  }`}
                >
                  {ar.id}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-studio-400">
              {ASPECT_RATIOS.find(a => a.id === aspectRatio)?.description}
            </p>
          </div>

          {/* 3. Style Direction */}
          <div className="p-4 rounded-xl bg-studio-900 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-studio-400">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-studio-300">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                {t('styleLabel')}
              </span>
              <span>{style}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {STYLE_OPTIONS.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStyle(st.label)}
                  className={`py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all ${
                    style === st.label
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-studio-850 text-studio-300 hover:text-white hover:bg-studio-800 border border-white/5'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Target Video Model */}
          <div className="p-4 rounded-xl bg-studio-900 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-studio-400">
              <span className="flex items-center gap-1.5 uppercase font-semibold text-studio-300">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                {t('modelLabel')}
              </span>
              <span className="uppercase text-emerald-400">{model}</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {VIDEO_MODELS.map((vm) => (
                <button
                  key={vm.id}
                  type="button"
                  onClick={() => setModel(vm.id)}
                  className={`py-2 px-1 rounded-lg text-xs font-mono transition-all text-center ${
                    model === vm.id
                      ? 'bg-indigo-600 text-white font-medium shadow-sm'
                      : 'bg-studio-850 text-studio-300 hover:text-white hover:bg-studio-800 border border-white/5'
                  }`}
                >
                  {vm.name.split(' ')[0]}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-studio-400 truncate">
              {VIDEO_MODELS.find(m => m.id === model)?.tagline}
            </p>
          </div>
        </div>

        {/* Language Selection Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-studio-900 border border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono text-studio-300">
            <Languages className="w-4 h-4 text-studio-400" />
            <span>{t('languageLabel')}:</span>
          </div>

          <div className="flex items-center gap-2">
            {LANGUAGE_OPTIONS.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => setLanguage(lang.label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  language === lang.label
                    ? 'bg-studio-800 text-white border border-indigo-500/40 shadow-sm'
                    : 'bg-studio-950 text-studio-400 hover:text-white border border-white/5'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main CTA Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-studio-500 font-mono">
            {t('productionNotice')}
          </p>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isGenerating}
            icon={Sparkles}
            className="w-full sm:w-auto px-8 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-glow-indigo text-white font-semibold"
          >
            {t('generateConceptBtn')}
          </Button>
        </div>
      </form>
    </div>
  );
}
