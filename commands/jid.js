'use strict';
const jid = async (ctx) => { await ctx.reply('🆔 Your JID: '+ctx.sender+'\nChat JID: '+ctx.from); };
module.exports = { jid };
