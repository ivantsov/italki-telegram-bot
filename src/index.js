const differenceBy = require('lodash.differenceby');
const dateFns = require('date-fns');
const italki = require('./api/italki');
const telegram = require('./api/telegram');
const db = require('./db');
const getDiff = require('./get-diff');
const format = require('./format');

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

module.exports.handler = async function() {
  const [prevSchedule, nextSchedule] = await Promise.all([
    getPreviousSchedule(),
    getNextSchedule(),
  ]);

  const diff = getDiff(prevSchedule, nextSchedule);
  if (diff.added.length || diff.removed.length) {
    await Promise.all([
      db.addOrUpdate(nextSchedule),
      telegram.send(format(diff)),
    ]);
  }
};
