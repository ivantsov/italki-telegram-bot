const differenceBy = require('lodash.differenceby');
const dateFns = require('date-fns');

function getRemoved(prev, next) {
  const prevWithoutPastDates = prev.filter(
    ({utc_start_time}) => !dateFns.isPast(utc_start_time),
  );
  return differenceBy(prevWithoutPastDates, next, 'utc_start_time');
}

module.exports = function(prev, next) {
  return {
    added: differenceBy(next, prev, 'utc_start_time'),
    removed: getRemoved(prev, next),
  };
};
