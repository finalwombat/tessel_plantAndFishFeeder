var test = require('tape');
var timersController = require('../controllers/timersController.js');
var schedule = require('node-schedule');


var timer1 = {
              time: new Date(),
              duration: 5,     // 5 seconds
              frequency: 5     // Every Friday
              }


// *** recurance rule
test('should return instance of reccuranceRule', function(t){
  // Get rule
  var rule = timersController.getRecuranceRule(timer1);

  t.ok(rule instanceof schedule.RecurrenceRule);
  t.end();
});

// *** Recurance rule sets rule with correct values
test('shoud return rule with correct values', function(t){

  // Get rule
  var rule = timersController.getRecuranceRule(timer1);
console.log('hour: ', rule.hour);
console.log('hour: ', timer1.time.getHours());
  t.ok(rule.hour === timer1.time.getHours());
  t.end();
})

// *** Crerate a new timer
test('should be one more timer after we add one', function(t){

  // get how many timers there currently are
  var timersBefore = timersController.getTimers().length;

  // Functions to run at the start and end of the duration
  var tasks = {onStart: function(){} , onEnd: function(){} };

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

  // Functions to run at the start and end of the duration
  var tasks = {onStart: function(){} , onEnd: function(){} };

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

  // Create tasks
  var tasks = { onStart: function(){}, onEnd: function(){} };

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
test('Should trigger after 5 seconds, and trigger timeout ofter another 5', function(t){

  t.plan(2);

  // Create timer
  var timer = {
    time: new Date(Date.now() + 5000),
    duration: 5,     // 5 seconds
    frequency: 5     // Every Friday
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
