'use strict';
const execute = async (sock, msg, args, ctx) => { const num = args[0]?.replace(/[^0-9]/g,'') || ctx.senderDigits; await ctx.reply('📱 Number Info: +'+num+'\n(Feature coming soon)'); };
module.exports = { execute };
