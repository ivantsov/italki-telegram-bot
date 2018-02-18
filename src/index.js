const _ = require('lodash/fp');
const moment = require('moment');
const italki = require('./api/italki');
const telegram = require('./api/telegram');

async function getSchedule(start, end) {
  const data = await italki.loadSchedule(start, end);
  return _.differenceBy('utc_start_time', data.schedule_dic_s, data.tea_used_time_dic);
}

function getDiff(prev, next) {
  return {
    added: _.differenceBy('utc_start_time', next, prev),
    removed: _.differenceBy('utc_start_time', prev, next),
  };
}

function formatMessage(arr) {
  return _.flow(
    _.map(item => ({
      date: moment(item.utc_start_time).format('DD MMMM'),
      time: `${moment(item.utc_start_time).format('LT')} - ${moment(item.utc_end_time).format('LT')}`,
    })),
    _.groupBy('date'),
    _.reduce.convert({cap: false})((result, times, date) => {
      const lines = times.map(({time}) => `- ${time}`).join('\n');
      return `${result}\n*${date}*\n_${lines}_`;
    }, '')
  )(arr);
}

exports.handler = async function() {
  const tomorrow = moment().add({days: 1});
  const threeWeeksLater = tomorrow.add({weeks: 4});
  const schedule = await getSchedule(tomorrow.format('YYYY-MM-DD'), threeWeeksLater.format('YYYY-MM-DD'));

  const prevSchedule = [...schedule].filter(() => Math.random() > 0.6);
  const nextSchedule = [...schedule].filter(() => Math.random() > 0.4);
  const diff = getDiff(prevSchedule, nextSchedule);

  telegram.send([
    `✅ The following times got \`free\` 👍 ${formatMessage(diff.added)}`,
    `️🆘 The following times got \`booked\` 🤦‍ ${formatMessage(diff.removed)}`
  ].join('\n\n'));
};