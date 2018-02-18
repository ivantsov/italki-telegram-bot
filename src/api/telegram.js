import Telegraf from 'telegraf/telegram';
import Extra from 'telegraf/extra';

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

export function send(message) {
  bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message, Extra.markdown());
}
