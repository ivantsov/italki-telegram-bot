import request from 'superagent';

const URL = 'https://www.italki.com/api/teacher/4222751/available2';

export async function loadSchedule(start, end) {
  try {
    const res = await request
      .get(URL)
      .query({
        start_time: `${start} 00:00`,
        end_time: `${end} 23:59`,
        is_get_used_time: 1,
      });

    return res.body.data;
  }
  catch (err) {
    const res = err.response.body.error;
    throw new Error(`[${res.type}] ${res.msg}`);
  }
}
