import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Camera, 
  Maximize2,
  Film,
  Sparkles,
  Disc
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useStudio } from '../../context/StudioContext';

export function VisualizerModal({ isOpen, onClose }) {
  const { currentProject, t } = useStudio();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const scenes = currentProject?.scenes || [];
  const currentScene = scenes[activeIdx];

  // Auto-play preview simulation
  useEffect(() => {
    let timer;
    if (isPlaying && scenes.length > 0) {
      timer = setInterval(() => {
        setActiveIdx((prev) => (prev + 1) % scenes.length);
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, scenes.length]);

  if (!currentProject || !currentScene) return null;

  const nextScene = () => {
    setActiveIdx((prev) => (prev + 1) % scenes.length);
  };

  const prevScene = () => {
    setActiveIdx((prev) => (prev - 1 + scenes.length) % scenes.length);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('storyboardModalTitle')}
      subtitle={`Sequence playback for "${currentProject.title}" • Target: ${currentProject.model?.toUpperCase()}`}
      maxWidth="max-w-5xl"
    >
      {/* Viewport Frame */}
      <div className="relative w-full bg-black rounded-lg overflow-hidden border border-white/10 shadow-2xl">
        {/* Aspect Ratio Box */}
        <div className={`w-full relative flex items-center justify-center min-h-[360px] sm:min-h-[440px] ${
          currentProject.aspectRatio === '2.39:1' ? 'aspect-[2.39/1]' :
          currentProject.aspectRatio === '9:16' ? 'max-w-xs mx-auto aspect-[9/16]' : 'aspect-video'
        } bg-gradient-to-b from-studio-950 via-studio-900 to-black`}>

          {/* Abstract Cinematic Lighting Simulator Background */}
          <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-600/30 blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-indigo-600/25 blur-[120px]" />
            <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-amber-500/20 blur-[90px]" />
          </div>

          {/* Subtle Grid & Film Grain Overlay */}
          <div className="absolute inset-0 bg-film-grid opacity-20 pointer-events-none" />

          {/* HUD Display (Cinematic Camera Overlays) */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-white/70 select-none z-10">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                {t('recIndicator')}
              </span>
              <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-white">
                {t('sceneLabel')} {String(activeIdx + 1).padStart(2, '0')} / {String(scenes.length).padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-cyan-400 bg-black/60 px-2 py-0.5 rounded border border-white/10">
                {currentScene.startTime} — {currentScene.endTime}
              </span>
              <span className="text-studio-400 bg-black/60 px-2 py-0.5 rounded border border-white/10">
                {currentProject.aspectRatio} • 24FPS
              </span>
            </div>
          </div>

          {/* Center Screen Crosshair Reticle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-16 h-16 border border-white/40 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
            </div>
          </div>

          {/* Focal Narrative Information Card inside Screen */}
          <div className="relative z-10 max-w-xl text-center px-6 py-8 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 mx-4">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase block mb-1">
              {currentScene.title}
            </span>
            <h4 className="text-base sm:text-lg font-semibold text-white mb-2 font-display">
              {currentScene.description}
            </h4>

            {/* Quick Specs Pill Grid */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-left text-xs font-mono text-studio-300">
              <div className="p-2 rounded bg-white/[0.04] border border-white/5">
                <span className="text-[10px] text-studio-500 uppercase block">{t('cameraAndLensSub')}</span>
                <span className="text-white truncate block">{currentScene.camera} • {currentScene.lens}</span>
              </div>
              <div className="p-2 rounded bg-white/[0.04] border border-white/5">
                <span className="text-[10px] text-studio-500 uppercase block">{t('lightingAndToneSub')}</span>
                <span className="text-amber-300 truncate block">{currentScene.lighting}</span>
              </div>
            </div>
          </div>

          {/* Bottom HUD: Audio direction */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-white/80 select-none z-10">
            <div className="flex items-center gap-2 bg-black/70 px-2.5 py-1 rounded border border-white/10 max-w-md truncate">
              {audioEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-pulse" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-studio-500 shrink-0" />
              )}
              <span className="truncate text-studio-300">{currentScene.audio}</span>
            </div>

            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="p-1 rounded bg-black/70 border border-white/10 hover:bg-white/10 text-studio-300 text-xs font-mono"
            >
              {audioEnabled ? t('muteAudioCues') : t('unmuteAudioCues')}
            </button>
          </div>
        </div>

        {/* Playback Controls Bar */}
        <div className="bg-studio-950 p-4 border-t border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevScene}
              title={t('previousSceneTooltip')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant={isPlaying ? 'secondary' : 'primary'}
              size="sm"
              icon={isPlaying ? Pause : Play}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? t('pauseSimulator') : t('playTimeline')}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextScene}
              title={t('nextSceneTooltip')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Timeline scene dots */}
          <div className="flex items-center gap-1.5 flex-1 max-w-xs mx-4">
            {scenes.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActiveIdx(i); setIsPlaying(false); }}
                className={`h-1.5 rounded-full flex-1 transition-all ${
                  i === activeIdx ? 'bg-cyan-400 shadow-glow-cyan' : 'bg-studio-800 hover:bg-studio-700'
                }`}
                title={`${t('sceneLabel')} ${i + 1}`}
              />
            ))}
          </div>

          <span className="text-xs font-mono text-studio-400">
            {t('totalDurationLabel')}: {currentProject.duration}
          </span>
        </div>
      </div>
    </Modal>
  );
}
