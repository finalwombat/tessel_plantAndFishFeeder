
var tesselController = require('./tesselController');

module.exports = function(app){
  app.get('/pump/', function(req, res){

    var state = tesselController.togglePump();
    res.send(JSON.stringify({on: state}));

  });
  app.post('/timer/add/', function(req, res){
    console.log(req);
  });
}
