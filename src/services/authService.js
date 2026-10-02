const SETTINGS_KEY = 'ai_video_prompt_studio_settings_v1';
const USER_KEY = 'ai_video_prompt_studio_user_v1';
const TG_USER_KEY = 'ai_video_prompt_studio_tg_user_v1';
const AUTH_TOKEN_KEY = 'ai_video_prompt_studio_auth_token_v1';

const DEFAULT_USER = {
  name: 'Mehmon Rejissyor',
  fullName: 'Mehmon Rejissyor',
  firstName: 'Mehmon',
  lastName: 'Rejissyor',
  handle: '@guest_creator',
  username: 'guest_creator',
  role: 'AI Video Rejissyor',
  tier: 'Mehmon (Demo)',
  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=guest',
  isTelegramVerified: false,
  usage: {
    generationsUsed: 0,
    generationsMax: 100,
    scenesGenerated: 0,
    exportTokens: '0k'
  }
};

const DEFAULT_SETTINGS = {
  defaultModel: 'veo',
  defaultDuration: '30 sec',
  defaultAspectRatio: '16:9',
  defaultStyle: 'Cinematic',
  language: 'O\'zbekcha',
  appearance: 'cinematic-dark',
  soundFxEnabled: true,
  autoSaveInterval: 5,
  apiKeys: {
    geminiKey: '',
    openaiKey: '',
    runwayKey: '',
    customEndpoint: ''
  }
};

export const authService = {
  getUser() {
    try {
      const data = localStorage.getItem(USER_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...DEFAULT_USER,
          ...parsed,
          usage: {
            ...DEFAULT_USER.usage,
            ...(parsed?.usage || {})
          }
        };
      }
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_USER;
  },

  updateUser(user) {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    return user;
  },

  getTelegramUser() {
    try {
      const data = localStorage.getItem(TG_USER_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(e);
    }
    return null;
  },

  saveTelegramUser(tgUser) {
    try {
      localStorage.setItem(TG_USER_KEY, JSON.stringify(tgUser));
      if (tgUser.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, tgUser.token);
      }
      // Also sync user profile
      const userProfile = {
        name: tgUser.fullName || tgUser.name || `${tgUser.firstName} ${tgUser.lastName}`.trim(),
        fullName: tgUser.fullName || tgUser.name || `${tgUser.firstName} ${tgUser.lastName}`.trim(),
        firstName: tgUser.firstName,
        lastName: tgUser.lastName,
        handle: tgUser.username ? `@${tgUser.username}` : `@id_${tgUser.telegramId}`,
        username: tgUser.username,
        telegramId: tgUser.telegramId,
        role: tgUser.role || 'Kino Rejissyor / AI Prompt Muhandisi',
        tier: tgUser.tier || 'Studio Pro (Tasdiqlangan)',
        avatarUrl: tgUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${tgUser.telegramId}`,
        isTelegramVerified: true,
        registeredAt: tgUser.registeredAt,
        token: tgUser.token,
        usage: {
          generationsUsed: 12,
          generationsMax: 100,
          scenesGenerated: 48,
          exportTokens: '120k'
        }
      };
      localStorage.setItem(USER_KEY, JSON.stringify(userProfile));
      return userProfile;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  logoutTelegram() {
    localStorage.removeItem(TG_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(DEFAULT_USER));
    return DEFAULT_USER;
  },

  getAuthToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  // API Call: Init Telegram session
  async initTelegramSession() {
    try {
      const res = await fetch('/api/auth/init-session', { method: 'POST' });
      if (!res.ok) throw new Error('API unavailable');
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) throw new Error('Not JSON');
      return await res.json();
    } catch (err) {
      // Fallback direct URL if backend unreachable
      return {
        sessionToken: 'sess_fallback_' + Date.now(),
        botUsername: 'yordamchia_bot',
        telegramUrl: 'https://t.me/yordamchia_bot?start=auth_login'
      };
    }
  },

  // API Call: Check session status
  async checkSessionStatus(sessionToken) {
    if (!sessionToken || sessionToken.startsWith('sess_fallback_')) {
      return { authenticated: false };
    }
    try {
      const res = await fetch(`/api/auth/status?sessionToken=${encodeURIComponent(sessionToken)}`);
      if (!res.ok) return { authenticated: false };
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) return { authenticated: false };
      return await res.json();
    } catch (err) {
      return { authenticated: false };
    }
  },

  // API Call: Verify token from URL
  async verifyAuthToken(token) {
    try {
      const res = await fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`);
      if (!res.ok) return null;
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) return null;
      const data = await res.json();
      if (data.success && data.user) {
        return this.saveTelegramUser(data.user);
      }
    } catch (err) {
      console.error('[authService] verifyAuthToken failed:', err);
    }
    return null;
  },

  getSettings() {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
    return settings;
  }
};
