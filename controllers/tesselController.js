'use strict';
// Import the interface to Tessel hardware
var tessel = require('tessel');
var relaylib = require('relay-mono');
var relay = relaylib.use(tessel.port['A']);

module.exports = function(){
  function togglePump(){
    relay.toggle(1, function(err){
      if (err) {
        return("error toggling relay", err);
      } else {
        var state;
        relay.getState(1, function(err, state){
          if(err){return err}
          else {return state}
        });

      }
    });
  }
}
