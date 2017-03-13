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

    var rule = this.getRecurrenceRule(timer);

    return schedule.scheduleJob(
          rule,
          function(){
            tasks.onStart();
            console.log('onStart');
            setTimeout(function(){
              tasks.onEnd();
            }, utill.calculateMilliseconds(timer.duration, 'minutes'))
          }
          )
  },

  getRecurrenceRule: function(timer){
    var rule = new schedule.RecurrenceRule();
    var time = new Date(timer.time);
    rule.hour = time.getHours();
    rule.minute = time.getMinutes();
    rule.second = time.getSeconds();

    // Set dayOfWeek
    if(timer.frequency <= 6){
      rule.dayOfWeek = timer.frequency;
    }
    else if(timer.frequency > 6){
      if(timer.frequency === 8){      // Everyday
        rule.dayOfWeek = new schedule.Range(0,6);
      }
    }
    return rule;
  }
}
