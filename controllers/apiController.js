var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var tesselController = require('./tesselController');
var timersController = require('./timersController');


module.exports = function(app){

    //Toggle pump and return response with pump state and list of active timers
  app.get('/pump/', function(req, res){

    tesselController.togglePump(function(){
      getCurrentState(function(state){
        res.send(state);
      })
  });
});

 // Add new timer return response with list of timers
  app.post('/timer/add/', jsonParser, function(req, res){

    var tasks = {onStart: function(){tesselController.startPump()}
                  , onEnd: function(){tesselController.stopPump()}
                };
    timersController.addTimer(req.body, tasks);

    getCurrentState(function(state){
      res.send(state);
    })

  });

  app.post('/timer/addFishFeeder/', jsonParser, function(req, res){
    console.log(req.body);
    var tasks = {onStart: function(){ tesselController.feedFishTimes(req.body.feeds)}

                  , onEnd: function(){console.log('Stopped feeding')}
                };
    timersController.addTimer(req.body, tasks);

    getCurrentState(function(state){
      res.send(state);
    })

  });

  app.post('/timer/remove/', jsonParser, function(req, res){

    timersController.removeTimer(req.body.time);

    getCurrentState(function(state){
      res.send(state);
    })
  });

  app.get('/getState/', function(req, res){

    getCurrentState(function(state){
      res.send(state);
    })

  });

  app.get('/feedFish/', function(req, res){

    tesselController.feedFish();
    console.log('get feedFish');
    res.send('fish fed');
  });

}

function getCurrentState(callback){
  var timers = timersController.getTimers();
  tesselController.pumpState(function(state){
    data = JSON.stringify({on: state, timers: timers});
    callback(data);
  });
}
