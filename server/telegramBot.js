import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOT_TOKEN = '8810947397:AAEhyH6R8u5xyo38d9K0PX2h_-xSEl_X0Wg';
const BOT_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const BOT_FILE_URL = `https://api.telegram.org/file/bot${BOT_TOKEN}`;
const BOT_USERNAME = 'yordamchia_bot';
const VERCEL_URL = process.env.PUBLIC_URL || 'https://ai-asliddin5.vercel.app';

function encodeUserDataForUrl(user) {
  const cleanUser = {
    telegramId: user.telegramId,
    fullName: user.fullName || user.name,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    username: user.username || '',
    role: user.role || 'Kino Rejissyor / AI Prompt Muhandisi',
    tier: user.tier || 'Studio Pro (Tasdiqlangan)',
    avatarUrl: user.avatarUrl?.startsWith('/api') 
      ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.fullName || 'Rejissyor')}&backgroundColor=6366f1,8b5cf6`
      : (user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.fullName || 'Rejissyor')}&backgroundColor=6366f1,8b5cf6`),
    token: user.token,
    registeredAt: user.registeredAt || Date.now()
  };
  return Buffer.from(encodeURIComponent(JSON.stringify(cleanUser))).toString('base64');
}

// Ensure data folder exists
const DATA_DIR = path.resolve(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const AVATARS_DIR = path.join(DATA_DIR, 'avatars');
if (!fs.existsSync(AVATARS_DIR)) {
  fs.mkdirSync(AVATARS_DIR, { recursive: true });
}

// In-memory data store with file persistence
let users = {};
let sessions = {};
let userStates = {}; // e.g. 'awaiting_name'

function loadData() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('[Bot Store] Error loading users:', e);
    users = {};
  }

  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      sessions = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('[Bot Store] Error loading sessions:', e);
    sessions = {};
  }
}

function saveUsers() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (e) {
    console.error('[Bot Store] Error saving users:', e);
  }
}

function saveSessions() {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
  } catch (e) {
    console.error('[Bot Store] Error saving sessions:', e);
  }
}

loadData();

// Telegram Bot API Helper
async function botCall(method, payload = {}) {
  try {
    const res = await fetch(`${BOT_API_URL}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.ok) {
      console.warn(`[Telegram API Warning] ${method}:`, data.description);
    }
    return data;
  } catch (err) {
    console.error(`[Telegram API Error] ${method}:`, err.message);
    return { ok: false, error: err.message };
  }
}

// Get user profile photo binary/URL
export async function getUserAvatarUrl(telegramId) {
  const localAvatar = path.join(AVATARS_DIR, `${telegramId}.jpg`);
  if (fs.existsSync(localAvatar)) {
    return `/api/user/avatar/${telegramId}`;
  }

  try {
    const photosRes = await botCall('getUserProfilePhotos', {
      user_id: telegramId,
      limit: 1
    });

    if (photosRes.ok && photosRes.result?.total_count > 0) {
      const photos = photosRes.result.photos[0];
      // Highest resolution is last in the array
      const fileId = photos[photos.length - 1].file_id;
      const fileRes = await botCall('getFile', { file_id: fileId });

      if (fileRes.ok && fileRes.result?.file_path) {
        const downloadUrl = `${BOT_FILE_URL}/${fileRes.result.file_path}`;
        const imgRes = await fetch(downloadUrl);
        if (imgRes.ok) {
          const buffer = await imgRes.arrayBuffer();
          fs.writeFileSync(localAvatar, Buffer.from(buffer));
          return `/api/user/avatar/${telegramId}`;
        }
      }
    }
  } catch (e) {
    console.error(`[Avatar Fetch Error] User ${telegramId}:`, e.message);
  }

  // Fallback avatar
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${telegramId}`;
}

// Session management
export function createSession() {
  const sessionToken = 'sess_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
  sessions[sessionToken] = {
    createdAt: Date.now(),
    authenticated: false,
    user: null
  };
  saveSessions();
  return {
    sessionToken,
    botUsername: BOT_USERNAME,
    telegramUrl: `https://t.me/${BOT_USERNAME}?start=auth_${sessionToken}`
  };
}

export function getSessionStatus(sessionToken) {
  if (!sessionToken || !sessions[sessionToken]) {
    return { authenticated: false, error: 'Session not found or expired' };
  }
  return sessions[sessionToken];
}

export function getUserByToken(token) {
  if (!token) return null;
  for (const uid in users) {
    if (users[uid].token === token) {
      return users[uid];
    }
  }
  if (sessions[token] && sessions[token].user) {
    return sessions[token].user;
  }
  return null;
}

export function getAllUsers() {
  return users;
}

export function updateUser(telegramId, data) {
  if (users[telegramId]) {
    users[telegramId] = { ...users[telegramId], ...data, updatedAt: Date.now() };
    saveUsers();
    return users[telegramId];
  }
  return null;
}

// Main reply keyboard with WebApp integration
function getMainKeyboard(user = null) {
  const encoded = user ? encodeUserDataForUrl(user) : '';
  const webUrl = (user && user.token)
    ? `${VERCEL_URL}/?auth_token=${user.token}&tg_user=${encoded}`
    : VERCEL_URL;

  return {
    keyboard: [
      [
        { text: '🎬 Saytga Kirish', web_app: { url: webUrl } },
        { text: '👤 Shaxsiy Kabinet' }
      ],
      [{ text: '⚙️ Sozlamalar' }, { text: '📊 Mening Loyihalarim' }],
      [{ text: 'ℹ️ Yordam / Qo\'llanma' }]
    ],
    resize_keyboard: true,
    persistent: true
  };
}

// Helper: Ensure user is registered or create on the spot
async function ensureUser(from, customName = null) {
  let user = users[from.id];
  const firstName = from.first_name || '';
  const lastName = from.last_name || '';
  const avatarUrl = await getUserAvatarUrl(from.id);

  if (!user) {
    const fullName = customName || [firstName, lastName].filter(Boolean).join(' ') || 'AI Rejissyor';
    const token = 'tok_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

    user = {
      telegramId: from.id,
      id: from.id,
      firstName,
      lastName,
      fullName,
      name: fullName,
      username: from.username || '',
      avatarUrl,
      role: 'Kino Rejissyor / AI Prompt Muhandisi',
      tier: 'Studio Pro (Tasdiqlangan)',
      token,
      registeredAt: Date.now(),
      projectsCount: 0,
      isNameRegistered: Boolean(customName)
    };
    users[from.id] = user;
    saveUsers();
  } else {
    if (customName) {
      user.fullName = customName;
      user.name = customName;
      user.isNameRegistered = true;
    }
    if (avatarUrl && (!user.avatarUrl || user.avatarUrl.includes('dicebear'))) {
      user.avatarUrl = avatarUrl;
    }
    user.username = from.username || user.username || '';
    users[from.id] = user;
    saveUsers();
  }
  return user;
}

// Helper: Send direct links in text and with buttons
async function sendLoginLinks(chatId, user) {
  const encoded = encodeUserDataForUrl(user);
  const vercelUrl = `${VERCEL_URL}/?auth_token=${user.token}&tg_user=${encoded}`;

  const textMessage = 
`🎬 *AI VIDEO PROMPT STUDIO — SAYTGA KIRISH*

👤 *Foydalanuvchi:* *${user.fullName || user.name}*
🌟 *Maqomi:* ${user.tier || 'Studio Pro (Tasdiqlangan)'}
🆔 *ID:* \`${user.telegramId}\`

Studiyaga kirish uchun quyidagi havolani bosing:
👉 ${vercelUrl}

💡 *Eslatma:* Ushbu havolani bosishingiz bilan ism-familiyangiz va profilingiz saytda darhol avtomatik ochiladi hamda Shaxsiy Kabinetingizga kirasiz!`;

  await botCall('sendMessage', {
    chat_id: chatId,
    text: textMessage,
    parse_mode: 'Markdown',
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [
        [{ text: '🎬 Saytga Kirish (Telegramda Ochish)', web_app: { url: vercelUrl } }],
        [{ text: '🌐 Brauzerda Ochish (Tashqi Havola)', url: vercelUrl }],
        [{ text: '👤 Shaxsiy Kabinet', callback_data: 'view_cabinet' }],
        [{ text: '✏️ Ism-familiyani o\'zgartirish', callback_data: 'edit_name' }]
      ]
    }
  });
}

// Set Bot Commands Menu
async function setupBotCommands() {
  await botCall('setMyCommands', {
    commands: [
      { command: 'start', description: 'Botni ishga tushirish va kirish havolasi' },
      { command: 'login', description: 'Saytga kirish uchun to\'g\'ridan-to\'g\'ri link' },
      { command: 'cabinet', description: 'Shaxsiy kabinet ma\'lumotlari' },
      { command: 'editname', description: 'Ism va familiyani o\'zgartirish' },
      { command: 'projects', description: 'Mening yaratgan loyihalarim' },
      { command: 'help', description: 'AI Video Prompt Studio bo\'yicha qo\'llanma' }
    ]
  });
}

// Message handler
async function handleMessage(message) {
  const chatId = message.chat.id;
  const telegramId = message.from.id;
  const text = (message.text || '').trim();
  const lowerText = text.toLowerCase();
  const from = message.from;

  let user = users[telegramId];

  // 1. Agar foydalanuvchi ism-familiyasini kiritayotgan bo'lsa yoki hali nomi belgilanmagan bo'lsa
  const isAwaitingName = userStates[telegramId] === 'awaiting_name';
  const isPlainNameInput = (!user || !user.isNameRegistered) && 
    !text.startsWith('/') && 
    text !== '🎬 Saytga Kirish' && 
    text !== '👤 Shaxsiy Kabinet' && 
    text !== '⚙️ Sozlamalar' && 
    text !== '📊 Mening Loyihalarim' && 
    text !== 'ℹ️ Yordam / Qo\'llanma';

  if (isAwaitingName || isPlainNameInput) {
    if (text.length < 3) {
      await botCall('sendMessage', {
        chat_id: chatId,
        text: '⚠️ Iltimos, ism va familiyangizni to\'liq yozing (masalan: *Asliddin Nematullayev*):',
        parse_mode: 'Markdown'
      });
      return;
    }

    const cleanName = text.replace(/[*_`[\]\\]/g, '').trim() || text.trim();
    user = await ensureUser(from, cleanName);
    user.isNameRegistered = true;
    users[telegramId] = user;
    saveUsers();
    delete userStates[telegramId];

    const pendingSession = userStates[`pending_session_${telegramId}`];
    if (pendingSession && sessions[pendingSession]) {
      sessions[pendingSession].authenticated = true;
      sessions[pendingSession].user = user;
      saveSessions();
      delete userStates[`pending_session_${telegramId}`];
    }

    await botCall('sendMessage', {
      chat_id: chatId,
      text: `🎉 *Tabriklaymiz, ${user.fullName}!* Ism va familiyangiz muvaffaqiyatli saqlandi.`,
      parse_mode: 'Markdown',
      reply_markup: getMainKeyboard(user)
    });

    // Ism-familiyadan so'ng darhol saytga kirish uchun link beramiz!
    await sendLoginLinks(chatId, user);
    return;
  }

  // 2. /start komandasi
  if (text.startsWith('/start')) {
    const payload = text.split(' ')[1] || '';
    let sessionToken = null;

    if (payload.startsWith('auth_')) {
      sessionToken = payload.replace('auth_', '');
    }

    if (sessionToken) {
      userStates[`pending_session_${telegramId}`] = sessionToken;
    }

    // Agar foydalanuvchi hali ism-familiyasini ro'yxatdan o'tkazmagan bo'lsa
    if (!user || !user.isNameRegistered) {
      userStates[telegramId] = 'awaiting_name';
      const tgSuggested = [from.first_name, from.last_name].filter(Boolean).join(' ');
      await botCall('sendMessage', {
        chat_id: chatId,
        text: `👋 *Assalomu alaykum!*

🎬 **AI Video Prompt Studio** tizimiga xush kelibsiz!

Saytda siz uchun Shaxsiy Kabinet ochilishi va to'g'ridan-to'g'ri kirish havolasi berilishi uchun, iltimos, **Ism va Familiyangizni** yozib yuboring:
${tgSuggested ? `_(Tavsiya: ${tgSuggested})_` : '_(Masalan: Asliddin Nematullayev)_'}`,
        parse_mode: 'Markdown'
      });
      return;
    }

    // Agar allaqachon ro'yxatdan o'tgan bo'lsa
    if (sessionToken && sessions[sessionToken]) {
      sessions[sessionToken].authenticated = true;
      sessions[sessionToken].user = user;
      saveSessions();
    }

    await botCall('sendMessage', {
      chat_id: chatId,
      text: `👋 *Assalomu alaykum, ${user.fullName}!*

🎬 **AI Video Prompt Studio** tizimiga qayta xush kelibsiz!`,
      parse_mode: 'Markdown',
      reply_markup: getMainKeyboard(user)
    });

    await sendLoginLinks(chatId, user);
    return;
  }

  // 3. Agar foydalanuvchi "Saytga Kirish" tugmasini bossa yoki link so'rasa
  if (
    text === '🎬 Saytga Kirish' ||
    lowerText.includes('saytga kirish') ||
    lowerText.includes('saytga kir') ||
    lowerText === 'sayt' ||
    lowerText === 'link' ||
    lowerText === 'havola' ||
    text === '/login'
  ) {
    if (!user || !user.isNameRegistered) {
      userStates[telegramId] = 'awaiting_name';
      await botCall('sendMessage', {
        chat_id: chatId,
        text: `⚠️ Saytga kirish havolasini olish uchun, iltimos, avval **Ism va Familiyangizni** yozib yuboring:\n_(Masalan: Asliddin Nematullayev)_`,
        parse_mode: 'Markdown'
      });
      return;
    }

    const pendingSession = userStates[`pending_session_${telegramId}`];
    if (pendingSession && sessions[pendingSession]) {
      sessions[pendingSession].authenticated = true;
      sessions[pendingSession].user = user;
      saveSessions();
      delete userStates[`pending_session_${telegramId}`];
    }

    await sendLoginLinks(chatId, user);
    return;
  }

  // 4. Shaxsiy Kabinet / /cabinet
  if (text === '👤 Shaxsiy Kabinet' || text === '/cabinet') {
    user = await ensureUser(from);
    const encoded = encodeUserDataForUrl(user);

    const regDate = new Date(user.registeredAt || Date.now()).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const vercelLink = `${VERCEL_URL}/?auth_token=${user.token}&tg_user=${encoded}`;
    const viteLink = `http://localhost:5173/?auth_token=${user.token}&tg_user=${encoded}`;

    await botCall('sendMessage', {
      chat_id: chatId,
      text: `👤 *SHAXSIY KABINET*

📛 *Foydalanuvchi:* ${user.fullName}
🆔 *Telegram ID:* \`${user.telegramId}\`
🌐 *Username:* @${user.username || 'mavjud emas'}
🌟 *Status:* ${user.tier}
📅 *Ro'yxatdan o'tgan:* ${regDate}
🎯 *Roli:* ${user.role}

🔗 *Saytga kirish havolasi (Jonli Vercel):*
👉 ${vercelLink}

💻 *Lokal havola (kompyuterda):*
👉 ${viteLink}`,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{ text: '🌐 Jonli Saytga Kirish (Vercel)', url: vercelLink }],
          [{ text: '🎬 Saytga Kirish (Vite)', url: viteLink }],
          [{ text: '✏️ Ism-familiyani o\'zgartirish', callback_data: 'edit_name' }]
        ]
      }
    });
    return;
  }

  // 5. Sozlamalar / /settings
  if (text === '⚙️ Sozlamalar' || text === '/settings') {
    await botCall('sendMessage', {
      chat_id: chatId,
      text: `⚙️ *PROFIL SOZLAMALARI*

Quyidagi amallardan birini tanlang:`,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '✏️ Ism va familiyani tahrirlash', callback_data: 'edit_name' }],
          [{ text: '🔄 Yangi kirish havolasi olish', callback_data: 'refresh_token' }],
          [{ text: '🖼 Telegram rasmni qayta yuklash', callback_data: 'refresh_avatar' }]
        ]
      }
    });
    return;
  }

  // 6. Mening Loyihalarim / /projects
  if (text === '📊 Mening Loyihalarim' || text === '/projects') {
    user = await ensureUser(from);
    const encoded = encodeUserDataForUrl(user);
    const vercelLink = `${VERCEL_URL}/?auth_token=${user.token}&tg_user=${encoded}#history`;
    const viteLink = `http://localhost:5173/?auth_token=${user.token}&tg_user=${encoded}#history`;

    await botCall('sendMessage', {
      chat_id: chatId,
      text: `📊 *MENING LOYIHALARIM*

AI Video Prompt Studio-da yaratgan barcha video prompt loyihalaringiz bulutli va lokal xotirada saqlanadi.

🔗 *Loyihalarni ko'rish havolasi:*
👉 ${vercelLink}`,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{ text: '📂 Loyihalar Tarixini Ochish (Vercel)', url: vercelLink }],
          [{ text: '💻 Lokal Studio Tarixi', url: viteLink }]
        ]
      }
    });
    return;
  }

  // 7. Yordam / Qo'llanma / /help
  if (text === 'ℹ️ Yordam / Qo\'llanma' || text === '/help') {
    user = await ensureUser(from);
    const encoded = encodeUserDataForUrl(user);
    const vercelLink = `${VERCEL_URL}/?auth_token=${user.token}&tg_user=${encoded}`;

    await botCall('sendMessage', {
      chat_id: chatId,
      text: `ℹ️ *AI VIDEO PROMPT STUDIO BO'YICHA QO'LLANMA*

🎬 *Bu nima?*
Oddiy g'oyalarni (masalan: *"Toshkentda tunda futuristik dastur yaratayotgan muhandis"*) professional kinematografik video promptlariga aylantiruvchi studiya.

🎯 *Qo'llab-quvvatlanadigan AI Video Modellari:*
• **Google Veo** — 4K fotorealizm va Arri optikasi
• **OpenAI Sora** — uzluksiz dinamik harakatlar
• **Runway Gen-3** — kinofilm rejissyorlik boshqaruvi
• **Kling AI** — mikromimika va real fizika
• **Pika 2.0** — vizual effektlar

🔗 *Saytga kirish havolasi:*
👉 ${vercelLink}`,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎬 Saytga O\'tish (Vercel)', url: vercelLink }]
        ]
      }
    });
    return;
  }

  // 8. /editname
  if (text === '/editname') {
    userStates[telegramId] = 'awaiting_name';
    await botCall('sendMessage', {
      chat_id: chatId,
      text: 'Yangi ism va familiyangizni yozib yuboring (masalan: *Asliddin Nematullayev*):',
      parse_mode: 'Markdown'
    });
    return;
  }

  // Default fallback: agar ro'yxatdan o'tmagan bo'lsa ismini so'raymiz, o'tgan bo'lsa link beramiz!
  if (!user || !user.isNameRegistered) {
    userStates[telegramId] = 'awaiting_name';
    await botCall('sendMessage', {
      chat_id: chatId,
      text: 'Saytga kirish uchun, iltimos, avval **Ism va Familiyangizni** yozib yuboring (masalan: *Asliddin Nematullayev*):',
      parse_mode: 'Markdown'
    });
    return;
  }

  await sendLoginLinks(chatId, user);
}

// Callback query handler
async function handleCallbackQuery(cbQuery) {
  const chatId = cbQuery.message?.chat?.id;
  const telegramId = cbQuery.from.id;
  const data = cbQuery.data;

  let user = await ensureUser(cbQuery.from);

  if (data === 'view_cabinet') {
    const encoded = encodeUserDataForUrl(user);
    const regDate = new Date(user.registeredAt || Date.now()).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const vercelLink = `${VERCEL_URL}/?auth_token=${user.token}&tg_user=${encoded}`;
    const viteLink = `http://localhost:5173/?auth_token=${user.token}&tg_user=${encoded}`;

    await botCall('sendMessage', {
      chat_id: chatId,
      text: `👤 *SHAXSIY KABINET*

📛 *Foydalanuvchi:* ${user.fullName}
🆔 *Telegram ID:* \`${user.telegramId}\`
🌐 *Username:* @${user.username || 'mavjud emas'}
🌟 *Status:* ${user.tier}
📅 *Ro'yxatdan o'tgan:* ${regDate}

🔗 *Saytga kirish havolasi:*
👉 ${vercelLink}`,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{ text: '🌐 Jonli Vercel Saytiga Kirish', url: vercelLink }],
          [{ text: '🚀 Lokal Studio (Vite)', url: viteLink }],
          [{ text: '✏️ Ism-familiyani o\'zgartirish', callback_data: 'edit_name' }]
        ]
      }
    });
    await botCall('answerCallbackQuery', { callback_query_id: cbQuery.id });
    return;
  }

  if (data === 'edit_name') {
    userStates[telegramId] = 'awaiting_name';
    await botCall('sendMessage', {
      chat_id: chatId,
      text: 'Iltimos, yangi ism va familiyangizni kiriting:',
      parse_mode: 'Markdown'
    });
    await botCall('answerCallbackQuery', { callback_query_id: cbQuery.id });
    return;
  }

  if (data === 'refresh_token') {
    user.token = 'tok_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    users[telegramId] = user;
    saveUsers();
    await sendLoginLinks(chatId, user);
    await botCall('answerCallbackQuery', { callback_query_id: cbQuery.id });
    return;
  }

  if (data === 'refresh_avatar') {
    const avatarUrl = await getUserAvatarUrl(telegramId);
    user.avatarUrl = avatarUrl;
    users[telegramId] = user;
    saveUsers();
    await botCall('sendMessage', {
      chat_id: chatId,
      text: '✅ Telegram profilingiz surati yangilandi!'
    });
    await botCall('answerCallbackQuery', { callback_query_id: cbQuery.id });
    return;
  }

  await botCall('answerCallbackQuery', { callback_query_id: cbQuery.id });
}

// Long Polling Loop
let isPolling = false;
let lastUpdateId = 0;

export async function startTelegramBot() {
  if (isPolling) return;
  isPolling = true;

  console.log(`[Telegram Bot] Starting bot @${BOT_USERNAME}...`);
  await setupBotCommands();

  const poll = async () => {
    while (isPolling) {
      try {
        const res = await fetch(`${BOT_API_URL}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`, {
          method: 'GET'
        });
        const data = await res.json();

        if (data.ok && Array.isArray(data.result)) {
          for (const update of data.result) {
            lastUpdateId = update.update_id;
            if (update.message) {
              await handleMessage(update.message);
            } else if (update.callback_query) {
              await handleCallbackQuery(update.callback_query);
            }
          }
        }
      } catch (err) {
        console.error('[Telegram Bot Polling Error]:', err.message);
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
  };

  poll().catch((e) => console.error('[Telegram Bot Main Loop Error]:', e));
}
