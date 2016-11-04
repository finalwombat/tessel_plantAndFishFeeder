var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var tesselController = require('./tesselController');
var schedule = require('node-schedule');

var timers = [];

module.exports = function(app){

  app.get('/pump/', function(req, res){

    tesselController.togglePump(function(state){
      res.send(JSON.stringify({on: state, timers: timers}));
    });

  });
  app.post('/timer/add/', jsonParser, function(req, res){
    console.log('add timer');
    var timer = req.body;
    console.log(timer);
    console.log(timer.length);
    if(timer){

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
    }


    console.log(timers.length);
    var data = JSON.stringify({timers: timers});
    res.send(data);
  });

  app.post('/timer/remove/', jsonParser, function(req, res){
    console.log('post remove timer');
    for(var i=0; i < timers.length; i++){
      var time = timers[i].time;
      if(time === req.body.time){
        console.log(i);
        console.log(time);
        console.log(req.body.time);
        timers[i].job.cancel();
        timers.splice(i, 1);
      }
    }
    console.log(timers.length);
    tesselController.pumpState(function(state){
      res.send(JSON.stringify({on: state, timers: timers}));
    });
  });

  app.get('/getState/', function(req, res){
    tesselController.pumpState(function(state){
      res.send(JSON.stringify({on: state, timers: timers}));
    });

  });
}
