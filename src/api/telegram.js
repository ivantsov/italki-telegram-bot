const Telegraf = require('telegraf/telegram');
const Extra = require('telegraf/extra');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

module.exports = {
  send(message) {
    bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message, Extra.markdown())
  },
};
