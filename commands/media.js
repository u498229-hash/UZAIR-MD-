'use strict';
const stub = async (ctx) => { await ctx.reply('⏳ Media feature coming soon!'); };
module.exports = { play: stub, video: stub, gif: stub, tomp3: stub };
