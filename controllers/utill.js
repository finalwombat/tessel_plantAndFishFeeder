var schedule = require('node-schedule');

module.exports = {

  getMilliseconds: function(num, type){

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

  createJob: function(time, callback){
    return schedule.scheduleJob(
          { hour: time.getHours(),
            minute: time.getMinutes(),
            second: time.getSeconds(),
            milliseconds: time.getMilliseconds()
          },
          callback);
  }
}
