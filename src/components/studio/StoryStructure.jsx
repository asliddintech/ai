import React from 'react';
import { GitBranch, Clock, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useStudio } from '../../context/StudioContext';

export function StoryStructure({ storyStructure }) {
  const { t } = useStudio();
  if (!storyStructure || !storyStructure.length) return null;

  return (
    <div className="bg-studio-900/90 rounded-xl border border-white/10 p-5 shadow-panel">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="cyan" size="sm" icon={GitBranch}>
            {t('storyStructureBadge')}
          </Badge>
          <span className="text-xs font-mono text-studio-400">{t('storyProgressionSub')}</span>
        </div>
      </div>

      {/* Grid of Story Progression Beats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 relative">
        {storyStructure.map((item, index) => (
          <div
            key={index}
            className="p-3.5 rounded-lg bg-studio-950/70 border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                <span className="text-indigo-400 font-semibold">{item.act}</span>
                <span className="text-studio-400 bg-studio-900 px-1.5 py-0.5 rounded border border-white/5">
                  {item.timecode}
                </span>
              </div>
              <p className="text-xs text-studio-300 leading-relaxed group-hover:text-studio-100 transition-colors">
                {item.beat}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-studio-500">
              <span>BEAT 0{index + 1}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 group-hover:bg-cyan-400 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
