var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var tesselController = require('./tesselController');
var schedule = require('node-schedule');

var timers = [];

module.exports = function(app){
  app.get('/pump/', function(req, res){

    tesselController.togglePump(function(state){
      res.send(JSON.stringify({on: state}));
    });

  });
  app.post('/timer/add/', jsonParser, function(req, res){

    var timer = req.body;
    var time = new Date(timer.time);
    var j = schedule.scheduleJob({hour: time.getHours(), minute: time.getMinutes()}, function(){

      console.log('startPump')
      tesselController.startPump();

      setTimeout(function(){
        console.log('stopPump');
        tesselController.stopPump();
      }, 60000 * timer.duration);
    });

    timer.job = j;
    timers.push(timer);
    console.log(timers.length);
    res.send();
  });

  app.post('/timer/remove/', jsonParser, function(req, res){
    console.log('post remove timer');
    for(var i=0; i < timers.length; i++){
      console.log(timers[i].time + ' : ' + req.body.hours);
      var time = new Date(timers[i].time);
      if(time.getHours() === req.body.hours &&
          time.getMinutes() === req.body.minutes){
        timers[i].job.cancel();
        timers.splice(i, 1);
        console.log('timer removed');
      }
    }
    console.log(timers.length);
    res.send();
  });
}
