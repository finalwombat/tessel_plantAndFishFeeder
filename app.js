var express = require('express');
var app = express();

// Import the interface to Tessel hardware
var tessel = require('tessel');
var relaylib = require('relay-mono');
var relay = relaylib.use(tessel.port['A']);

var port = process.env.PORT || 8080;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  console.log('/');
        res.render('index');
    });
app.get('/pump/', function(req, res){
  console.log('pump');
  relay.toggle(1, function(err){
    if (err) {
      console.log("error toggling relay", err);
    } else {
      var state;
      relay.getState(1, function(err, state){
        res.send(JSON.stringify({on: state}));
      });

    }
  });
});

app.listen(port);
// Put a friendly message in the terminal
console.log("Server running at 192.168.1.171:" + port);
