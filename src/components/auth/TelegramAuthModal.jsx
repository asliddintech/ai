import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw, UserCheck, Sparkles, ExternalLink } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useStudio } from '../../context/StudioContext';
import { authService } from '../../services/authService';

export function TelegramAuthModal({ isOpen, onClose }) {
  const { setTelegramUser, addToast, t } = useStudio();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize session when modal opens
  const initSession = async () => {
    setIsLoading(true);
    setIsSuccess(false);
    try {
      const data = await authService.initTelegramSession();
      setSession(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      initSession();
    }
  }, [isOpen]);

  // Polling loop to check if user has registered/authenticated via Telegram
  useEffect(() => {
    let interval;
    if (isOpen && session?.sessionToken && !isSuccess) {
      interval = setInterval(async () => {
        try {
          const status = await authService.checkSessionStatus(session.sessionToken);
          if (status.authenticated && status.user) {
            setIsSuccess(true);
            setIsVerifying(true);
            clearInterval(interval);

            // Save user profile and log in
            const profile = authService.saveTelegramUser(status.user);
            setTelegramUser(profile);
            addToast(`Xush kelibsiz, ${profile.fullName || profile.name}!`, 'success');

            setTimeout(() => {
              setIsVerifying(false);
              onClose();
            }, 1500);
          }
        } catch (err) {
          console.error(err);
        }
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isOpen, session, isSuccess]);

  const handleOpenBot = () => {
    if (session?.telegramUrl) {
      window.open(session.telegramUrl, '_blank');
    }
  };

  const handleGuestAccess = () => {
    addToast('Mehmon sifatida studiyaga kirdingiz', 'info');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('telegramAuthTitle') || "Telegram orqali Kirish va Ro'yxatdan o'tish"}
      subtitle={t('telegramAuthSubtitle') || "Shaxsiy kabinetingiz, ism-familiyangiz va loyihalaringiz Telegram bot orqali faollashadi."}
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        {/* Success Banner if authenticated */}
        {isSuccess ? (
          <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-7 h-7 animate-bounce" />
            </div>
            <h3 className="text-base font-semibold text-white font-display">
              Muvaffaqiyatli Tasdiqlandi!
            </h3>
            <p className="text-xs text-studio-300">
              Ism-familiyangiz va Telegram suratingiz studiyaga yuklanmoqda...
            </p>
          </div>
        ) : (
          <>
            {/* Telegram Studio Banner */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-studio-950 via-studio-900 to-indigo-950/40 border border-indigo-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-2xl pointer-events-none" />

              <div className="flex items-start gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#229ED9]/20 border border-[#229ED9]/40 flex items-center justify-center shrink-0 text-[#229ED9] shadow-lg">
                  <Send className="w-6 h-6 -translate-x-0.5 translate-y-0.5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
                      RASMIY TELEGRAM BOT
                    </span>
                    <Badge variant="cyan" size="sm">@yordamchia_bot</Badge>
                  </div>
                  <h4 className="text-sm font-semibold text-white font-display">
                    Ism-familiya yordamida tezkor ro'yxatdan o'tish
                  </h4>
                  <p className="text-xs text-studio-400 leading-relaxed">
                    Bot sizdan ism-familiyangizni qabul qiladi, Telegram profilingiz rasmini oladi va saytda shaxsiy kabinetingizni ishga tushiradi.
                  </p>
                </div>
              </div>
            </div>

            {/* How it works steps */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-mono uppercase text-studio-400 block px-1">
                Oddiy 3 ta qadam:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-lg bg-studio-950 border border-white/5 space-y-1">
                  <div className="text-[10px] font-mono text-cyan-400 font-bold">1-QADAM</div>
                  <div className="text-studio-200 font-medium">Botni Ochish</div>
                  <div className="text-[11px] text-studio-500">Tugmani bosib Telegramga o'ting va Start bosing</div>
                </div>

                <div className="p-3 rounded-lg bg-studio-950 border border-white/5 space-y-1">
                  <div className="text-[10px] font-mono text-indigo-400 font-bold">2-QADAM</div>
                  <div className="text-studio-200 font-medium">Ism-familiya</div>
                  <div className="text-[11px] text-studio-500">Botga ism va familiyangizni yozib yuboring</div>
                </div>

                <div className="p-3 rounded-lg bg-studio-950 border border-white/5 space-y-1">
                  <div className="text-[10px] font-mono text-emerald-400 font-bold">3-QADAM</div>
                  <div className="text-studio-200 font-medium">Avtomatik Kirish</div>
                  <div className="text-[11px] text-studio-500">Ushbu oyna o'zi avtomatik shaxsiy kabinetni ochadi</div>
                </div>
              </div>
            </div>

            {/* Live Waiting Radar */}
            <div className="p-3.5 rounded-lg bg-studio-950/80 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping absolute" />
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                </div>
                <div className="text-xs font-mono text-studio-300">
                  Botdan tasdiqlash kutilmoqda...
                </div>
              </div>

              <button
                onClick={initSession}
                className="text-xs font-mono text-studio-500 hover:text-white flex items-center gap-1 transition-colors"
                title="Sessiyani yangilash"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Yangilash</span>
              </button>
            </div>

            {/* Main Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <Button
                variant="primary"
                size="lg"
                icon={Send}
                onClick={handleOpenBot}
                disabled={isLoading}
                className="w-full bg-[#229ED9] hover:bg-[#1e8ec3] text-white shadow-glow-cyan text-sm font-medium"
              >
                <span>Telegram Bot (@yordamchia_bot) Orqali Kirish</span>
                <ExternalLink className="w-4 h-4 ml-1 opacity-75" />
              </Button>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleGuestAccess}
                  className="text-xs text-studio-400 hover:text-white transition-colors underline-offset-4 hover:underline"
                >
                  Mehmon sifatida kirish (Demo rejim)
                </button>

                <span className="text-[11px] font-mono text-studio-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Xavfsiz va tezkor kirish
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
