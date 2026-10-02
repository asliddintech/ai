import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { aiService, AI_GENERATION_STEPS } from '../services/aiService';
import { authService } from '../services/authService';
import { compileScenePrompt } from '../utils/promptCompiler';
import { translations } from '../i18n/translations';

const StudioContext = createContext();

export function StudioProvider({ children }) {
  // Navigation: 'landing' | 'dashboard' | 'new-project' | 'studio' | 'templates' | 'history' | 'settings'
  const [currentView, setCurrentView] = useState('landing');
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  
  // Generation & AI execution state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationStepStatus, setGenerationStepStatus] = useState('idle');
  const [generationLogs, setGenerationLogs] = useState([]);

  // Modals & Panels
  const [sceneEditorOpen, setSceneEditorOpen] = useState(false);
  const [editingSceneIndex, setEditingSceneIndex] = useState(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [promptEditorOpen, setPromptEditorOpen] = useState(false);
  const [visualizerOpen, setVisualizerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cabinetModalOpen, setCabinetModalOpen] = useState(false);

  // User & Settings
  const [user, setUser] = useState(() => authService.getUser());
  const [settings, setSettings] = useState(() => authService.getSettings());
  const [telegramUser, setTelegramUserState] = useState(() => authService.getTelegramUser());

  const setTelegramUser = (tgUser) => {
    setTelegramUserState(tgUser);
    if (tgUser) {
      setUser(authService.getUser());
    }
  };

  const logoutTelegram = () => {
    const defaultUser = authService.logoutTelegram();
    setTelegramUserState(null);
    setUser(defaultUser);
  };

  // Language & i18n (defaults to 'uz' for full Uzbek experience)
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('ai_video_prompt_studio_lang') || 'uz';
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('ai_video_prompt_studio_lang', newLang);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  // Check auth_token query param or prompt for telegram auth on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('auth_token');
    if (token) {
      authService.verifyAuthToken(token).then((verifiedUser) => {
        if (verifiedUser) {
          setTelegramUserState(verifiedUser);
          setUser(authService.getUser());
          addToast(`Xush kelibsiz, ${verifiedUser.fullName || verifiedUser.name}!`, 'success');
        }
      });
      // Clean query string
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } else {
      const existing = authService.getTelegramUser();
      if (!existing) {
        const timer = setTimeout(() => {
          setAuthModalOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Load projects on startup
  useEffect(() => {
    const loaded = projectService.getProjects();
    setProjects(loaded);
    if (loaded.length > 0 && !currentProject) {
      setCurrentProject(loaded[0]);
    }
  }, []);

  const addToast = (message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const navigateTo = (view, projectId = null) => {
    if (projectId) {
      const proj = projectService.getProjectById(projectId);
      if (proj) {
        setCurrentProject(proj);
        setSelectedSceneIndex(0);
      }
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProject = (projectId) => {
    const proj = projectService.getProjectById(projectId);
    if (proj) {
      setCurrentProject(proj);
      setSelectedSceneIndex(0);
      setCurrentView('studio');
      addToast(`Opened project "${proj.title}"`, 'success');
    }
  };

  // Generate a project from scratch
  const generateNewProject = async (config) => {
    setIsGenerating(true);
    setGenerationStep(0);
    setGenerationStepStatus('in-progress');
    setGenerationLogs([`Initiating AI generation pipeline for "${config.idea.slice(0, 40)}..."`]);

    try {
      const newProj = await aiService.generateProject({
        ...config,
        onProgress: ({ stepIndex, status }) => {
          setGenerationStep(stepIndex);
          if (stepIndex < AI_GENERATION_STEPS.length) {
            setGenerationLogs(prev => [
              ...prev,
              `${AI_GENERATION_STEPS[stepIndex].label}: ${AI_GENERATION_STEPS[stepIndex].detail}`
            ]);
          }
        }
      });

      // Save to projects
      const saved = projectService.saveProject(newProj);
      setProjects(projectService.getProjects());
      setCurrentProject(saved);
      setSelectedSceneIndex(0);

      // Update user usage
      const updatedUser = {
        ...user,
        usage: {
          ...user.usage,
          generationsUsed: user.usage.generationsUsed + 1,
          scenesGenerated: user.usage.scenesGenerated + saved.scenes.length
        }
      };
      authService.updateUser(updatedUser);
      setUser(updatedUser);

      addToast('Cinematic project generated successfully!', 'success');
      setCurrentView('studio');
    } catch (err) {
      console.error('Generation error', err);
      addToast('Failed to generate project. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Save current project updates
  const updateCurrentProject = (updatedFields) => {
    if (!currentProject) return;
    const updated = {
      ...currentProject,
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };
    setCurrentProject(updated);
    projectService.saveProject(updated);
    setProjects(projectService.getProjects());
  };

  // Update a single scene
  const updateScene = (sceneIndex, updatedScene) => {
    if (!currentProject || !currentProject.scenes[sceneIndex]) return;
    
    // Automatically recompile prompt with the project's selected model
    const compiled = compileScenePrompt(updatedScene, currentProject.model);
    const finalScene = {
      ...updatedScene,
      prompt: updatedScene.prompt || compiled
    };

    const newScenes = [...currentProject.scenes];
    newScenes[sceneIndex] = finalScene;

    updateCurrentProject({ scenes: newScenes });
    addToast(`Updated Scene ${sceneIndex + 1}`, 'info', 2000);
  };

  // Regenerate a single scene
  const regenerateSingleScene = async (sceneIndex) => {
    if (!currentProject || !currentProject.scenes[sceneIndex]) return;
    addToast(`Regenerating Scene ${sceneIndex + 1}...`, 'info');
    
    const targetScene = currentProject.scenes[sceneIndex];
    const regenerated = await aiService.regenerateScene(targetScene, currentProject.model);
    
    const newScenes = [...currentProject.scenes];
    newScenes[sceneIndex] = regenerated;

    updateCurrentProject({ scenes: newScenes });
    addToast(`Scene ${sceneIndex + 1} regenerated with new cinematic direction!`, 'success');
  };

  // Duplicate a project
  const duplicateProject = (id) => {
    const dup = projectService.duplicateProject(id);
    if (dup) {
      setProjects(projectService.getProjects());
      addToast(`Project duplicated as "${dup.title}"`, 'success');
    }
  };

  // Delete a project
  const deleteProject = (id) => {
    const updated = projectService.deleteProject(id);
    setProjects(updated);
    if (currentProject?.id === id) {
      setCurrentProject(updated[0] || null);
    }
    addToast('Project deleted', 'info');
  };

  // Rename a project
  const renameProject = (id, newTitle) => {
    const renamed = projectService.renameProject(id, newTitle);
    if (renamed) {
      setProjects(projectService.getProjects());
      if (currentProject?.id === id) {
        setCurrentProject(renamed);
      }
      addToast('Project title updated', 'success');
    }
  };

  // Model change on current project
  const changeProjectModel = (modelId) => {
    if (!currentProject) return;
    // Recompile prompts for the new model
    const updatedScenes = currentProject.scenes.map(s => ({
      ...s,
      prompt: compileScenePrompt(s, modelId)
    }));

    updateCurrentProject({
      model: modelId,
      scenes: updatedScenes
    });
    addToast(`Optimized all scene prompts for ${modelId.toUpperCase()}`, 'info');
  };

  // Update user profile or settings
  const updateUserSettings = (newSettings) => {
    const saved = authService.saveSettings(newSettings);
    setSettings(saved);
    addToast('Settings saved successfully', 'success');
  };

  const updateUserProfile = (newUserData) => {
    const saved = authService.updateUser(newUserData);
    setUser(saved);
    addToast('Profile updated', 'success');
  };

  return (
    <StudioContext.Provider
      value={{
        currentView,
        setCurrentView,
        navigateTo,
        projects,
        currentProject,
        setCurrentProject,
        selectedSceneIndex,
        setSelectedSceneIndex,
        isGenerating,
        generationStep,
        generationStepStatus,
        generationLogs,
        generateNewProject,
        openProject,
        updateCurrentProject,
        updateScene,
        regenerateSingleScene,
        duplicateProject,
        deleteProject,
        renameProject,
        changeProjectModel,
        // UI Modals
        sceneEditorOpen,
        setSceneEditorOpen,
        editingSceneIndex,
        setEditingSceneIndex,
        exportModalOpen,
        setExportModalOpen,
        promptEditorOpen,
        setPromptEditorOpen,
        visualizerOpen,
        setVisualizerOpen,
        authModalOpen,
        setAuthModalOpen,
        cabinetModalOpen,
        setCabinetModalOpen,
        // User & Settings
        user,
        settings,
        telegramUser,
        setTelegramUser,
        logoutTelegram,
        updateUserSettings,
        updateUserProfile,
        // Language & i18n
        lang,
        setLang,
        t,
        // Toasts
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
}
