const differenceBy = require('lodash.differenceby');
const groupBy = require('lodash.groupby');
const dateFns = require('date-fns');
const italki = require('./api/italki');
const telegram = require('./api/telegram');
const db = require('./db');

function getDiff(prev, next) {
  return {
    added: differenceBy(next, prev, 'utc_start_time'),
    removed: differenceBy(prev, next, 'utc_start_time'),
  };
}

function formatSchedule(arr) {
  const formattedTime = arr.map(item => {
    // add timezone
    const startTZ = dateFns.addHours(item.utc_start_time, 1);
    const endTZ = dateFns.addHours(item.utc_end_time, 1);

    return {
      date: dateFns.format(startTZ, 'DD MMMM'),
      time: `${dateFns.format(startTZ, 'HH:mm')} - ${dateFns.format(
        endTZ,
        'HH:mm',
      )}`,
    };
  });

  const groupedByDate = groupBy(formattedTime, 'date');

  return Object.keys(groupedByDate).reduce((result, date) => {
    const lines = groupedByDate[date].map(({time}) => `- ${time}`).join('\n');

    return `${result}\n*${date}*\n_${lines}_`;
  }, '');
}

function formatMessage({added, removed}) {
  let msg = '';
  if (added.length) {
    msg += `✅ The following times got \`free\` 👍 ${formatSchedule(
      added,
    )}\n\n`;
  }
  if (removed.length) {
    msg += `🆘 The following times got \`booked\` 🤦‍ ${formatSchedule(
      removed,
    )}`;
  }

  return msg;
}

async function getPreviousSchedule() {
  const {Item: data} = await db.get();
  return data ? data.items : [];
}

async function getNextSchedule() {
  const tomorrowStart = dateFns.startOfTomorrow();
  const fourWeeksLater = dateFns.addWeeks(dateFns.endOfTomorrow(), 4);
  const data = await italki.loadSchedule(
    dateFns.format(tomorrowStart, 'YYYY-MM-DD HH:mm'),
    dateFns.format(fourWeeksLater, 'YYYY-MM-DD HH:mm'),
  );

  return differenceBy(
    data.schedule_dic_s,
    data.tea_used_time_dic,
    'utc_start_time',
  );
}

exports.handler = async function() {
  const [prevSchedule, nextSchedule] = await Promise.all([
    getPreviousSchedule(),
    getNextSchedule(),
  ]);

  const diff = getDiff(prevSchedule, nextSchedule);
  if (diff.added.length || diff.removed.length) {
    await Promise.all([
      db.addOrUpdate(nextSchedule),
      telegram.send(formatMessage(diff)),
    ]);
  }
};
