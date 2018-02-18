const _ = require('lodash/fp');
const dateFns = require('date-fns');
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
    _.map(({
      utc_start_time,
      utc_end_time,
    }) => {
      // add timezone
      const startTZ = dateFns.addHours(utc_start_time, 1);
      const endTZ = dateFns.addHours(utc_end_time, 1);

      return {
        date: dateFns.format(startTZ, 'DD MMMM'),
        time: `${dateFns.format(startTZ, 'HH:mm')} - ${dateFns.format(endTZ, 'HH:mm')}`,
      };
    }),
    _.groupBy('date'),
    _.reduce.convert({cap: false})((result, times, date) => {
      const lines = times.map(({time}) => `- ${time}`).join('\n');
      return `${result}\n*${date}*\n_${lines}_`;
    }, '')
  )(arr);
}

exports.handler = async function() {
  const tomorrowStart = dateFns.startOfTomorrow();
  const fourWeeksLater = dateFns.addWeeks(dateFns.endOfTomorrow(), 4);
  const schedule = await getSchedule(
    dateFns.format(tomorrowStart, 'YYYY-MM-DD HH:mm'),
    dateFns.format(fourWeeksLater, 'YYYY-MM-DD HH:mm')
  );

  const prevSchedule = [...schedule].filter(() => Math.random() > 0.6);
  const nextSchedule = [...schedule].filter(() => Math.random() > 0.4);
  const diff = getDiff(prevSchedule, nextSchedule);

  telegram.send([
    `✅ The following times got \`free\` 👍 ${formatMessage(diff.added)}`,
    `️🆘 The following times got \`booked\` 🤦‍ ${formatMessage(diff.removed)}`
  ].join('\n\n'));
};