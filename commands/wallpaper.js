'use strict';
const wallpaper = async (ctx) => { const q = ctx.args.join(' ') || 'nature'; await ctx.reply('🖼 Wallpaper for: '+q+'\n(Feature coming soon)'); };
module.exports = { wallpaper };
