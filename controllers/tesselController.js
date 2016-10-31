'use strict';
// Import the interface to Tessel hardware
var tessel = require('tessel');
var relaylib = require('relay-mono');
var relay = relaylib.use(tessel.port['A']);

module.exports = {

  togglePump:  function(callback){
    relay.toggle(1, function(err){
      if (err) {
        callback("error toggling relay", err);
      } else {
        var state;
        relay.getState(1, function(err, state){
          console.log('function: ' + state);
          if(err){callback(err)}
          else {callback(state)}
        });

      }
    });
  },

  startPump: function(){
    relay.turnOn(1, function(err){
      if(err){
        console.log(err);
      } else {console.log('pump on')}
    });
  },
  stopPump: function(){
    relay.turnOff(1, function(err){
      if(err){
        console.log(err)
      }
    });
  }

}
