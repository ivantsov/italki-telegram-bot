const groupBy = require('lodash.groupby');
const dateFns = require('date-fns');

const TIMEZONE_DIFF = 2; // timezone diff b/w server and local

function formatSchedule(arr) {
  const formattedTime = arr.map(item => {
    const startTZ = dateFns.addHours(item.utc_start_time, TIMEZONE_DIFF);
    const endTZ = dateFns.addHours(item.utc_end_time, TIMEZONE_DIFF);

    return {
      date: dateFns.format(startTZ, 'DD MMMM (dddd)'),
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

module.exports = function({added, removed}) {
  let msg = '';
  if (added.length) {
    msg += `✅ Time slots got free${formatSchedule(added)}\n\n`;
  }
  if (removed.length) {
    msg += `🆘 Time slots got \`booked\`${formatSchedule(removed)}`;
  }

  return msg;
};
