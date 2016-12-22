'use strict';
// Import the interface to Tessel hardware
var tessel = require('tessel');
var relaylib = require('relay-mono');
var servolib = require('servo-pca9685');

var relay = relaylib.use(tessel.port['A']);
var servo = servolib.use(tessel.port['B']);

var servo1 = 1;

servo.on('ready', function(){
  servo.configure(servo1, 0.05, 0.12, function(){
    console.log('servo operational');
  });
})

var position = 0;

module.exports = {

  feedFish: function(){
    setInterval(function(){
      servo.move(servo1, position);
      console.log('moving servo: ', position);
      position += 0.1;
      if (position > 1){
        position = 0;
      }
    }, 50);
  },


  togglePump:  function(callback){
    relay.toggle(1, function(err){
      if (err) {
        callback("error toggling relay", err);
      } else {
        callback();
      }
    });
  },

  startPump: function(){
    relay.turnOn(1, function(err){
      if(err){
        console.log(err);
      } else {}
    })
  },
  stopPump: function(){
    relay.turnOff(1, function(err){
      if(err){
        console.log(err)
      }
    });
  },
  pumpState: function(callback){
    relay.getState(1, function(err, state){
      if(err){callback(err)}
      else{callback(state)}
    })
  }

}
