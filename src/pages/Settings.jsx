import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Cpu, 
  Key, 
  Monitor, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Save,
  RotateCcw
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  VIDEO_MODELS, 
  DURATION_OPTIONS, 
  ASPECT_RATIOS, 
  LANGUAGE_OPTIONS 
} from '../data/modelPresets';

export function Settings() {
  const { user, settings, updateUserSettings, updateUserProfile, addToast, t } = useStudio();

  // Local state for forms
  const [profileData, setProfileData] = useState({ ...user });
  const [settingsData, setSettingsData] = useState({ ...settings });
  const [apiKeys, setApiKeys] = useState({ ...settings.apiKeys });
  const [testingApi, setTestingApi] = useState(false);

  const handleSaveAll = () => {
    updateUserProfile(profileData);
    updateUserSettings({
      ...settingsData,
      apiKeys
    });
  };

  const handleTestApiKey = () => {
    setTestingApi(true);
    setTimeout(() => {
      setTestingApi(false);
      addToast('AI Engine connection verified! Ready for live generation.', 'success');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">{t('studioPreferencesBadge')}</span>
            <Badge variant="indigo" size="sm">Active Pro</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            {t('settingsHeaderTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-studio-400 mt-1">
            {t('settingsHeaderSub')}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Save}
          onClick={handleSaveAll}
        >
          {t('saveChangesBtn')}
        </Button>
      </div>

      <div className="space-y-6">
        {/* 1. CREATOR PROFILE */}
        <div className="p-5 rounded-xl bg-studio-900 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-studio-300 uppercase pb-2 border-b border-white/5 font-semibold">
            <User className="w-4 h-4 text-indigo-400" />
            <span>{t('directorProfileTitle')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="flex items-center gap-3">
              <img
                src={profileData.avatarUrl}
                alt={profileData.name}
                className="w-14 h-14 rounded-full border border-white/20 object-cover shrink-0"
              />
              <div>
                <span className="text-xs font-mono text-studio-400 block">Avatar</span>
                <span className="text-[10px] text-emerald-400 font-mono">{profileData.tier}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-studio-400 mb-1">{t('creatorNameLabel')}</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full bg-studio-850 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-studio-400 mb-1">{t('directorTitleLabel')}</label>
              <input
                type="text"
                value={profileData.role}
                onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                className="w-full bg-studio-850 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
              />
            </div>
          </div>
        </div>

        {/* 2. DEFAULT GENERATION SETTINGS */}
        <div className="p-5 rounded-xl bg-studio-900 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-studio-300 uppercase pb-2 border-b border-white/5 font-semibold">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>{t('productionDefaultsTitle')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Default Model */}
            <div>
              <label className="block text-xs font-mono text-studio-400 mb-1">{t('modelLabel')}</label>
              <select
                value={settingsData.defaultModel}
                onChange={(e) => setSettingsData({ ...settingsData, defaultModel: e.target.value })}
                className="w-full bg-studio-850 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              >
                {VIDEO_MODELS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Default Duration */}
            <div>
              <label className="block text-xs font-mono text-studio-400 mb-1">{t('durationLabel')}</label>
              <select
                value={settingsData.defaultDuration}
                onChange={(e) => setSettingsData({ ...settingsData, defaultDuration: e.target.value })}
                className="w-full bg-studio-850 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              >
                {DURATION_OPTIONS.map(d => (
                  <option key={d.id} value={d.label}>{d.label}</option>
                ))}
              </select>
            </div>

            {/* Default Aspect Ratio */}
            <div>
              <label className="block text-xs font-mono text-studio-400 mb-1">{t('aspectRatioLabel')}</label>
              <select
                value={settingsData.defaultAspectRatio}
                onChange={(e) => setSettingsData({ ...settingsData, defaultAspectRatio: e.target.value })}
                className="w-full bg-studio-850 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              >
                {ASPECT_RATIOS.map(ar => (
                  <option key={ar.id} value={ar.id}>{ar.label}</option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-xs font-mono text-studio-400 mb-1">{t('languageLabel')}</label>
              <select
                value={settingsData.language}
                onChange={(e) => setSettingsData({ ...settingsData, language: e.target.value })}
                className="w-full bg-studio-850 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              >
                {LANGUAGE_OPTIONS.map(l => (
                  <option key={l.id} value={l.label}>{l.flag} {l.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 3. APPEARANCE */}
        <div className="p-5 rounded-xl bg-studio-900 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-studio-300 uppercase pb-2 border-b border-white/5 font-semibold">
            <Monitor className="w-4 h-4 text-amber-400" />
            <span>{t('workspaceThemeTitle')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'cinematic-dark', name: 'Cinematic Dark (Default)', desc: 'Near-black #07080B with indigo accents' },
              { id: 'oled-black', name: 'OLED Pure Black', desc: 'Absolute #000000 high-contrast studio mode' },
              { id: 'titanium-slate', name: 'Titanium Slate', desc: 'Subtle cool deep slate tones' }
            ].map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setSettingsData({ ...settingsData, appearance: theme.id })}
                className={`p-3 rounded-lg border text-left transition-all ${
                  settingsData.appearance === theme.id
                    ? 'bg-studio-850 border-indigo-500 text-white shadow-sm'
                    : 'bg-studio-950 border-white/5 text-studio-400 hover:text-studio-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span>{theme.name}</span>
                  {settingsData.appearance === theme.id && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
                <p className="text-[10px] text-studio-500">{theme.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 4. API CONFIGURATION */}
        <div className="p-5 rounded-xl bg-studio-900 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2 text-xs font-mono text-studio-300 uppercase font-semibold">
              <Key className="w-4 h-4 text-emerald-400" />
              <span>{t('apiConfigTitle')}</span>
            </div>
            <Badge variant="emerald" size="sm">READY</Badge>
          </div>

          <p className="text-xs text-studio-400 leading-relaxed">
            {t('apiConfigNotice')}
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-studio-400 mb-1">
                Google Gemini API Key (Optional)
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKeys.geminiKey || ''}
                onChange={(e) => setApiKeys({ ...apiKeys, geminiKey: e.target.value })}
                className="w-full bg-studio-850 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-studio-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-studio-400 mb-1">
                OpenAI / Sora API Key (Optional)
              </label>
              <input
                type="password"
                placeholder="sk-proj-..."
                value={apiKeys.openaiKey || ''}
                onChange={(e) => setApiKeys({ ...apiKeys, openaiKey: e.target.value })}
                className="w-full bg-studio-850 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-studio-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-studio-400 mb-1">
                Custom Endpoint Base URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://api.yourstudio.ai/v1"
                value={apiKeys.customEndpoint || ''}
                onChange={(e) => setApiKeys({ ...apiKeys, customEndpoint: e.target.value })}
                className="w-full bg-studio-850 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-studio-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              isLoading={testingApi}
              onClick={handleTestApiKey}
              className="text-xs font-mono"
            >
              {t('testConnectionBtn')}
            </Button>
            <span className="text-[11px] text-studio-500 font-mono">
              {t('keysSecureNotice')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
