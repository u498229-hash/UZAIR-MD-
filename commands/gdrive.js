/**
 * Google Drive Downloader Plugin
 * COMMAND: .gdrive <url>
 * EXAMPLE: .gdrive https://drive.google.com/file/d/xxxxx/view
 */

'use strict';

const axios = require('axios');

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  'okhttp/4.9.3'
];

const makeBox = (title, content) => {
  return `╭━ ${title} ━╮
┃
${content.split('\n').map(line => `┃ ${line}`).join('\n')}
┃
╰━━━━━━━━━━━━━━━╯`;
};

async function fetchWithRetry(url, maxRetries = 3, timeout = 20000) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const userAgent = USER_AGENTS[(attempt - 1) % USER_AGENTS.length];
      const response = await axios.get(url, {
        timeout,
        headers: { 'User-Agent': userAgent }
      });
      return response;
    } catch (err) {
      lastError = err;
      if (attempt === maxRetries) break;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
    }
  }
  throw lastError;
}

module.exports = {
  name: 'gdrive',
  aliases: ['gd', 'googledrive'],
  category: 'downloader',
  description: '📁 Download public files from Google Drive',
  usage: '.gdrive <url>\n📌 Example: .gdrive https://drive.google.com/file/d/xxxxx/view',

  async run(ctx) {
    const { sock, msg, args, sender, isOwner, isGroup, isAdmin, botNum, config } = ctx;
    const { from, reply, react } = extra;

    const url = args.join(' ').trim();
    if (!url) {
      return reply(makeBox('GOOGLE DRIVE', `❌ Please provide a Google Drive URL.
┃
┃ 📌 Example: .gdrive https://drive.google.com/file/d/xxxxx/view`));
    }

    try {
      await react('⏳');

      const apiUrl = `https://backend1.tioo.eu.org/gdrive?url=${encodeURIComponent(url)}`;
      const response = await fetchWithRetry(apiUrl, 3, 20000);
      const data = response.data;

      if (!data?.success || !data?.data?.downloadUrl) {
        throw new Error(data?.message || 'Invalid API response');
      }

      const file = data.data;
      const filename = file.filename || 'GoogleDrive_File';
      const filesize = file.filesize || 'Unknown';
      const downloadUrl = file.downloadUrl;

      const caption = makeBox('GOOGLE DRIVE', `📄 Filename: ${filename}
┃ 📦 Size: ${filesize}`);

      await sock.sendMessage(from, {
        document: { url: downloadUrl },
        fileName: filename,
        mimetype: 'application/octet-stream',
        caption: caption
      }, { quoted: msg });

      await react('✅');
    } catch (error) {
      console.error('Google Drive download error:', error);
      let errorMsg = '❌ Failed to download.';
      if (error.code === 'ECONNABORTED') errorMsg += ' Request timed out.';
      else errorMsg += ` ${error.message}`;
      await reply(makeBox('ERROR', errorMsg));
      await react('❌');
    }
  }
};