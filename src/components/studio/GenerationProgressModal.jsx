import React from 'react';
import { CheckCircle2, Loader2, Sparkles, Film, Terminal } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { AI_GENERATION_STEPS } from '../../services/aiService';

export function GenerationProgressModal() {
  const { isGenerating, generationStep, generationLogs, t } = useStudio();

  if (!isGenerating) return null;

  const getStepLabel = (stepId, fallback) => {
    switch(stepId) {
      case 'analyze': return { label: t('stepAnalyzing'), detail: t('stepAnalyzingDetail') };
      case 'story': return { label: t('stepStory'), detail: t('stepStoryDetail') };
      case 'scenes': return { label: t('stepScenes'), detail: t('stepScenesDetail') };
      case 'cinematography': return { label: t('stepCinematography'), detail: t('stepCinematographyDetail') };
      case 'optimize': return { label: t('stepOptimize'), detail: t('stepOptimizeDetail') };
      default: return { label: fallback.label, detail: fallback.detail };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-studio-900 border border-white/15 rounded-xl shadow-2xl overflow-hidden p-6 relative">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 animate-pulse" />

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-indigo-950/70 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">{t('aiEngineTitle')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <h3 className="text-base font-semibold text-white font-display">
              {t('synthesizingTitle')}
            </h3>
          </div>
        </div>

        {/* Steps Progression */}
        <div className="space-y-3.5 mb-6">
          {AI_GENERATION_STEPS.map((step, index) => {
            const isCompleted = generationStep > index;
            const isCurrent = generationStep === index;
            const isPending = generationStep < index;
            const stepInfo = getStepLabel(step.id, step);

            return (
              <div
                key={step.id}
                className={`flex items-start gap-3.5 p-3 rounded-lg border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-indigo-950/30 border-indigo-500/40 shadow-inner-light'
                    : isCompleted
                    ? 'bg-studio-850/60 border-white/5 opacity-80'
                    : 'bg-studio-950/30 border-white/[0.03] opacity-40'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-cyan-300 flex items-center justify-center border border-cyan-400/30">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-studio-800 text-studio-500 flex items-center justify-center border border-white/5 text-[10px] font-mono">
                      {index + 1}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-semibold tracking-wider ${
                      isCurrent ? 'text-cyan-300' : isCompleted ? 'text-studio-200' : 'text-studio-400'
                    }`}>
                      {stepInfo.label}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] font-mono text-emerald-400">{t('completedBadge')}</span>
                    )}
                    {isCurrent && (
                      <span className="text-[10px] font-mono text-cyan-400 animate-pulse">{t('processingBadge')}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-studio-400 mt-0.5 truncate">
                    {stepInfo.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Terminal / Generation Log Output */}
        <div className="bg-studio-950 border border-white/10 rounded-lg p-3">
          <div className="flex items-center justify-between text-[10px] font-mono text-studio-400 mb-1.5 pb-1 border-b border-white/5">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-studio-400" />
              {t('engineLog')}
            </span>
            <span>{t('tokenStream')}</span>
          </div>
          <div className="max-h-20 overflow-y-auto font-mono text-[11px] text-studio-300 space-y-1">
            {generationLogs.map((log, idx) => (
              <div key={idx} className="flex gap-2 leading-relaxed">
                <span className="text-studio-500 select-none">&gt;</span>
                <span className="text-studio-300">{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
