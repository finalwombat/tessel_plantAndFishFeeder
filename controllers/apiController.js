var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var tesselController = require('./tesselController');
var timersController = require('./timersController');


module.exports = function(app){

    //Toggle pump and return response with pump state and list of active timers
  app.get('/pump/', function(req, res){

    tesselController.togglePump(function(state){
      res.send(JSON.stringify({on: state, timers: timers}));
    });

  });

 // Add new timer return response with list of timers
  app.post('/timer/add/', jsonParser, function(req, res){

    timersController.addTimer(req.body)

    var data = JSON.stringify({timers: timersController.getTimers()});
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
