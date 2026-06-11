'use strict';
const execute = async (sock, msg, args, ctx) => { await ctx.reply('📢 Channel ID: '+ctx.from); };
module.exports = { execute };
