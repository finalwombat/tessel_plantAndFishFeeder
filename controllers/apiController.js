var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var tesselController = require('./tesselController');

var timers = [];

module.exports = function(app){
  app.get('/pump/', function(req, res){

    tesselController.togglePump(function(state){
      res.send(JSON.stringify({on: state}));
    });

  });
  app.post('/timer/add/', jsonParser, function(req, res){

    var timer = req.body;
    console.log(timer.timeUntil);
    var interval = setInterval(tesselController.startPump, timer.timeUntil);

    timer.timerVar = interval;
    
    timers.push(timer);
    console.log(timers);
  });
}
