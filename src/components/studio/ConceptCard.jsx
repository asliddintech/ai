import React from 'react';
import { Sparkles, Palette, Compass, Film, Tag } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useStudio } from '../../context/StudioContext';

export function ConceptCard({ concept, style, model, duration, aspectRatio }) {
  const { t } = useStudio();
  if (!concept) return null;

  return (
    <div className="bg-studio-900/90 rounded-xl border border-white/10 p-6 shadow-panel relative overflow-hidden">
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="indigo" size="sm" icon={Sparkles}>
            {t('creativeConceptBadge')}
          </Badge>
          <Badge variant="outline" size="sm">
            {duration}
          </Badge>
          <Badge variant="cyan" size="sm">
            {aspectRatio}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-studio-400 uppercase">{t('engineLabel')}</span>
          <Badge variant="amber" size="sm">
            {model?.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Title & Logline */}
      <div className="mb-5">
        <h3 className="text-xl font-bold text-white tracking-tight font-display mb-2">
          {concept.title}
        </h3>
        <p className="text-xs sm:text-sm text-studio-300 leading-relaxed font-normal">
          {concept.logline}
        </p>
      </div>

      {/* Visual Direction & Mood Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
        <div className="p-3.5 rounded-lg bg-studio-950/60 border border-white/5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-1.5">
            <Compass className="w-3.5 h-3.5" />
            {t('visualDirection')}
          </span>
          <p className="text-xs text-studio-200 leading-relaxed">
            {concept.visualDirection}
          </p>
        </div>

        <div className="p-3.5 rounded-lg bg-studio-950/60 border border-white/5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-1.5">
            <Film className="w-3.5 h-3.5" />
            {t('atmosphericMood')}
          </span>
          <p className="text-xs text-studio-200 leading-relaxed">
            {concept.mood}
          </p>
        </div>
      </div>

      {/* Color Palette & Style Tags Footer */}
      <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
        {/* Color Swatches */}
        {concept.colorPalette && (
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono uppercase text-studio-400 flex items-center gap-1">
              <Palette className="w-3 h-3 text-studio-400" />
              {t('colorPalette')}
            </span>
            <div className="flex items-center gap-1.5">
              {concept.colorPalette.map((color, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-md border border-white/20 shadow-sm relative group cursor-pointer"
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black text-[9px] font-mono text-white px-1 py-0.5 rounded whitespace-nowrap z-10 border border-white/10">
                    {color}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Style Badges */}
        {concept.styleTags && (
          <div className="flex flex-wrap items-center gap-1.5">
            {concept.styleTags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono text-studio-300 bg-studio-800/80 border border-white/5 px-2 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
