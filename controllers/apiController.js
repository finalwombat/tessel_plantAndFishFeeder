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
      console.log('Time for tea!');
      console.log(time.getHours() + ':' + time.getMinutes());
      console.log('startPump')
      tesselController.startPump();

      setTimeout(function(){
        console.log('stopPump');
        tesselController.stopPump();
      }, 60000 * timer.duration);
    });

    timers.push(timer);
    console.log(timers);
  });
}
