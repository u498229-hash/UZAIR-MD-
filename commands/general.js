'use strict';
const ping = async (ctx) => { const s = Date.now(); await ctx.reply('Pong! 🏓 ' + (Date.now()-s) + 'ms'); };
const info = async (ctx) => { await ctx.reply('*UZAIR MD BOT*\nDeveloper: UZAIR MD'); };
const alive = async (ctx) => { await ctx.reply('✅ *Bot is Alive!*'); };
const speed = async (ctx) => { const s = Date.now(); await ctx.reply('⚡ Speed: ' + (Date.now()-s) + 'ms'); };
const uptime = async (ctx) => { const u = process.uptime(); await ctx.reply('⏱ Uptime: ' + Math.floor(u/3600) + 'h ' + Math.floor((u%3600)/60) + 'm'); };
const owner = async (ctx) => { await ctx.reply('👑 Owner: UZAIR MD\n📞 Contact: +923013050530'); };
const pair = async (ctx) => { await ctx.reply('🔗 Use website to pair your number.'); };
module.exports = { ping, info, alive, speed, uptime, owner, pair };
