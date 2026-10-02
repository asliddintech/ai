import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useStudio } from '../../context/StudioContext';
import { 
  CAMERA_MOVEMENTS, 
  LENSES, 
  COMPOSITIONS, 
  LIGHTING_STYLES, 
  COLOR_TREATMENTS, 
  MOTION_PROFILES, 
  ATMOSPHERES, 
  AUDIO_DIRECTIONS 
} from '../../data/cinematographyOptions';
import { compileScenePrompt } from '../../utils/promptCompiler';
import { Sparkles, Copy, Check, Sliders, Eye } from 'lucide-react';

export function SceneEditorModal({ isOpen, onClose, sceneIndex }) {
  const { currentProject, updateScene, regenerateSingleScene, addToast, t } = useStudio();
  const scene = currentProject?.scenes?.[sceneIndex];

  const [formData, setFormData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (scene) {
      setFormData({ ...scene });
    }
  }, [scene]);

  if (!isOpen || !scene || !formData) return null;

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    // Automatically recompile prompt
    updated.prompt = compileScenePrompt(updated, currentProject.model);
    setFormData(updated);
  };

  const handleSave = () => {
    updateScene(sceneIndex, formData);
    onClose();
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(formData.prompt || compileScenePrompt(formData, currentProject.model));
    setCopied(true);
    addToast(t('copiedBtn') || 'Scene prompt copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    await regenerateSingleScene(sceneIndex);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t('sceneEditorTitle') || 'Scene Editor'} #${sceneIndex + 1}: ${formData.title}`}
      subtitle={`${t('opticalMatrixTitle') || 'Cinematography'} (${formData.startTime} — ${formData.endTime})`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Row 1: Title and Time Range */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono uppercase text-studio-400 mb-1.5">
              {t('sceneTitleLabel')}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full bg-studio-850 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-studio-400 mb-1.5">
              {t('timecodeRangeLabel')}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formData.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                className="w-full bg-studio-850 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-center text-cyan-300 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-studio-500">—</span>
              <input
                type="text"
                value={formData.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                className="w-full bg-studio-850 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-center text-cyan-300 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Scene Action & Subject */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-studio-400 mb-1.5">
              {t('sceneActionLabel')}
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full bg-studio-850 border border-white/10 rounded-lg p-3 text-xs text-studio-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-studio-400 mb-1.5">
              {t('subjectDirectionLabel')}
            </label>
            <textarea
              rows={3}
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              className="w-full bg-studio-850 border border-white/10 rounded-lg p-3 text-xs text-studio-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Row 3: Environment */}
        <div>
          <label className="block text-xs font-mono uppercase text-studio-400 mb-1.5">
            {t('environmentSetLabel')}
          </label>
          <input
            type="text"
            value={formData.environment}
            onChange={(e) => handleChange('environment', e.target.value)}
            className="w-full bg-studio-850 border border-white/10 rounded-lg px-3 py-2 text-xs text-studio-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Cinematography Matrix (Camera, Lens, Composition, Lighting) */}
        <div className="p-4 rounded-xl bg-studio-950 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <h4 className="text-xs font-mono uppercase text-indigo-400 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5" />
              {t('opticalMatrixTitle')}
            </h4>
            <Badge variant="cyan" size="sm">{t('directorControlsBadge')}</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Camera Movement */}
            <div>
              <label className="block text-[11px] font-mono text-studio-400 mb-1">{t('cameraMovementLabel')}</label>
              <select
                value={formData.camera}
                onChange={(e) => handleChange('camera', e.target.value)}
                className="w-full bg-studio-850 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-studio-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {CAMERA_MOVEMENTS.map(c => (
                  <option key={c.id} value={c.label}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Lens Choice */}
            <div>
              <label className="block text-[11px] font-mono text-studio-400 mb-1">{t('opticalLensLabel')}</label>
              <select
                value={formData.lens}
                onChange={(e) => handleChange('lens', e.target.value)}
                className="w-full bg-studio-850 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-studio-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {LENSES.map(l => (
                  <option key={l.id} value={l.label}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Composition */}
            <div>
              <label className="block text-[11px] font-mono text-studio-400 mb-1">{t('framingCompLabel')}</label>
              <select
                value={formData.composition}
                onChange={(e) => handleChange('composition', e.target.value)}
                className="w-full bg-studio-850 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-studio-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {COMPOSITIONS.map(comp => (
                  <option key={comp.id} value={comp.label}>{comp.label}</option>
                ))}
              </select>
            </div>

            {/* Lighting Style */}
            <div>
              <label className="block text-[11px] font-mono text-studio-400 mb-1">{t('lightingTreatmentLabel')}</label>
              <select
                value={formData.lighting}
                onChange={(e) => handleChange('lighting', e.target.value)}
                className="w-full bg-studio-850 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-studio-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {LIGHTING_STYLES.map(light => (
                  <option key={light.id} value={light.label}>{light.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Color & Motion Profiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-mono text-studio-400 mb-1">{t('colorGradeLabel')}</label>
              <select
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-full bg-studio-850 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-studio-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {COLOR_TREATMENTS.map(c => (
                  <option key={c.id} value={c.label}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-studio-400 mb-1">{t('motionDynamicLabel')}</label>
              <select
                value={formData.motion}
                onChange={(e) => handleChange('motion', e.target.value)}
                className="w-full bg-studio-850 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-studio-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {MOTION_PROFILES.map(m => (
                  <option key={m.id} value={m.label}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Atmosphere, Audio & Negative Prompt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-studio-400 mb-1.5">
              {t('atmosphereVolumetricsLabel')}
            </label>
            <input
              type="text"
              value={formData.atmosphere}
              onChange={(e) => handleChange('atmosphere', e.target.value)}
              className="w-full bg-studio-850 border border-white/10 rounded-lg px-3 py-2 text-xs text-studio-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-studio-400 mb-1.5">
              {t('audioCuesLabel')}
            </label>
            <input
              type="text"
              value={formData.audio}
              onChange={(e) => handleChange('audio', e.target.value)}
              className="w-full bg-studio-850 border border-white/10 rounded-lg px-3 py-2 text-xs text-studio-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Negative Prompt */}
        <div>
          <label className="block text-xs font-mono uppercase text-studio-400 mb-1.5">
            {t('negativePromptLabel')}
          </label>
          <input
            type="text"
            value={formData.negativePrompt}
            onChange={(e) => handleChange('negativePrompt', e.target.value)}
            className="w-full bg-studio-850 border border-white/10 rounded-lg px-3 py-2 text-xs text-studio-300 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Compiled Final Prompt Output */}
        <div className="p-4 rounded-xl bg-studio-950 border border-indigo-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-indigo-300 flex items-center gap-1.5 uppercase">
              <Eye className="w-3.5 h-3.5" />
              {t('liveCompiledPrompt')} ({currentProject.model?.toUpperCase()})
            </span>
            <button
              onClick={handleCopyPrompt}
              className="text-xs font-mono text-studio-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied ? t('copiedBtn') : t('copyBtn')}
            </button>
          </div>
          <p className="text-xs font-mono text-studio-200 leading-relaxed bg-studio-900 p-3 rounded-lg border border-white/5 select-all">
            {formData.prompt || compileScenePrompt(formData, currentProject.model)}
          </p>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <Button
            variant="ghost"
            size="sm"
            icon={Sparkles}
            onClick={handleRegenerate}
          >
            {t('regenerateThisScene')}
          </Button>

          <div className="flex items-center gap-2.5">
            <Button variant="secondary" size="md" onClick={onClose}>
              {t('cancelBtn')}
            </Button>
            <Button variant="primary" size="md" onClick={handleSave}>
              {t('saveChangesBtn')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
