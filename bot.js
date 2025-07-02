import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const mineflayer = require('mineflayer');

// Auto-reconnect & anti-AFK bot for Aternos
function startBot () {
  const bot = mineflayer.createBot({
    host: process.env.SERVER_HOST || 'example.aternos.me',
    port: process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 25565,
    username: process.env.BOT_USERNAME || 'KeepAlive_' + Math.floor(Math.random()*1000),
    auth: process.env.BOT_AUTH || 'offline'
  });

  bot.once('spawn', () => {
    console.log('[+] Bot spawned. Keeping server awake...');
    keepAlive(bot);
  });

  bot.on('end', () => {
    console.log('[!] Bot disconnected. Reconnecting in 10 seconds...');
    setTimeout(startBot, 10000);
  });

  bot.on('error', err => console.error('[ERROR]', err));
}

function keepAlive(bot) {
  const interval = 240000; // 4 minutes (Aternos idles after 5)
  setInterval(() => {
    try {
      bot.chat('/help');
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 400);
    } catch (e) {
      console.error('KeepAlive error:', e);
    }
  }, interval);
}

startBot();