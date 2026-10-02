import React from 'react';
import { 
  Plus, 
  Film, 
  Clock, 
  Layers, 
  Sparkles, 
  Tv, 
  Music, 
  Smartphone, 
  BookOpen, 
  Cpu, 
  TrendingUp, 
  ArrowUpRight,
  Play
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function Dashboard() {
  const { projects, openProject, navigateTo, generateNewProject, t } = useStudio();

  // Quick Start Presets
  const quickStartTemplates = [
    {
      id: 'qs-film',
      title: t('qsFilmTitle'),
      desc: t('qsFilmDesc'),
      icon: Film,
      color: 'from-indigo-600/20 to-purple-900/40',
      badge: '2.39:1',
      defaultIdea: 'A solitary astronaut discovering an illuminated alien monolith deep inside frozen planetary caves.',
      style: 'Cinematic',
      duration: '30 sec'
    },
    {
      id: 'qs-commercial',
      title: t('qsCommercialTitle'),
      desc: t('qsCommercialDesc'),
      icon: Tv,
      color: 'from-amber-600/20 to-yellow-900/40',
      badge: '16:9',
      defaultIdea: 'Macro probe lens moving through intricate sapphire gears and titanium casing of an ultra-luxury mechanical watch.',
      style: 'Commercial',
      duration: '10 sec'
    },
    {
      id: 'qs-tech',
      title: t('qsTechTitle'),
      desc: t('qsTechDesc'),
      icon: Cpu,
      color: 'from-cyan-600/20 to-blue-900/40',
      badge: '4K Veo',
      defaultIdea: 'An AI engineer building a futuristic application in Tashkent at night with illuminated minarets and autonomous drones.',
      style: 'Sci-Fi',
      duration: '30 sec'
    },
    {
      id: 'qs-social',
      title: t('qsSocialTitle'),
      desc: t('qsSocialDesc'),
      icon: Smartphone,
      color: 'from-pink-600/20 to-rose-900/40',
      badge: '9:16',
      defaultIdea: 'High-energy streetwear dancer executing acrobatics on neon Tokyo crosswalk with rapid whip pans.',
      style: 'Photorealistic',
      duration: '10 sec'
    },
    {
      id: 'qs-story',
      title: t('qsStoryTitle'),
      desc: t('qsStoryDesc'),
      icon: BookOpen,
      color: 'from-emerald-600/20 to-teal-900/40',
      badge: 'Narrative',
      defaultIdea: 'An elderly craftsman restoring ancient mosaic ceramics at dawn inside a sun-drenched Samarkand courtyard.',
      style: 'Documentary',
      duration: '30 sec'
    },
    {
      id: 'qs-music',
      title: t('qsMusicTitle'),
      desc: t('qsMusicDesc'),
      icon: Music,
      color: 'from-fuchsia-600/20 to-indigo-900/40',
      badge: 'Stylized',
      defaultIdea: 'Synthwave electronic musician surrounded by glowing analog modular synths and laser beam fog in an underground vault.',
      style: 'Cinematic',
      duration: '20 sec'
    }
  ];

  const handleQuickStart = (item) => {
    generateNewProject({
      idea: item.defaultIdea,
      duration: item.duration,
      aspectRatio: item.badge === '9:16' ? '9:16' : item.badge === '2.39:1' ? '2.39:1' : '16:9',
      style: item.style,
      model: 'veo',
      language: 'English'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            {t('greetingHeader')}
          </h1>
          <p className="text-xs sm:text-sm text-studio-400 mt-1">
            {t('greetingSubtitle')}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => navigateTo('new-project')}
          className="shadow-glow-indigo/50"
        >
          {t('newProject')}
        </Button>
      </div>

      {/* QUICK START SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-studio-400 font-semibold tracking-wider">
              {t('quickStartTitle')}
            </span>
            <span className="text-[10px] text-studio-500 font-mono">{t('quickStartDesc')}</span>
          </div>
          <button
            onClick={() => navigateTo('templates')}
            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <span>{t('viewAllTemplates')}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {quickStartTemplates.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => handleQuickStart(item)}
                className="group p-4 rounded-xl bg-studio-900 border border-white/5 hover:border-white/20 hover:bg-studio-850 cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between"
              >
                {/* Subtle Gradient Accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} rounded-full blur-2xl pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity`} />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-studio-800 border border-white/10 flex items-center justify-center text-studio-200 group-hover:text-indigo-400 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <Badge variant="outline" size="sm">{item.badge}</Badge>
                  </div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-indigo-200 transition-colors font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs text-studio-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-studio-500 group-hover:text-studio-300">
                  <span>{item.duration} • {item.style}</span>
                  <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform">{t('startArrow')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECENT PROJECTS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-studio-400 font-semibold tracking-wider">
              {t('recentProjectsTitle')}
            </span>
            <span className="text-[10px] text-studio-500 font-mono">
              ({projects.length} {t('scenesCountLabel')})
            </span>
          </div>

          <button
            onClick={() => navigateTo('history')}
            className="text-xs font-mono text-studio-400 hover:text-white transition-colors"
          >
            {t('allProjectsHistory')}
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-studio-900 border border-white/5">
            <Film className="w-10 h-10 text-studio-600 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-white mb-1">{t('noProjectsYet')}</h4>
            <p className="text-xs text-studio-400 mb-4">{t('noProjectsDesc')}</p>
            <Button variant="primary" size="sm" onClick={() => navigateTo('new-project')}>
              {t('newProject')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((proj) => {
              const sceneCount = proj.scenes?.length || 0;
              const dateStr = new Date(proj.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              });

              return (
                <div
                  key={proj.id}
                  onClick={() => openProject(proj.id)}
                  className="group rounded-xl bg-studio-900 border border-white/10 hover:border-white/20 hover:bg-studio-850 transition-all duration-200 overflow-hidden cursor-pointer shadow-panel flex flex-col justify-between"
                >
                  {/* Visual Placeholder / Film Slate Header */}
                  <div className="h-32 bg-gradient-to-br from-studio-950 via-studio-900 to-studio-850 p-4 relative flex flex-col justify-between border-b border-white/5 overflow-hidden">
                    <div className="absolute inset-0 bg-film-grid opacity-25" />
                    <div className="absolute top-2 right-2 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all" />

                    <div className="flex items-center justify-between relative z-10">
                      <Badge variant="cyan" size="sm">{proj.aspectRatio}</Badge>
                      <Badge 
                        variant={proj.status === 'Generated' ? 'emerald' : 'outline'} 
                        size="sm"
                      >
                        {proj.status || 'Generated'}
                      </Badge>
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-studio-400">
                      <span className="uppercase text-amber-300/80">{proj.model?.toUpperCase()}</span>
                      <span>{dateStr}</span>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-indigo-200 transition-colors font-display line-clamp-1">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-studio-400 mt-1 line-clamp-2 leading-relaxed font-sans">
                        {proj.idea}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs font-mono text-studio-400">
                      <span className="flex items-center gap-1.5">
                        <Film className="w-3.5 h-3.5 text-indigo-400" />
                        {sceneCount} Scenes
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-studio-500" />
                        {proj.duration}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
