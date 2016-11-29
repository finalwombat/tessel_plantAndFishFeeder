var schedule = require('node-schedule');

module.exports = {

  calculateMilliseconds: function(num, type){

    switch (type) {
      case 's':
          return (num * 1000);
        break;
      case 'm':
        return (num * 60 * 1000);
        break;
      case 'h':
        return (num * 60 * 60 * 1000);
        break;
    }

  },

  newTimer: function(time, callback){
    var rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = new schedule.Range(0,6);
    return schedule.scheduleJob(
          { hour: time.getHours(),
            minute: time.getMinutes(),
            second: time.getSeconds(),
            milliseconds: time.getMilliseconds(),
            dayOfWeek: rule
          },
          callback);
  }
}
