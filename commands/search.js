'use strict';
const axios = require('axios');
const google = async (ctx) => { const q = ctx.args.join(' '); if (!q) return ctx.reply('❌ Provide query!'); await ctx.reply('🔍 Searching: '+q+'\n(Feature coming soon)'); };
const image = async (ctx) => { await ctx.reply('🖼 Image search coming soon!'); };
const lyrics = async (ctx) => { await ctx.reply('🎵 Lyrics search coming soon!'); };
const weather = async (ctx) => { const city = ctx.args.join(' '); if (!city) return ctx.reply('❌ Provide city name!'); await ctx.reply('🌤 Weather for '+city+' coming soon!'); };
module.exports = { google, image, lyrics, weather };
