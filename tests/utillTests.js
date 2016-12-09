var test = require('tape');
var utill = require('../controllers/utill.js');


/*
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

*/
//calculateMilliseconds
test('Should equal 1000', function(t){
  t.equal(1000, utill.calculateMilliseconds(1, 'seconds'));
  t.end();
});

test('Should equal 2000', function(t){
  t.equal(2000, utill.calculateMilliseconds(2, 'seconds'));
  t.end();
});

test('should equal 60000', function(t){
  t.equal(60000, utill.calculateMilliseconds(1, 'minutes'));
  t.end();
});

test('should equal 120000', function(t){
  t.equal(120000, utill.calculateMilliseconds(2, 'minutes'));
  t.end();
});

test('should equal 3600000', function(t){
  t.equal(3600000, utill.calculateMilliseconds(1, 'hours'));
  t.end();
});

test('should equal 7200000', function(t){
  t.equal(7200000, utill.calculateMilliseconds(2, 'hours'));
  t.end();
});
