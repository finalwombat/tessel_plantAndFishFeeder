var schedule = require('node-schedule');
var tesselController = require('./tesselController');
var utill = require('./utill');

var timers = [];

module.exports = {
  addTimer: function(timerOptions){
    var timer = timerOptions;
    timer.job = createJob(timer);
    timers.push(timer);
  },

  removeTimer: function(time){
    for(var i=0; i < timers.length; i++){
      var time = timers[i].time;
      if(time === time){
        timers[i].job.cancel();
        timers.splice(i, 1);
      }
    }
  },

  getTimers: function(){
    return(timers);
  }
}

function createJob(timer){
  var time = new Date(timer.time);
  dayOfWeek = getRecuranceRule(timer.frequency);

  return schedule.scheduleJob(
        { hour: time.getHours(),
          minute: time.getMinutes(),
          second: time.getSeconds(),
          milliseconds: time.getMilliseconds(),
          dayOfWeek: dayOfWeek
        },
        function(){
          tesselController.startPump();
          console.log('first callback');
          setTimeout(function(){
            tesselController.stopPump();
            console.log('timeout callback')
          }, utill.calculateMilliseconds(timer.duration, 'seconds'))
        }
        );
}

function getRecuranceRule(day){
  if(day === '8'){
    return (new schedule.Range(0,6));
  }
  else {
    return day;
  }
}
