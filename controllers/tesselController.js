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



module.exports = {

  feedFish: function(){
    var position = 0;

    var i =
     setInterval(function(){
        servo.move(servo1, position);
        position += 0.01;
        if (position > 1.50){
          clearInterval(i);
        }
      }, 10);

  },

  feedFishTimes: function(times){
    var position = 0;
    var count = 0;
    var i =
     setInterval(function(){
        servo.move(servo1, position);
        console.log('position:' + position)
        servo.read(servo1, function(err, reading){
          console.log('reading: ' + reading)
        })
        position += 0.01;
        if (position > 1){
          count++;
          position = 0;
        }

        if(count >= times){
          clearInterval(i);
        }

      }, 10);
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
