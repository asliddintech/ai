import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ToastContainer } from '../ui/Toast';
import { useStudio } from '../../context/StudioContext';
import { GenerationProgressModal } from '../studio/GenerationProgressModal';
import { ExportModal } from '../studio/ExportModal';
import { VisualizerModal } from '../studio/VisualizerModal';
import { SystematicPromptEditor } from '../prompts/SystematicPromptEditor';
import { SceneEditorModal } from '../scenes/SceneEditorModal';
import { TelegramAuthModal } from '../auth/TelegramAuthModal';
import { UserCabinetModal } from '../auth/UserCabinetModal';

export function AppShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { 
    currentView, 
    toasts, 
    removeToast,
    exportModalOpen, 
    setExportModalOpen,
    promptEditorOpen, 
    setPromptEditorOpen,
    visualizerOpen, 
    setVisualizerOpen,
    sceneEditorOpen, 
    setSceneEditorOpen,
    editingSceneIndex,
    currentProject,
    authModalOpen,
    setAuthModalOpen,
    cabinetModalOpen,
    setCabinetModalOpen
  } = useStudio();

  // If on Landing page, render full screen without the dashboard shell
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-studio-950 text-studio-100 flex flex-col selection:bg-indigo-500/30">
        <GenerationProgressModal />
        <TelegramAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        <UserCabinetModal isOpen={cabinetModalOpen} onClose={() => setCabinetModalOpen(false)} />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-studio-950 text-studio-100 flex selection:bg-indigo-500/30">
      {/* Persistent Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <Topbar setMobileOpen={setMobileOpen} />
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Global Modals */}
      <GenerationProgressModal />
      <ExportModal isOpen={exportModalOpen} onClose={() => setExportModalOpen(false)} />
      <VisualizerModal isOpen={visualizerOpen} onClose={() => setVisualizerOpen(false)} />
      <SystematicPromptEditor isOpen={promptEditorOpen} onClose={() => setPromptEditorOpen(false)} />
      <SceneEditorModal 
        isOpen={sceneEditorOpen} 
        onClose={() => setSceneEditorOpen(false)} 
        sceneIndex={editingSceneIndex} 
      />
      <TelegramAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <UserCabinetModal isOpen={cabinetModalOpen} onClose={() => setCabinetModalOpen(false)} />

      {/* Toast Stack */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
