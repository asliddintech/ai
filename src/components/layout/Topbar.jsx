import React, { useState } from 'react';
import { 
  Menu, 
  Share2, 
  Sparkles, 
  Download, 
  Check, 
  Code2, 
  SlidersHorizontal, 
  Play, 
  ChevronDown,
  Layers,
  Edit2
} from 'lucide-react';
import { Button } from '../ui/Button';
import { LanguageToggle } from '../ui/LanguageToggle';
import { VIDEO_MODELS } from '../../data/modelPresets';
import { Send, User } from 'lucide-react';

export function Topbar({ setMobileOpen }) {
  const { 
    currentView, 
    currentProject, 
    renameProject, 
    changeProjectModel,
    setExportModalOpen, 
    setPromptEditorOpen,
    setVisualizerOpen,
    generateNewProject,
    addToast,
    user,
    telegramUser,
    setAuthModalOpen,
    setCabinetModalOpen,
    t
  } = useStudio();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(currentProject?.title || '');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (titleInput.trim() && currentProject) {
      renameProject(currentProject.id, titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  const activeModelObj = VIDEO_MODELS.find(m => m.id === currentProject?.model) || VIDEO_MODELS[0];

  return (
    <header className="h-14 border-b border-white/[0.07] bg-studio-950/80 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile hamburger & Project Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-lg text-studio-400 hover:text-white hover:bg-white/5 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {currentView === 'studio' && currentProject ? (
          <div className="flex items-center gap-2 min-w-0">
            {isEditingTitle ? (
              <form onSubmit={handleTitleSubmit} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  autoFocus
                  onBlur={handleTitleSubmit}
                  className="bg-studio-850 border border-indigo-500/50 rounded px-2 py-0.5 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button type="submit" className="p-1 text-emerald-400 hover:text-emerald-300">
                  <Check className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div 
                onClick={() => { setTitleInput(currentProject.title); setIsEditingTitle(true); }}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <h2 className="text-sm font-semibold text-white tracking-tight truncate max-w-[200px] sm:max-w-xs md:max-w-md group-hover:text-indigo-300 transition-colors">
                  {currentProject.title}
                </h2>
                <Edit2 className="w-3 h-3 text-studio-500 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}

            {/* Autosave badge */}
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400/90 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {t('autosaved')}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-studio-400 uppercase tracking-widest">
              {currentView.toUpperCase().replace('-', ' ')}
            </span>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Prominent Language Switcher */}
        <LanguageToggle variant="pill" />

        {/* Telegram Auth / Shaxsiy Kabinet Button */}
        {telegramUser ? (
          <button
            onClick={() => setCabinetModalOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-studio-900 border border-white/10 hover:border-indigo-500/40 text-xs text-white transition-all group"
            title="Shaxsiy Kabinet"
          >
            <div className="relative">
              <img
                src={telegramUser.avatarUrl || user.avatarUrl}
                alt={telegramUser.fullName || user.name}
                className="w-6 h-6 rounded-full object-cover border border-indigo-400/30"
              />
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 ring-1 ring-studio-950" />
            </div>
            <span className="font-medium text-xs truncate max-w-[100px] sm:max-w-[130px] hidden sm:inline">
              {telegramUser.fullName || user.name}
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.5 rounded hidden md:inline">
              Kabinet
            </span>
          </button>
        ) : (
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#229ED9]/15 hover:bg-[#229ED9]/25 border border-[#229ED9]/40 text-xs text-[#229ED9] hover:text-white font-medium transition-all shadow-sm group active:scale-95"
            title="Telegram orqali kirish"
          >
            <Send className="w-3.5 h-3.5 group-hover:scale-110 transition-transform -translate-x-0.5" />
            <span className="hidden sm:inline">Telegram Kirish</span>
            <span className="sm:hidden">Kirish</span>
          </button>
        )}

        {currentView === 'studio' && currentProject && (
          <>
            {/* Target Model Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                className="flex items-center gap-1.5 text-xs font-mono bg-studio-900 border border-white/10 hover:border-white/20 px-2.5 py-1.5 rounded-md text-studio-200 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>{activeModelObj.name}</span>
                <ChevronDown className="w-3 h-3 text-studio-400 ml-0.5" />
              </button>

              {modelDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setModelDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-1.5 w-60 bg-studio-900 border border-white/10 rounded-lg shadow-2xl py-1 z-40 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-studio-400 border-b border-white/5">
                      {t('targetEngine')}
                    </div>
                    {VIDEO_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          changeProjectModel(model.id);
                          setModelDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-white/5 transition-colors ${
                          currentProject.model === model.id ? 'bg-indigo-950/40 text-indigo-300 font-medium' : 'text-studio-200'
                        }`}
                      >
                        <span className="font-semibold">{model.name}</span>
                        <span className="text-[10px] text-studio-400 leading-tight">{model.tagline}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Visualizer Simulation Button */}
            <Button
              variant="secondary"
              size="sm"
              icon={Play}
              onClick={() => setVisualizerOpen(true)}
              className="hidden sm:inline-flex"
            >
              {t('previewSimulate')}
            </Button>

            {/* Dedicated Prompt Editor Trigger */}
            <Button
              variant="secondary"
              size="sm"
              icon={Code2}
              onClick={() => setPromptEditorOpen(true)}
              className="hidden md:inline-flex"
            >
              {t('promptCode')}
            </Button>

            {/* Export Button */}
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={() => setExportModalOpen(true)}
            >
              {t('exportBtn')}
            </Button>

            {/* Regenerate Concept Button */}
            <Button
              variant="primary"
              size="sm"
              icon={Sparkles}
              onClick={() => {
                generateNewProject({
                  idea: currentProject.idea,
                  duration: currentProject.duration,
                  aspectRatio: currentProject.aspectRatio,
                  style: currentProject.style,
                  model: currentProject.model,
                  language: currentProject.language
                });
              }}
              className="bg-indigo-600 hover:bg-indigo-500 shadow-glow-indigo/50 text-white"
            >
              <span className="hidden sm:inline">{t('regenerateBtn')}</span>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
