const request = require('superagent');

const URL = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`;

module.exports = {
  async send(text) {
    try {
      await request
        .post(`${URL}/sendMessage`)
        .send({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'markdown',
        });
    }
    catch (err) {
      const res = err.response.body;
      throw new Error(`[${res.error_code}] ${res.description}`);
    }
  },
};

