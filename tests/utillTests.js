var test = require('tape');
var utill = require('../controllers/utill.js');

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
