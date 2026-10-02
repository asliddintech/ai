import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { 
  startTelegramBot, 
  createSession, 
  getSessionStatus, 
  getUserByToken, 
  updateUser 
} from './telegramBot.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static frontend assets if built
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI Video Prompt Studio Backend & Telegram Bot Engine',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    bot: '@yordamchia_bot'
  });
});

// --- TELEGRAM AUTH API ENDPOINTS ---

// 1. Initialize a new Telegram auth session
app.post('/api/auth/init-session', (req, res) => {
  const session = createSession();
  res.json({
    success: true,
    sessionToken: session.sessionToken,
    botUsername: session.botUsername,
    telegramUrl: session.telegramUrl
  });
});

// 2. Poll session status from frontend
app.get('/api/auth/status', (req, res) => {
  const { sessionToken } = req.query;
  const status = getSessionStatus(sessionToken);
  res.json(status);
});

// 3. Verify user token (e.g., from URL ?auth_token=...)
app.get('/api/auth/verify', (req, res) => {
  const { token } = req.query;
  const user = getUserByToken(token);
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, error: 'Invalid or expired auth token' });
  }
});

// 4. Serve user avatar from local cache
app.get('/api/user/avatar/:telegramId', (req, res) => {
  const { telegramId } = req.params;
  const avatarPath = path.resolve(__dirname, 'data/avatars', `${telegramId}.jpg`);
  if (fs.existsSync(avatarPath)) {
    res.sendFile(avatarPath);
  } else {
    // Redirect to default fallback
    res.redirect(`https://api.dicebear.com/7.x/bottts/svg?seed=${telegramId}`);
  }
});

// 5. Update user profile
app.post('/api/user/update', (req, res) => {
  const { telegramId, name, role } = req.body;
  if (!telegramId) {
    return res.status(400).json({ error: 'telegramId is required' });
  }
  const updated = updateUser(telegramId, { name, role });
  res.json({ success: true, user: updated });
});

// --- CREATIVE PROMPT ENGINE ENDPOINTS ---

// Concept generation endpoint
app.post('/api/generate/concept', async (req, res) => {
  const { idea, style = 'Cinematic', language = 'English' } = req.body;
  if (!idea) {
    return res.status(400).json({ error: 'idea is required' });
  }

  // Cinematic concept synthesis
  const concept = {
    title: `${style} Vision: ${idea.slice(0, 30)}...`,
    logline: `A cinematic sequence exploring ${idea}, balancing spatial scale and intimate human emotion.`,
    visualDirection: `${style} aesthetic featuring 35mm anamorphic optics, volumetric lighting, and Kodak film tone.`,
    mood: 'Atmospheric, cinematic, evocative, visually arresting.',
    colorPalette: ['#0A0D14', '#06B6D4', '#F59E0B', '#6366F1', '#F1F5F9'],
    styleTags: ['Anamorphic 2.39:1', 'Volumetric Haze', 'Master Composition', 'Kodak 5219 LUT']
  };

  res.json({ success: true, concept });
});

// Prompt optimization endpoint
app.post('/api/generate/optimize', (req, res) => {
  const { prompt, model = 'veo', scene } = req.body;
  let optimized = prompt;

  if (model === 'veo') {
    optimized = `[4K Cinematic, Photorealistic Arri Alexa LF] ${prompt}. Natural physics, award-winning lighting, high temporal consistency, 24fps film cadence.`;
  } else if (model === 'sora') {
    optimized = `A hyper-realistic cinematic continuous sequence. ${prompt}. Physically accurate light bounces, 3D spatial consistency, 35mm filmic texture.`;
  } else if (model === 'runway') {
    optimized = `FPOV cinematic master shot: ${prompt} --camera slow pan --motion 5 --seed 42 --cinematic true`;
  } else if (model === 'kling') {
    optimized = `Masterpiece cinematic video, 8K raw footage, ${prompt}. Extremely lifelike skin pore textures, micro-movements, no CGI artifacts.`;
  }

  res.json({ success: true, model, optimizedPrompt: optimized });
});

// Client SPA fallback
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.type('html').send(`
      <!DOCTYPE html>
      <html>
        <head><title>AI Video Prompt Studio</title></head>
        <body style="font-family:sans-serif; background:#0A0D14; color:#F8FAFC; padding:2rem; text-align:center;">
          <h2>AI Video Prompt Studio Server is Running</h2>
          <p>Please run <code>npm run build</code> or visit Vite dev server at <a href="http://localhost:5173" style="color:#6366F1;">http://localhost:5173</a>.</p>
        </body>
      </html>
    `);
  }
});

// Start Express server and launch Telegram Bot simultaneously
app.listen(PORT, () => {
  console.log(`[Studio Server] AI Video Prompt Studio running on port ${PORT}`);
  startTelegramBot().catch(err => {
    console.error('[Studio Server] Failed to start Telegram bot:', err);
  });
});
