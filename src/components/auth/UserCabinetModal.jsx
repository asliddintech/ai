import React from 'react';
import { 
  User, 
  Send, 
  ShieldCheck, 
  Film, 
  Sparkles, 
  LogOut, 
  ExternalLink, 
  Calendar, 
  CheckCircle2, 
  Layers,
  Cpu
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useStudio } from '../../context/StudioContext';

export function UserCabinetModal({ isOpen, onClose }) {
  const { user, projects, logoutTelegram, addToast, t } = useStudio();

  if (!user) return null;

  const handleOpenTelegram = () => {
    window.open('https://t.me/yordamchia_bot', '_blank');
  };

  const handleLogout = () => {
    logoutTelegram();
    addToast('Shaxsiy kabinetdan chiqildi', 'info');
    onClose();
  };

  const regDate = user.registeredAt 
    ? new Date(user.registeredAt).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Yaqinda ro\'yxatdan o\'tgan';

  const totalScenes = projects.reduce((acc, p) => acc + (p.scenes?.length || 0), 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('userCabinetTitle') || "Shaxsiy Kabinet"}
      subtitle={t('userCabinetSubtitle') || "Telegram orqali tasdiqlangan rejissyorlik profilingiz va statistika."}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Profile Card Header */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-studio-950 via-studio-900 to-indigo-950/50 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.fullName || user.name}
                className="w-20 h-20 rounded-2xl border-2 border-indigo-500/40 object-cover shadow-2xl bg-studio-950"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full border-2 border-studio-900 text-white" title="Tasdiqlangan">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Identity Info */}
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight font-display truncate">
                  {user.fullName || user.name}
                </h3>
                <Badge variant="emerald" size="sm">
                  {user.tier || "Studio Pro"}
                </Badge>
              </div>

              <p className="text-xs text-studio-300 font-mono">
                {user.handle || (user.username ? `@${user.username}` : '@ijodkor')}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-studio-400">
                {user.telegramId && (
                  <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    ID: {user.telegramId}
                  </span>
                )}
                <span className="flex items-center gap-1 text-studio-400">
                  <Calendar className="w-3 h-3 text-studio-500" />
                  {regDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Studio Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-studio-950 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-studio-500 uppercase flex items-center gap-1">
              <Film className="w-3 h-3 text-indigo-400" />
              Loyihalar
            </span>
            <div className="text-xl font-bold text-white font-mono">{projects.length}</div>
            <span className="text-[10px] text-studio-400">Faol kino loyihasi</span>
          </div>

          <div className="p-3.5 rounded-xl bg-studio-950 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-studio-500 uppercase flex items-center gap-1">
              <Layers className="w-3 h-3 text-cyan-400" />
              Kadrlar
            </span>
            <div className="text-xl font-bold text-cyan-300 font-mono">{totalScenes}</div>
            <span className="text-[10px] text-studio-400">Yaratilgan kadrlar</span>
          </div>

          <div className="p-3.5 rounded-xl bg-studio-950 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-studio-500 uppercase flex items-center gap-1">
              <Cpu className="w-3 h-3 text-amber-400" />
              AI Quvvati
            </span>
            <div className="text-xl font-bold text-amber-300 font-mono">Cheksiz</div>
            <span className="text-[10px] text-studio-400">Studio Pro kvotasi</span>
          </div>

          <div className="p-3.5 rounded-xl bg-studio-950 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-studio-500 uppercase flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Xavfsizlik
            </span>
            <div className="text-xl font-bold text-emerald-300 font-mono">100%</div>
            <span className="text-[10px] text-studio-400">Telegram Himoyasi</span>
          </div>
        </div>

        {/* Telegram Bot Link Section */}
        <div className="p-4 rounded-xl bg-studio-950 border border-white/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#229ED9]/20 text-[#229ED9] flex items-center justify-center shrink-0">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">
                Telegram Bot Sozlamalari
              </h4>
              <p className="text-[11px] text-studio-400">
                Ism-familiyani o'zgartirish, loyihalarni ko'rish va boshqaruv @yordamchia_bot orqali
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenTelegram}
            className="border-white/10 text-xs shrink-0"
          >
            <span>Botni Ochish</span>
            <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
          </Button>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <Button
            variant="danger"
            size="sm"
            icon={LogOut}
            onClick={handleLogout}
            className="text-xs"
          >
            Tizimdan Chiqish
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
          >
            Yopish
          </Button>
        </div>
      </div>
    </Modal>
  );
}
