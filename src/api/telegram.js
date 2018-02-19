const axios = require('axios');

const URL = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`;

module.exports = {
  async send(text) {
    try {
      await axios.post(`${URL}/sendMessage`, {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'markdown',
      });
    } catch (err) {
      const {error_code, description} = err.response.data; // eslint-disable-line camelcase

      throw new Error(`[${error_code}] ${description}`); // eslint-disable-line camelcase
    }
  },
};
