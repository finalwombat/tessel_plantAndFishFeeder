var test = require('tape');
var timersController = require('../controllers/timersController.js');
var schedule = require('node-schedule');


var timer1 = {
              time: new Date(),
              duration: 5,     // 5 seconds
              frequency: 5     // Every Friday
              }

var timer2 = {
              time: new Date(),
              duration: 300,     // 5 minutes
              frequency: 8     // Everyday
              }

// Functions to run at the start and end of the duration
var tasks = {onStart: function(){} , onEnd: function(){} };

// *** recurance rule
test('should return instance of reccuranceRule', function(t){
  // Get rule
  var rule = timersController.getRecuranceRule(timer1);

  t.ok(rule instanceof schedule.RecurrenceRule);
  t.end();
});

// *** Recurance rule sets rule with correct time values
test('shoud return rule with correct time values', function(t){
  t.plan(3);
  // Get rule
  var rule = timersController.getRecuranceRule(timer1);

  t.ok(rule.hour === timer1.time.getHours());
  t.ok(rule.minute === timer1.time.getMinutes());
  t.ok(rule.second === timer1.time.getSeconds());
  t.end();
})

// *** Recurance rule - dayOfWeek - frequency of once a week (value under 7)
test('should return rule with correct dayOfWeek', function(t){
  var rule = timersController.getRecuranceRule(timer1);

  t.ok(rule.dayOfWeek === timer1.frequency);
  t.end();
})

// *** Recurance rule - dayOfWeek - frequency of more than once a week
test('should be instanceOf schedule.range',function(t){
  var rule = timersController.getRecuranceRule(timer2);
  t.ok(rule.dayOfWeek instanceof schedule.Range);
  t.end()
})

// *** Recurance rule - dayOfWeek - test for everyday
test('should be a schedule.Range object with correct values',function(t){
  var rule = timersController.getRecuranceRule(timer2);
  t.ok(rule.dayOfWeek.start === 0);
  t.ok(rule.dayOfWeek.end === 6);
  t.end()
})


// *** Crerate a new timer
test('should be one more timer after we add one', function(t){

  // get timer count
  var timersBefore = timersController.getTimers().length;

  // Add timer
  timersController.addTimer(timer1, tasks);

  // Get new timers count
  var timersAfter = timersController.getTimers().length;

  // Test
  t.equal(timersBefore + 1,  timersAfter);

  // Kill active processes
  timersController.removeTimer(timer1.time);
  t.end();
});

// *** Remove timer
test('should be one less timer after we remove one', function(t){

  // Add timer
  timersController.addTimer(timer1, tasks);

  // get timers count
  var timersBefore = timersController.getTimers().length;

  // Remove timer
  timersController.removeTimer(timer1.time);

  // Get new timers count
  var timersAfter = timersController.getTimers().length;

  // Test
  t.equal(timersBefore - 1,  timersAfter);

  // Kill active processes
  t.end();
});

// *** Check if job is created
test('should be an instance of schedule.Job', function(t){

  // Add timer
  timersController.addTimer(timer1, tasks);

  // Get created timer with job added
  var timer = timersController.getTimer(timer1.time);

  // Test
  t.ok(timer.job instanceof schedule.Job);

  // Kill active processes
  timersController.removeTimer(timer1.time);
  t.end();
});


// *** Check if functions are run at the start and end of the tinmer
test('Should trigger after 5 seconds, and trigger timeout after 1 minute', function(t){

  t.plan(2);

  // Create timer
  var timer = {
    time: new Date(Date.now() + 5000),
    duration: 1,     // 5 seconds
  }

  //
  var tasks = { onStart: function(){
                  t.ok(true);
                },
                onEnd: function(){
                  t.ok(true);
                  timersController.removeTimer(timer.time);
                  t.end()
                  }
                };


  // Add timer
  timersController.addTimer(timer, tasks);

});
