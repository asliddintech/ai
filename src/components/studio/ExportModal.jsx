import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  FileJson, 
  FileText, 
  FileSpreadsheet, 
  Layers,
  Sparkles
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useStudio } from '../../context/StudioContext';
import { 
  exportProjectAsJSON, 
  exportProjectAsMarkdown, 
  exportPromptsOnly, 
  exportProjectAsCSV 
} from '../../utils/exportFormats';
import { VIDEO_MODELS } from '../../data/modelPresets';
import { compileScenePrompt } from '../../utils/promptCompiler';

export function ExportModal({ isOpen, onClose }) {
  const { currentProject, addToast, t } = useStudio();
  const [activeTab, setActiveTab] = useState('prompts'); // 'prompts' | 'markdown' | 'json' | 'csv'
  const [selectedModel, setSelectedModel] = useState(currentProject?.model || 'veo');
  const [copied, setCopied] = useState(false);

  if (!currentProject) return null;

  const getExportContent = () => {
    switch (activeTab) {
      case 'prompts': {
        let text = `// AI VIDEO PROMPTS: ${currentProject.title.toUpperCase()} (${selectedModel.toUpperCase()})\n\n`;
        currentProject.scenes.forEach((s, idx) => {
          const compiled = compileScenePrompt(s, selectedModel);
          text += `// SCENE ${idx + 1}: ${s.title.toUpperCase()} [${s.startTime} - ${s.endTime}]\n${compiled}\n\n`;
        });
        return text;
      }
      case 'markdown':
        return exportProjectAsMarkdown(currentProject);
      case 'json':
        return exportProjectAsJSON(currentProject);
      case 'csv':
        return exportProjectAsCSV(currentProject);
      default:
        return '';
    }
  };

  const currentContent = getExportContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    addToast(t('copiedBtn') || 'Export content copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `${currentProject.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${activeTab}.${
      activeTab === 'json' ? 'json' : activeTab === 'csv' ? 'csv' : activeTab === 'markdown' ? 'md' : 'txt'
    }`;
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast(`Downloaded ${filename}`, 'success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('exportModalTitle')}
      subtitle={`${t('exportBtn')} "${currentProject.title}" • ${currentProject.model?.toUpperCase()}`}
      maxWidth="max-w-4xl"
    >
      {/* Format Selection Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4 mb-4">
        <div className="flex items-center gap-1.5 bg-studio-950 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'prompts' ? 'bg-indigo-600 text-white shadow-sm' : 'text-studio-400 hover:text-studio-200'
            }`}
          >
            {t('promptsBundleTab')}
          </button>
          <button
            onClick={() => setActiveTab('markdown')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'markdown' ? 'bg-indigo-600 text-white shadow-sm' : 'text-studio-400 hover:text-studio-200'
            }`}
          >
            {t('treatmentTab')}
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'json' ? 'bg-indigo-600 text-white shadow-sm' : 'text-studio-400 hover:text-studio-200'
            }`}
          >
            {t('rawJsonTab')}
          </button>
          <button
            onClick={() => setActiveTab('csv')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'csv' ? 'bg-indigo-600 text-white shadow-sm' : 'text-studio-400 hover:text-studio-200'
            }`}
          >
            {t('edlCsvTab')}
          </button>
        </div>

        {/* Model Optimization Selector (when in Prompts mode) */}
        {activeTab === 'prompts' && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-studio-400 font-mono">{t('formatForLabel')}</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-studio-850 text-studio-200 text-xs rounded-md border border-white/10 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            >
              {VIDEO_MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Code / Content Box */}
      <div className="relative">
        <div className="flex items-center justify-between bg-studio-950 px-4 py-2 rounded-t-lg border-t border-x border-white/10 text-[11px] font-mono text-studio-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-studio-300">
              {activeTab === 'prompts' ? `batch_${selectedModel}_prompts.txt` :
               activeTab === 'markdown' ? 'treatment.md' :
               activeTab === 'json' ? 'project.json' : 'shotlist.csv'}
            </span>
          </div>
          <span>{currentContent.split('\n').length} lines</span>
        </div>

        <textarea
          readOnly
          value={currentContent}
          rows={14}
          className="w-full bg-studio-950 border border-white/10 rounded-b-lg p-4 font-mono text-xs text-studio-200 focus:outline-none resize-none leading-relaxed selection:bg-indigo-500/40"
        />
      </div>

      {/* Bottom Modal Actions */}
      <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-white/5">
        <p className="text-xs text-studio-400">
          {t('exportFooterNotice')}
        </p>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="md"
            icon={copied ? Check : Copy}
            onClick={handleCopy}
          >
            {copied ? t('copiedBtn') : t('copyClipboardBtn')}
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={Download}
            onClick={handleDownload}
          >
            {t('downloadFileBtn')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
