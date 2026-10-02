import React from 'react';
import { 
  Film, 
  Layers, 
  Sparkles, 
  History as HistoryIcon, 
  Settings as SettingsIcon, 
  Plus, 
  Compass, 
  HardDrive,
  Cpu,
  ChevronRight
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { LanguageToggle } from '../ui/LanguageToggle';
import { Send, CheckCircle2 } from 'lucide-react';

export function Sidebar({ mobileOpen = false, setMobileOpen }) {
  const { 
    currentView, 
    navigateTo, 
    user, 
    projects, 
    telegramUser, 
    setCabinetModalOpen, 
    setAuthModalOpen, 
    t 
  } = useStudio();

  const navItems = [
    { id: 'dashboard', label: t('navDashboard'), icon: Compass },
    { id: 'studio', label: t('navStudio'), icon: Film, badge: projects.length > 0 ? `${projects.length}` : null },
    { id: 'templates', label: t('navTemplates'), icon: Layers },
    { id: 'history', label: t('navHistory'), icon: HistoryIcon },
    { id: 'settings', label: t('navSettings'), icon: SettingsIcon },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-64 bg-studio-950/95 lg:bg-studio-950 border-r border-white/[0.07] flex flex-col justify-between transition-transform duration-200 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-white/[0.06]">
          <div 
            onClick={() => { navigateTo('landing'); if (setMobileOpen) setMobileOpen(false); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-glow-indigo/50 border border-white/20">
              <Film className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-xs font-mono font-semibold tracking-wider text-indigo-400 uppercase block">AI Studio</span>
              <h1 className="text-sm font-semibold tracking-tight text-white font-display group-hover:text-indigo-200 transition-colors">
                PROMPT STUDIO
              </h1>
            </div>
          </div>

          {/* Quick New Project CTA */}
          <button
            onClick={() => { navigateTo('new-project'); if (setMobileOpen) setMobileOpen(false); }}
            className="w-full mt-4 py-2 px-3 rounded-lg bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-medium flex items-center justify-center gap-2 border border-indigo-400/30 shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>{t('newProject')}</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 flex items-center justify-between text-[10px] font-mono tracking-wider uppercase text-studio-500">
            <span>{t('navNavigation')}</span>
            <span className="text-[9px] text-emerald-400">100% UZ</span>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { navigateTo(item.id); if (setMobileOpen) setMobileOpen(false); }}
                className={`
                  w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group
                  ${isActive 
                    ? 'bg-studio-850 text-white border border-white/10 shadow-inner-light' 
                    : 'text-studio-400 hover:text-studio-100 hover:bg-white/[0.04]'
                  }
                `}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-400' : 'text-studio-400 group-hover:text-studio-200'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-studio-800 text-studio-400'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Profile & Usage */}
        <div className="p-3 border-t border-white/[0.06] bg-studio-900/40">
          {/* Usage Meter */}
          <div className="p-2.5 rounded-lg bg-studio-900 border border-white/5 mb-3">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-studio-400 flex items-center gap-1 font-mono">
                <Cpu className="w-3 h-3 text-cyan-400" />
                {t('aiComputes')}
              </span>
              <span className="font-mono text-studio-200">
                {user.usage.generationsUsed} / {user.usage.generationsMax}
              </span>
            </div>
            <div className="w-full bg-studio-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (user.usage.generationsUsed / user.usage.generationsMax) * 100)}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between items-center text-[10px] text-studio-400 font-mono">
              <span>{user.usage.scenesGenerated} {t('scenesBuilt')}</span>
              <span className="text-emerald-400">{t('proTier')}</span>
            </div>
          </div>

          {/* Telegram Auth Banner or Profile Card */}
          {!telegramUser && (
            <button
              onClick={() => { setAuthModalOpen(true); if (setMobileOpen) setMobileOpen(false); }}
              className="w-full mb-2.5 py-2 px-3 rounded-lg bg-[#229ED9]/15 hover:bg-[#229ED9]/25 border border-[#229ED9]/40 text-[#229ED9] hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5 -translate-x-0.5" />
              <span>Telegram orqali kirish</span>
            </button>
          )}

          {/* User Profile Card */}
          <div 
            onClick={() => { 
              if (telegramUser) {
                setCabinetModalOpen(true);
              } else {
                setAuthModalOpen(true);
              }
              if (setMobileOpen) setMobileOpen(false); 
            }}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.04] cursor-pointer transition-colors group"
            title={telegramUser ? "Shaxsiy Kabinet" : "Telegram orqali kirish"}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-white/10 object-cover bg-studio-950"
                />
                {telegramUser && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 ring-2 ring-studio-950" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-studio-100 truncate group-hover:text-white">
                  {user.name}
                </p>
                <p className="text-[10px] text-studio-400 truncate flex items-center gap-1">
                  {telegramUser ? (
                    <span className="text-cyan-400 font-mono">Shaxsiy Kabinet →</span>
                  ) : (
                    <span>{user.role}</span>
                  )}
                </p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-studio-500 group-hover:text-studio-300 shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
}
