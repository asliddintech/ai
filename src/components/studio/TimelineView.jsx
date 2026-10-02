import React from 'react';
import { Film, Play, Clock, Sparkles } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export function TimelineView({ scenes = [], activeIndex = 0, onSelectScene }) {
  const { t } = useStudio();
  if (!scenes.length) return null;

  return (
    <div className="bg-studio-900/90 rounded-xl border border-white/10 p-4 shadow-panel">
      <div className="flex items-center justify-between mb-3 text-xs font-mono text-studio-400">
        <span className="flex items-center gap-1.5 uppercase text-studio-300">
          <Film className="w-3.5 h-3.5 text-indigo-400" />
          {t('cinematicTimelineTrack')}
        </span>
        <span className="flex items-center gap-1 text-studio-400">
          <Clock className="w-3 h-3" />
          {scenes.length} {t('masterCuts')}
        </span>
      </div>

      {/* Horizontal Visual Sequence Blocks */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {scenes.map((scene, idx) => {
          const isActive = activeIndex === idx;
          return (
            <button
              key={scene.id || idx}
              onClick={() => onSelectScene(idx)}
              className={`flex-1 min-w-[130px] sm:min-w-[150px] p-2.5 rounded-lg border text-left transition-all group ${
                isActive
                  ? 'bg-indigo-950/70 border-indigo-500/50 shadow-inner-light'
                  : 'bg-studio-950/70 border-white/5 hover:border-white/15 hover:bg-studio-850'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className={`font-semibold ${isActive ? 'text-indigo-300' : 'text-studio-400'}`}>
                  CUT 0{idx + 1}
                </span>
                <span className="text-studio-500">{scene.startTime}</span>
              </div>
              <p className={`text-xs font-medium truncate ${isActive ? 'text-white' : 'text-studio-300 group-hover:text-white'}`}>
                {scene.title}
              </p>
              <div className="mt-2 h-1 w-full bg-studio-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    isActive ? 'bg-cyan-400 w-full' : 'bg-studio-700 w-1/3 group-hover:w-full'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
