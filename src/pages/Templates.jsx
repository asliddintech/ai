import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Clock, 
  Film, 
  Search, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { TEMPLATES, TEMPLATE_CATEGORIES } from '../data/templatesData';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function Templates() {
  const { generateNewProject, isGenerating, t } = useStudio();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = TEMPLATES.filter((tmpl) => {
    const matchesCategory = activeCategory === 'All' || tmpl.category === activeCategory;
    const matchesSearch = tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tmpl.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tmpl.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (tmpl) => {
    generateNewProject({
      idea: tmpl.promptIdea,
      duration: tmpl.duration,
      aspectRatio: tmpl.aspectRatio,
      style: tmpl.style,
      model: tmpl.model,
      language: 'English'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">{t('curatedLibraryBadge')}</span>
            <Badge variant="indigo" size="sm">10 Categories</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            {t('templatesHeaderTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-studio-400 mt-1">
            {t('templatesHeaderSub')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-studio-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchTemplatesPlaceholder')}
            className="w-full bg-studio-900 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-studio-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
          />
        </div>
      </div>

      {/* Categories Filter Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {TEMPLATE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'bg-studio-900 text-studio-400 hover:text-white hover:bg-studio-850 border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((tmpl) => (
          <div
            key={tmpl.id}
            className="group rounded-xl bg-studio-900 border border-white/10 hover:border-white/20 transition-all duration-200 overflow-hidden shadow-panel flex flex-col justify-between"
          >
            {/* Visual Top Preview Frame */}
            <div className={`h-28 bg-gradient-to-br ${tmpl.previewGradient} p-4 relative flex flex-col justify-between border-b border-white/5`}>
              <div className="absolute inset-0 bg-film-grid opacity-20" />
              
              <div className="flex items-center justify-between relative z-10">
                <Badge variant="cyan" size="sm">{tmpl.category}</Badge>
                <Badge variant="outline" size="sm">{tmpl.aspectRatio}</Badge>
              </div>

              <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-studio-400">
                <span>{tmpl.duration}</span>
                <span className="uppercase text-amber-300/80">{tmpl.model}</span>
              </div>
            </div>

            {/* Template Body */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-semibold text-white group-hover:text-indigo-200 transition-colors font-display">
                  {tmpl.name}
                </h3>
                <p className="text-xs text-studio-300 mt-1.5 leading-relaxed">
                  {tmpl.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {tmpl.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono text-studio-400 bg-studio-850 border border-white/5 px-2 py-0.5 rounded"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Meta & CTA */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                <div className="text-xs font-mono text-studio-400 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{tmpl.sceneCount} {t('scenesCountLabel')}</span>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isGenerating}
                  onClick={() => handleUseTemplate(tmpl)}
                  className="bg-studio-800 hover:bg-indigo-600 text-studio-200 hover:text-white border border-white/10 hover:border-indigo-500/30"
                >
                  <span>{t('useTemplateBtn')}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center rounded-xl bg-studio-900 border border-white/5">
          <p className="text-xs text-studio-400">{t('noTemplatesFound')}</p>
        </div>
      )}
    </div>
  );
}
