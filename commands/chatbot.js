'use strict';
const db = require('../database/db');
const { toSmallCaps } = require('../utils/fonts');
const { authMiddleware } = require('../middleware/auth');
const chatbotConfig = new Map();
const botNames = new Map();
const pendingSetup = new Map();
const setBotName = (botNum, name) => botNames.set(botNum.replace(/[^0-9]/g,''), name);
const getBotName = (botNum) => botNames.get(botNum.replace(/[^0-9]/g,'')) || 'UZAIR MD';
const chatbotgc = async (ctx) => {
  const { botNum, react } = ctx;
  const auth = authMiddleware(ctx);
  if (!await auth.requireOwner()) return;
  const cleanBot = botNum.replace(/[^0-9]/g,'');
  const val = ctx.args[0]?.toLowerCase();
  if (!val || !['on','off'].includes(val)) {
    const current = db.getBotChatbot(cleanBot,'group');
    return ctx.reply('🤖 Group Chatbot: '+(current?'✅ ON':'❌ OFF')+'\nUse: .chatbotgc on/off');
  }
  if (val==='off') { db.setBotChatbot(cleanBot,'group',false); pendingSetup.delete(cleanBot+'_group'); await ctx.reply('❌ Group chatbot OFF!'); await react('✅'); return; }
  pendingSetup.set(cleanBot+'_group',{step:'name',name:'',topic:'',from:ctx.from});
  await ctx.reply('🤖 Enter chatbot name:'); await react('✅');
};
const chatbotdm = async (ctx) => {
  const { botNum, react } = ctx;
  const auth = authMiddleware(ctx);
  if (!await auth.requireOwner()) return;
  const cleanBot = botNum.replace(/[^0-9]/g,'');
  const val = ctx.args[0]?.toLowerCase();
  if (!val || !['on','off'].includes(val)) {
    const current = db.getBotChatbot(cleanBot,'dm');
    return ctx.reply('🤖 DM Chatbot: '+(current?'✅ ON':'❌ OFF')+'\nUse: .chatbotdm on/off');
  }
  if (val==='off') { db.setBotChatbot(cleanBot,'dm',false); pendingSetup.delete(cleanBot+'_dm'); await ctx.reply('❌ DM chatbot OFF!'); await react('✅'); return; }
  pendingSetup.set(cleanBot+'_dm',{step:'name',name:'',topic:'',from:ctx.from});
  await ctx.reply('🤖 Enter chatbot name:'); await react('✅');
};
const handleChatbot = async (sock, msg, from, sender, body, botNum, isGroup, isOwner) => {
  if (!body||!body.trim()) return;
  if (body.startsWith('.')) return;
  const cleanBot = botNum.replace(/[^0-9]/g,'');
  const type = isGroup?'group':'dm';
  if (!db.getBotChatbot(cleanBot,type)) return;
  if (!isGroup && msg.key.fromMe) return;
};
module.exports = { chatbotgc, chatbotdm, handleChatbot, setBotName };
