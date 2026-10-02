import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Edit3, 
  Sparkles, 
  Maximize2, 
  Camera, 
  Sun, 
  Wind, 
  Volume2, 
  Eye, 
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useStudio } from '../../context/StudioContext';
import { compileScenePrompt } from '../../utils/promptCompiler';

export function SceneCard({
  scene,
  index,
  model,
  onEdit,
  onRegenerate,
  onExpand
}) {
  const { t } = useStudio();
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const finalPrompt = scene.prompt || compileScenePrompt(scene, model);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(finalPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-studio-900/90 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 overflow-hidden shadow-panel">
      {/* Scene Header */}
      <div className="p-4 sm:p-5 border-b border-white/5 bg-studio-950/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Badge variant="indigo" size="sm">
            {t('sceneLabel')} {String(index + 1).padStart(2, '0')}
          </Badge>
          <span className="text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded">
            {scene.startTime} — {scene.endTime}
          </span>
          <h4 className="text-sm sm:text-base font-semibold text-white font-display ml-1">
            "{scene.title}"
          </h4>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            title={t('clickToCopy')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-mono bg-studio-800 hover:bg-studio-750 text-studio-200 hover:text-white border border-white/5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? t('copiedBtn') : t('copyBtn')}</span>
          </button>

          <button
            onClick={() => onEdit(index)}
            title="Edit scene parameters"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-mono bg-studio-800 hover:bg-studio-750 text-studio-200 hover:text-white border border-white/5 transition-all"
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">{t('editBtn')}</span>
          </button>

          <button
            onClick={() => onRegenerate(index)}
            title="Regenerate this scene direction"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-mono bg-studio-800 hover:bg-studio-750 text-studio-200 hover:text-white border border-white/5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{t('regenerateSceneBtn')}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse' : 'Expand full details'}
            className="p-1.5 rounded-md text-studio-400 hover:text-white hover:bg-white/5 border border-transparent transition-all"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* Narrative Action Description */}
        <p className="text-xs sm:text-sm text-studio-200 leading-relaxed font-normal">
          {scene.description}
        </p>

        {/* Structured Production Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {/* Subject */}
          <div className="p-3 rounded-lg bg-studio-950/70 border border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-studio-400 block mb-1">
              {t('subjectLabel')}
            </span>
            <p className="text-xs text-studio-200 leading-relaxed font-mono">
              {scene.subject}
            </p>
          </div>

          {/* Environment */}
          <div className="p-3 rounded-lg bg-studio-950/70 border border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-studio-400 block mb-1">
              {t('environmentLabel')}
            </span>
            <p className="text-xs text-studio-200 leading-relaxed font-mono">
              {scene.environment}
            </p>
          </div>

          {/* Camera & Lens */}
          <div className="p-3 rounded-lg bg-studio-950/70 border border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block mb-1 flex items-center gap-1.5">
              <Camera className="w-3 h-3" />
              {t('cameraLensLabel')}
            </span>
            <p className="text-xs text-studio-200 leading-relaxed font-mono">
              <span className="text-white font-semibold">{scene.camera}</span> • {scene.lens}
            </p>
            {scene.composition && (
              <span className="text-[10px] text-studio-400 block mt-1 font-mono">
                Comp: {scene.composition}
              </span>
            )}
          </div>

          {/* Lighting */}
          <div className="p-3 rounded-lg bg-studio-950/70 border border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block mb-1 flex items-center gap-1.5">
              <Sun className="w-3 h-3" />
              {t('lightingColorLabel')}
            </span>
            <p className="text-xs text-studio-200 leading-relaxed font-mono">
              {scene.lighting}
            </p>
            {scene.color && (
              <span className="text-[10px] text-amber-300/80 block mt-1 font-mono">
                Grade: {scene.color}
              </span>
            )}
          </div>
        </div>

        {/* Collapsible Deep Cinematography Specs */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 animate-in fade-in duration-200">
            {/* Motion */}
            <div className="p-3 rounded-lg bg-studio-950/70 border border-white/5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-studio-400 block mb-1">
                {t('motionDynamicsLabel')}
              </span>
              <p className="text-xs text-studio-300 font-mono leading-relaxed">
                {scene.motion}
              </p>
            </div>

            {/* Atmosphere */}
            <div className="p-3 rounded-lg bg-studio-950/70 border border-white/5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-studio-400 block mb-1 flex items-center gap-1">
                <Wind className="w-3 h-3 text-cyan-400" />
                {t('atmosphereParticlesLabel')}
              </span>
              <p className="text-xs text-studio-300 font-mono leading-relaxed">
                {scene.atmosphere}
              </p>
            </div>

            {/* Audio Direction */}
            <div className="p-3 rounded-lg bg-studio-950/70 border border-white/5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-studio-400 block mb-1 flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-indigo-400" />
                {t('audioDirectionLabel')}
              </span>
              <p className="text-xs text-studio-300 font-mono leading-relaxed">
                {scene.audio}
              </p>
            </div>
          </div>
        )}

        {/* Final Optimized Prompt Banner */}
        <div className="mt-3 p-3.5 rounded-lg bg-studio-950 border border-indigo-500/20 relative group">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-indigo-300 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              {t('finalOptimizedPromptLabel')} ({model?.toUpperCase()})
            </span>
            <span className="text-studio-500">{t('clickToCopy')}</span>
          </div>

          <p 
            onClick={handleCopy}
            className="text-xs font-mono text-studio-100 leading-relaxed cursor-pointer hover:text-white transition-colors select-all"
          >
            "{finalPrompt}"
          </p>

          {scene.negativePrompt && isExpanded && (
            <div className="mt-2 pt-2 border-t border-white/5 text-[11px] font-mono text-red-300/80">
              <span className="text-[10px] uppercase text-studio-500 block">{t('negativePromptLabel')}</span>
              --no {scene.negativePrompt}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
