import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Sparkles, 
  Minimize2, 
  Maximize2, 
  Wand2, 
  ChevronRight,
  Terminal,
  Cpu
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useStudio } from '../../context/StudioContext';
import { VIDEO_MODELS } from '../../data/modelPresets';
import { 
  compileScenePrompt, 
  shortenPrompt, 
  expandPrompt, 
  parsePromptBreakdown 
} from '../../utils/promptCompiler';

export function SystematicPromptEditor({ isOpen, onClose }) {
  const { currentProject, updateScene, addToast, t } = useStudio();
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const scenes = currentProject?.scenes || [];
  const currentScene = scenes[activeSceneIndex];

  if (!isOpen || !currentProject || !currentScene) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast(t('copiedBtn') || 'Prompt copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  // Model-specific prompt optimizations
  const applyModelOptimization = (targetModelId) => {
    const optimized = compileScenePrompt(currentScene, targetModelId);
    updateScene(activeSceneIndex, {
      ...currentScene,
      prompt: optimized
    });
    addToast(`Prompt optimized for ${targetModelId.toUpperCase()}`, 'info');
  };

  // Shorten prompt action
  const handleShorten = () => {
    const shortened = shortenPrompt(currentScene.prompt || compileScenePrompt(currentScene, currentProject.model));
    updateScene(activeSceneIndex, {
      ...currentScene,
      prompt: shortened
    });
    addToast('Prompt condensed to key tokens', 'info');
  };

  // Expand prompt action
  const handleExpand = () => {
    const expanded = expandPrompt(currentScene, currentProject.model);
    updateScene(activeSceneIndex, {
      ...currentScene,
      prompt: expanded
    });
    addToast('Prompt enriched with optical descriptors', 'info');
  };

  // Direct prompt editing in code view
  const handlePromptRawChange = (e) => {
    updateScene(activeSceneIndex, {
      ...currentScene,
      prompt: e.target.value
    });
  };

  const tokens = parsePromptBreakdown(currentScene);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('promptEngineModalTitle')}
      subtitle={`${t('promptCode')} - Scene ${activeSceneIndex + 1} • ${currentProject.title}`}
      maxWidth="max-w-5xl"
    >
      <div className="space-y-5">
        {/* Scene Selector Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5 scrollbar-thin">
          {scenes.map((s, idx) => (
            <button
              key={s.id || idx}
              onClick={() => setActiveSceneIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all flex items-center gap-2 ${
                activeSceneIndex === idx
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'bg-studio-850 text-studio-400 hover:text-white hover:bg-studio-800'
              }`}
            >
              <span>{t('sceneLabel')} {String(idx + 1).padStart(2, '0')}</span>
              <span className="opacity-60 text-[10px]">({s.startTime})</span>
            </button>
          ))}
        </div>

        {/* Model Optimizer Quick Buttons */}
        <div className="bg-studio-950 p-3 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-studio-400">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('modelOptimizersTitle')}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {VIDEO_MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => applyModelOptimization(m.id)}
                className={`text-xs font-mono px-2.5 py-1 rounded border transition-all ${
                  currentProject.model === m.id
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40 shadow-sm'
                    : 'bg-studio-850 text-studio-300 border-white/10 hover:border-white/20 hover:text-white'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Systematic Breakdown vs Code Editor Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Tokenized Systematic Blueprint (5 cols) */}
          <div className="lg:col-span-5 bg-studio-950 rounded-xl border border-white/10 p-4 space-y-2.5 max-h-[460px] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-white/5 text-xs font-mono text-studio-400">
              <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                <Code2 className="w-3.5 h-3.5" />
                {t('systematicTokensTitle')}
              </span>
              <span>{tokens.length} NODES</span>
            </div>

            {tokens.map((token, i) => (
              <div 
                key={i} 
                className="p-2.5 rounded-lg bg-studio-900 border border-white/5 hover:border-indigo-500/30 transition-all group"
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-studio-400 group-hover:text-indigo-300">
                  <span>[{token.label}]</span>
                  <span className="text-[9px] text-studio-600 font-mono">NODE {i + 1}</span>
                </div>
                <p className="text-xs font-mono text-studio-200 leading-relaxed break-words">
                  {token.value || <span className="text-studio-600 italic">None specified</span>}
                </p>
              </div>
            ))}
          </div>

          {/* Right: Code Editor Box with Terminal Controls (7 cols) */}
          <div className="lg:col-span-7 flex flex-col h-[460px] bg-studio-950 rounded-xl border border-white/10 overflow-hidden">
            {/* Editor Top Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-studio-900/90 border-b border-white/10 text-xs font-mono">
              <div className="flex items-center gap-2 text-studio-300">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>scene_{activeSceneIndex + 1}_prompt.spec</span>
              </div>

              {/* Action Buttons: Shorten, Expand, Copy */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleShorten}
                  title="Condense prompt tokens"
                  className="px-2 py-1 rounded bg-studio-800 text-studio-300 hover:text-white hover:bg-studio-750 text-[11px] font-mono border border-white/5 flex items-center gap-1"
                >
                  <Minimize2 className="w-3 h-3" />
                  {t('shortenBtn')}
                </button>
                <button
                  onClick={handleExpand}
                  title="Enrich with optical descriptors"
                  className="px-2 py-1 rounded bg-studio-800 text-studio-300 hover:text-white hover:bg-studio-750 text-[11px] font-mono border border-white/5 flex items-center gap-1"
                >
                  <Maximize2 className="w-3 h-3" />
                  {t('expandBtn')}
                </button>
                <button
                  onClick={() => handleCopy(currentScene.prompt || compileScenePrompt(currentScene, currentProject.model))}
                  className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-mono flex items-center gap-1 shadow-sm"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? t('copiedBtn') : t('copyPromptBtn')}
                </button>
              </div>
            </div>

            {/* Editable Codearea */}
            <div className="flex-1 p-4 relative font-mono text-xs">
              <textarea
                value={currentScene.prompt || compileScenePrompt(currentScene, currentProject.model)}
                onChange={handlePromptRawChange}
                className="w-full h-full bg-transparent text-cyan-200/95 font-mono text-xs resize-none focus:outline-none leading-relaxed selection:bg-indigo-500/40"
                placeholder="Enter or modify compiled video prompt..."
              />
            </div>

            {/* Bottom Status Ribbon */}
            <div className="px-4 py-2 bg-studio-900/80 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-studio-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {t('targetEngineStatus')} {currentProject.model?.toUpperCase()}
              </span>
              <span>
                {(currentScene.prompt || '').length} {t('charLength')}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-3 border-t border-white/5">
          <Button variant="primary" size="md" onClick={onClose}>
            {t('doneBtn')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
