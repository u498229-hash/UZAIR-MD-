'use strict';
const { toSmallCaps } = require('../utils/fonts');
const run = async (ctx) => {
  await ctx.react('📋');
  await ctx.reply('*UZAIR MD BOT*\n\n_.menu_ - Show menu\n_.ping_ - Check alive\n_.sticker_ - Make sticker\nAnd more commands...');
};
module.exports = { run };
