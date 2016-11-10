var test = require('tape');
var utill = require('../controllers/utill.js');
var schedule = require('node-schedule');

//Add timer
test('should be an instance of schedule.Job', function(t){
  var timer = {
    time: new Date()
  }
  var job = utill.createJob(timer.time, function(){});
  t.ok(job instanceof schedule.Job);
  job.cancel();
  t.end();
});

test('Should trigger after 5 seconds, and trigger timeout ofter another 5', function(t){

  var timer = {
    time: new Date(Date.now() + 5000)
  }
  var job = utill.createJob(timer.time, function(){
    t.plan(2);
    console.log('Job start');
    t.ok(true);
    var self = this;
    setTimeout(function(){
      console.log('timeout trigger');
      t.ok(true);
      self.cancel();
    }, 5000);
  });

  t.end();
});

//getMilliseconds
test('Should equal 1000', function(t){
  t.equal(1000, utill.getMilliseconds(1, 's'));
  t.end();
});

test('Should equal 2000', function(t){
  t.equal(2000, utill.getMilliseconds(2, 's'));
  t.end();
});

test('should equal 60000', function(t){
  t.equal(60000, utill.getMilliseconds(1, 'm'));
  t.end();
});

test('should equal 120000', function(t){
  t.equal(120000, utill.getMilliseconds(2, 'm'));
  t.end();
});

test('should equal 3600000', function(t){
  t.equal(3600000, utill.getMilliseconds(1, 'h'));
  t.end();
});

test('should equal 7200000', function(t){
  t.equal(7200000, utill.getMilliseconds(2, 'h'));
  t.end();
});
