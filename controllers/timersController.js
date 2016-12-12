var schedule = require('node-schedule');
var utill = require('./utill');

var timers = [];

module.exports = {
  addTimer: function(timerOptions, tasks){
    var timer = timerOptions;
    timer.job = this.createJob(timer, tasks);
    timers.push(timer);
  },

  removeTimer: function(time){

    if(this.getTimer(time).job.cancel()){
      timers.splice(this.getTimerindex(time), 1);
    }

  },

  getTimer: function(time){
    for(var i=0; i < timers.length; i++){
      var time = timers[i].time;
        if(time === time){
          return timers[i]
        }
    }
  },
  getTimerindex: function(time){
    for(var i=0; i < timers.length; i++){
      var time = timers[i].time;
        if(time === time){
          return i
        }
    }
  },

  getTimers: function(){
    return(timers);
  },

  createJob: function(timer, tasks){
    var time = new Date(timer.time);
    //dayOfWeek = getRecuranceRule(timer.frequency);

    return schedule.scheduleJob(
          { hour: time.getHours(),
            minute: time.getMinutes(),
            second: time.getSeconds(),
            milliseconds: time.getMilliseconds()
      //      dayOfWeek: dayOfWeek
          },
          function(){
            tasks.onStart();
            setTimeout(function(){
              tasks.onEnd();
            }, utill.calculateMilliseconds(timer.duration, 'seconds'))
          }
          )
  },

  getRecuranceRule: function(timer){
    var rule = new schedule.RecurrenceRule();
    rule.hour = timer.time.getHours();
    return rule;
  }
}



/* getReccuranceRule should work something like this
    and replace what is happening in the createJob function

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(4, 6)];
rule.hour = 17;
rule.minute = 0;

var j = schedule.scheduleJob(rule, function(){
  console.log('Today is recognized by Rebecca Black!');
});
*/

function getRecuranceRule(day){
  if(day === '8'){
    return (new schedule.Range(0,6));
  }
  else {
    return day;
  }
}
