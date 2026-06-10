'use strict';

const fs     = require('fs');
const path   = require('path');
const axios  = require('axios');
const { toSmallCaps } = require('../utils/fonts');
const logger = require('../utils/logger');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

// ─── Sharp ki jagah jimp use karo (Termux compatible) ──
let Jimp;
try { Jimp = require('jimp'); } catch { Jimp = null; }

// ─── Image ko WebP sticker mein convert karo ──────────
const convertToWebP = async (buffer) => {
  // Agar jimp available hai to use karo
  if (Jimp) {
    try {
      const image = await Jimp.read(buffer);
      image.contain(512, 512);
      return await image.getBufferAsync('image/webp');
    } catch (e) {
      logger.warn('Jimp convert failed, using raw buffer:', e.message);
    }
  }
  // Fallback: buffer as-is bhej do (WhatsApp khud handle karta hai)
  return buffer;
};

// ─── Helper: get media buffer from msg ────────────────
const getMediaBuffer = async (msg) => {
  const message  = msg.message || {};
  const type     = Object.keys(message)[0];
  const mediaTypes = ['imageMessage','videoMessage','documentMessage','audioMessage','stickerMessage'];

  if (mediaTypes.includes(type)) {
    try { return await downloadMediaMessage(msg, 'buffer', {}); } catch { return null; }
  }

  const ctxInfo = message?.extendedTextMessage?.contextInfo
               || message?.[type]?.contextInfo
               || {};
  const quoted  = ctxInfo?.quotedMessage;
  if (quoted) {
    const qType = Object.keys(quoted)[0];
    if (mediaTypes.includes(qType)) {
      try {
        const fakeMsg = {
          key:     { ...msg.key, id: ctxInfo.stanzaId || msg.key.id },
          message: quoted,
        };
        return await downloadMediaMessage(fakeMsg, 'buffer', {});
      } catch { return null; }
    }
  }
  return null;
};

// ─── .sticker ─────────────────────────────────────────
const sticker = async (ctx) => {
  const { sock, from, msg, react } = ctx;
  await react('⏳');

  try {
    const buffer = await getMediaBuffer(msg);
    if (!buffer) {
      await react('❌');
      return ctx.reply('❌ *Send or quote an image/video to convert to sticker!*');
    }

    let stickerBuf = await convertToWebP(buffer);

    await sock.sendMessage(from, {
      sticker:  stickerBuf,
      mimetype: 'image/webp',
      packName: 'UZAIR MD BOT',
      author:   'UZAIR'
    }, { quoted: msg });

    await react('✅');
  } catch (err) {
    logger.error('Sticker error:', err.message);
    await react('❌');
    await ctx.reply('❌ *Failed to create sticker!*');
  }
};

// ─── .toimg ───────────────────────────────────────────
const toimg = async (ctx) => {
  const { sock, from, msg, react } = ctx;
  await react('⏳');

  try {
    const buffer = await getMediaBuffer(msg);
    if (!buffer) {
      await react('❌');
      return ctx.reply('❌ *Send or quote a sticker!*');
    }

    await sock.sendMessage(from, {
      image:   buffer,
      caption: `🖼️ *${toSmallCaps('sticker to image')}*\n_${toSmallCaps('by UZAIR MD BOT')}_`,
    }, { quoted: msg });

    await react('✅');
  } catch (err) {
    logger.error('toimg error:', err.message);
    await react('❌');
    await ctx.reply('❌ *Failed!*');
  }
};

// ─── .stickerinfo ─────────────────────────────────────
const stickerinfo = async (ctx) => {
  const { msg, react, sock, from } = ctx;
  await react('ℹ️');
  try {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const direct = msg.message;
    const stk = quoted?.stickerMessage || direct?.stickerMessage;

    if (!stk) return ctx.reply('❌ *Send or quote a sticker first!*');

    const text =
`🎨 *${toSmallCaps('sticker info')}*

📦 *Pack:* ${stk.stickerPackName || 'N/A'}
✍️ *Author:* ${stk.stickerPackPublisher || 'N/A'}
🆔 *ID:* ${stk.fileSha256 ? Buffer.from(stk.fileSha256).toString('hex').slice(0,16) : 'N/A'}
📐 *Size:* ${stk.fileLength || 'N/A'} bytes`;
    await sock.sendMessage(from, { text }, { quoted: msg });
  } catch { await ctx.reply('❌ *Failed!*'); }
};

// ─── .emojimix ────────────────────────────────────────
const emojimix = async (ctx) => {
  const { sock, from, msg, args, react } = ctx;
  await react('⏳');
  try {
    const text = args.join(' ');
    const ems = text.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu);

    if (!ems || ems.length < 2) return ctx.reply('❌ *Provide 2 emojis!*\n_Usage: `.emojimix 😂 😭`_');

    const url = `https://www.gstatic.com/android/keyboard/emojikitchen/20201001/${encodeURIComponent(ems[0])}/${encodeURIComponent(ems[0])}_${encodeURIComponent(ems[1])}.png`;
    const res = await axios.get(url, { responseType: 'arraybuffer' });

    let stickerBuf = await convertToWebP(Buffer.from(res.data));

    await sock.sendMessage(from, {
      sticker:  stickerBuf,
      mimetype: 'image/webp',
      packName: 'UZAIR MD BOT',
      author:   'UZAIR'
    }, { quoted: msg });

    await react('✅');
  } catch (err) {
    await react('❌');
    await ctx.reply('❌ *Failed! Try different emojis.*');
  }
};

module.exports = { sticker, toimg, stickerinfo, emojimix };
