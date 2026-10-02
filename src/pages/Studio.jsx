import React, { useState } from 'react';
import { 
  Plus, 
  Layers, 
  Sliders, 
  Code2, 
  Share2, 
  Sparkles, 
  ChevronRight, 
  Film, 
  Cpu, 
  Camera, 
  Sun, 
  RefreshCw, 
  Download,
  Eye,
  PanelRightClose,
  PanelRightOpen,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { ConceptCard } from '../components/studio/ConceptCard';
import { StoryStructure } from '../components/studio/StoryStructure';
import { TimelineView } from '../components/studio/TimelineView';
import { SceneCard } from '../components/scenes/SceneCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { VIDEO_MODELS } from '../data/modelPresets';

export function Studio() {
  const { 
    currentProject, 
    selectedSceneIndex, 
    setSelectedSceneIndex,
    setEditingSceneIndex, 
    setSceneEditorOpen,
    regenerateSingleScene,
    changeProjectModel,
    setExportModalOpen,
    setPromptEditorOpen,
    setVisualizerOpen,
    navigateTo,
    t
  } = useStudio();

  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  if (!currentProject) {
    return (
      <div className="p-8 text-center max-w-md mx-auto min-h-[60vh] flex flex-col items-center justify-center">
        <Film className="w-12 h-12 text-studio-600 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2 font-display">{t('noProjectsYet')}</h3>
        <p className="text-xs text-studio-400 mb-6 leading-relaxed">
          {t('noProjectsDesc')}
        </p>
        <Button variant="primary" onClick={() => navigateTo('new-project')}>
          {t('newProject')}
        </Button>
      </div>
    );
  }

  const scenes = currentProject.scenes || [];
  const currentScene = scenes[selectedSceneIndex] || scenes[0];

  const handleEditScene = (idx) => {
    setEditingSceneIndex(idx);
    setSceneEditorOpen(true);
  };

  const handleRegenerateScene = (idx) => {
    regenerateSingleScene(idx);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden bg-studio-950">
      {/* LEFT: Project Navigation & Scenes Tree (Collapsible) */}
      <div className={`
        ${leftPanelOpen ? 'w-64' : 'w-0'} 
        hidden xl:flex flex-col border-r border-white/[0.07] bg-studio-950/80 transition-all duration-300 overflow-hidden shrink-0
      `}>
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-studio-400 font-semibold tracking-wider flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-indigo-400" />
            {t('shotCoverage')}
          </span>
          <span className="text-[10px] font-mono text-studio-500 bg-studio-900 px-1.5 py-0.5 rounded border border-white/5">
            {scenes.length} {t('scenesCountLabel')}
          </span>
        </div>

        {/* Scene Tree List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {scenes.map((scene, idx) => {
            const isSelected = selectedSceneIndex === idx;
            return (
              <button
                key={scene.id || idx}
                onClick={() => {
                  setSelectedSceneIndex(idx);
                  const el = document.getElementById(`scene-card-${idx}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition-all flex items-center justify-between group ${
                  isSelected 
                    ? 'bg-studio-850 text-white border border-indigo-500/30 shadow-sm' 
                    : 'text-studio-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`text-[10px] font-semibold ${isSelected ? 'text-indigo-400' : 'text-studio-500'}`}>
                      SCENE 0{idx + 1}
                    </span>
                    <span className="text-[9px] text-studio-600">{scene.startTime}</span>
                  </div>
                  <p className="truncate text-xs font-sans text-studio-200">
                    {scene.title}
                  </p>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isSelected ? 'text-indigo-400 translate-x-0.5' : 'text-studio-600 group-hover:text-studio-400'}`} />
              </button>
            );
          })}
        </div>

        {/* Project Meta Footer */}
        <div className="p-3 border-t border-white/5 bg-studio-900/40 text-[11px] font-mono text-studio-400 space-y-1">
          <div className="flex justify-between">
            <span>Duration:</span>
            <span className="text-white">{currentProject.duration}</span>
          </div>
          <div className="flex justify-between">
            <span>Aspect Ratio:</span>
            <span className="text-cyan-300">{currentProject.aspectRatio}</span>
          </div>
          <div className="flex justify-between">
            <span>Target Engine:</span>
            <span className="text-amber-300 uppercase">{currentProject.model}</span>
          </div>
        </div>
      </div>

      {/* CENTER: Creative Workspace (Main scrollable canvas) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 min-w-0">
        {/* Toggle Left/Right Panel Buttons on medium screens */}
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.04] text-xs font-mono text-studio-400">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLeftPanelOpen(!leftPanelOpen)}
              className="hidden xl:flex items-center gap-1 text-studio-400 hover:text-white px-2 py-1 rounded bg-studio-900 border border-white/5"
            >
              {leftPanelOpen ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
              <span>{leftPanelOpen ? t('collapseTree') : t('showTree')}</span>
            </button>
            <span className="text-studio-500 hidden sm:inline">•</span>
            <span className="text-studio-300">{t('productionWorkspace')}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setVisualizerOpen(true)}
              className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1 rounded-md hover:bg-cyan-900/40 transition-colors"
            >
              <Eye className="w-3 h-3" />
              <span>{t('simulateTimeline')}</span>
            </button>
            <button
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className="hidden lg:flex items-center gap-1 text-studio-400 hover:text-white px-2 py-1 rounded bg-studio-900 border border-white/5"
            >
              {rightPanelOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
              <span>{rightPanelOpen ? t('hideControls') : t('showControls')}</span>
            </button>
          </div>
        </div>

        {/* 1. CREATIVE CONCEPT */}
        <ConceptCard
          concept={currentProject.concept}
          style={currentProject.style}
          model={currentProject.model}
          duration={currentProject.duration}
          aspectRatio={currentProject.aspectRatio}
        />

        {/* 2. STORY STRUCTURE */}
        <StoryStructure storyStructure={currentProject.storyStructure} />

        {/* 3. TIMELINE VIEW */}
        <TimelineView
          scenes={scenes}
          activeIndex={selectedSceneIndex}
          onSelectScene={(idx) => {
            setSelectedSceneIndex(idx);
            const el = document.getElementById(`scene-card-${idx}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
        />

        {/* 4. SCENE CARDS LIST */}
        <div className="space-y-5 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="indigo" size="sm">
                {t('sceneBreakdownBadge')}
              </Badge>
              <span className="text-xs font-mono text-studio-400">
                {scenes.length} {t('productionCutCards')}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={Code2}
              onClick={() => setPromptEditorOpen(true)}
            >
              {t('openSystematicCodeEditor')}
            </Button>
          </div>

          {scenes.map((scene, index) => (
            <div key={scene.id || index} id={`scene-card-${index}`}>
              <SceneCard
                scene={scene}
                index={index}
                model={currentProject.model}
                onEdit={handleEditScene}
                onRegenerate={handleRegenerateScene}
                onExpand={() => handleEditScene(index)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: AI Generation Controls & Quick Inspector (Collapsible) */}
      <div className={`
        ${rightPanelOpen ? 'w-80' : 'w-0'}
        hidden lg:flex flex-col border-l border-white/[0.07] bg-studio-950/80 transition-all duration-300 overflow-hidden shrink-0
      `}>
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-studio-400 font-semibold tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            {t('aiProductionSuite')}
          </span>
          <Badge variant="cyan" size="sm">{t('live')}</Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Active Model Selector */}
          <div className="p-3.5 rounded-xl bg-studio-900 border border-white/10 space-y-2">
            <label className="text-xs font-mono text-studio-400 uppercase block">
              {t('generativeEngine')}
            </label>
            <select
              value={currentProject.model}
              onChange={(e) => changeProjectModel(e.target.value)}
              className="w-full bg-studio-850 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {VIDEO_MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.tagline.slice(0, 20)}...)</option>
              ))}
            </select>
            <p className="text-[10px] text-studio-400 leading-normal">
              {t('changingModelNotice')}
            </p>
          </div>

          {/* Quick Scene Inspector */}
          {currentScene && (
            <div className="p-3.5 rounded-xl bg-studio-900 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-indigo-400">
                  {t('sceneLabel')} 0{selectedSceneIndex + 1} {t('sceneInspector')}
                </span>
                <span className="text-[10px] font-mono text-studio-500">
                  {currentScene.startTime}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2 rounded bg-studio-950 border border-white/5">
                  <span className="text-[10px] text-studio-500 uppercase block">{t('cameraMovementLabel')}</span>
                  <span className="text-studio-200 text-xs truncate block">{currentScene.camera}</span>
                </div>
                <div className="p-2 rounded bg-studio-950 border border-white/5">
                  <span className="text-[10px] text-studio-500 uppercase block">{t('opticalLensLabel')}</span>
                  <span className="text-studio-200 text-xs truncate block">{currentScene.lens}</span>
                </div>
                <div className="p-2 rounded bg-studio-950 border border-white/5">
                  <span className="text-[10px] text-studio-500 uppercase block">{t('lightingTreatmentLabel')}</span>
                  <span className="text-amber-300 text-xs truncate block">{currentScene.lighting}</span>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs"
                onClick={() => handleEditScene(selectedSceneIndex)}
              >
                {t('openFullSceneEditor')}
              </Button>
            </div>
          )}

          {/* Direct Actions Group */}
          <div className="p-3.5 rounded-xl bg-studio-900 border border-white/10 space-y-2.5">
            <span className="text-[10px] font-mono uppercase text-studio-400 block">
              {t('productionActions')}
            </span>

            <Button
              variant="outline"
              size="sm"
              icon={Share2}
              className="w-full justify-start text-xs font-mono"
              onClick={() => setExportModalOpen(true)}
            >
              {t('exportProductionBundle')}
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={Code2}
              className="w-full justify-start text-xs font-mono"
              onClick={() => setPromptEditorOpen(true)}
            >
              {t('openTokenEditor')}
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={Eye}
              className="w-full justify-start text-xs font-mono"
              onClick={() => setVisualizerOpen(true)}
            >
              {t('storyboardSimulation')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
