'use strict';
const db = require('../database/db');
const restrict = async (ctx) => { if (!ctx.isOwner) return ctx.reply('❌ Owner only!'); const num = ctx.args[0]?.replace(/[^0-9]/g,''); if (!num) return ctx.reply('❌ Provide number!'); db.addRestricted(num, ctx.cleanBotNum); await ctx.reply('🚫 Restricted: '+num); };
const unrestrict = async (ctx) => { if (!ctx.isOwner) return ctx.reply('❌ Owner only!'); const num = ctx.args[0]?.replace(/[^0-9]/g,''); if (!num) return ctx.reply('❌ Provide number!'); db.removeRestricted(num, ctx.cleanBotNum); await ctx.reply('✅ Unrestricted: '+num); };
module.exports = { restrict, unrestrict };
