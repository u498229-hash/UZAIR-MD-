'use strict';
const execute = async (sock, msg, args, ctx) => { const url = args[0]; if (!url) return ctx.reply('❌ Provide URL!'); await ctx.reply('📸 Screenshot of: '+url+'\n(Coming soon)'); };
module.exports = { execute };
