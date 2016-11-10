var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var tesselController = require('./tesselController');
var schedule = require('node-schedule');
var utill = require('./utill');

var timers = [];

module.exports = function(app){

    //Toggle pump and return response with pump state and list of active timers
  app.get('/pump/', function(req, res){

    tesselController.togglePump(function(state){
      res.send(JSON.stringify({on: state, timers: timers}));
    });

  });

 // Add new timer return response with list of timers
  app.post('/timer/add/', jsonParser, function(req, res){
    var timer = req.body;

    if(timer){
      var time = new Date(timer.time);
      //schedule new job with requested time
      var j = schedule.scheduleJob({hour: time.getHours(), minute: time.getMinutes()}, function(){

        tesselController.startPump();

        setTimeout(function(){
          tesselController.stopPump();
        }, utill.getMilliseconds(timer.duration, 'h'));
      });
      timer.job = j;
      timers.push(timer);
    }

    var data = JSON.stringify({timers: timers});
    res.send(data);
  });

  app.post('/timer/remove/', jsonParser, function(req, res){
    for(var i=0; i < timers.length; i++){
      var time = timers[i].time;
      if(time === req.body.time){
        timers[i].job.cancel();
        timers.splice(i, 1);
      }
    }
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
