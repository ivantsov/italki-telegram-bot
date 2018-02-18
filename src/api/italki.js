const request = require('superagent');

const URL = 'https://www.italki.com/api/teacher/4222751/available2';

module.exports = {
  async loadSchedule(start, end) {
    try {
      const res = await request
        .get(URL)
        .query({
          start_time: start,
          end_time: end,
          is_get_used_time: 1,
        });

      return res.body.data;
    }
    catch (err) {
      const res = err.response.body.error;
      throw new Error(`[${res.type}] ${res.msg}`);
    }
  },
};
