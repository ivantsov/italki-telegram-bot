const axios = require('axios');

const URL = 'https://www.italki.com/api/teacher/4222751/available2';

module.exports = {
  async loadSchedule(start, end) {
    const res = await axios.get(URL, {
      params: {
        start_time: start,
        end_time: end,
        is_get_used_time: 1,
      },
    });

    const {data} = res;

    if (data.error) {
      const {type, msg} = data.error;

      throw new Error(`[${type}] ${msg}`);
    }

    return data.data;
  },
};
