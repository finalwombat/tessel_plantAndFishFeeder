window.onload = function(){


  //on startup
  setEventListeners();

  $.get('/getState/', function(data){
      var data = JSON.parse(data);
      update(data)

    });


    function setEventListeners(){
      var pumpButton = document.getElementById('pump');
      pumpButton.addEventListener('click', togglePump);

      var setTimerButton = document.getElementById('setTimer');
      setTimerButton.addEventListener('click', setTimer);

      var feedFishButton = document.getElementById('feedFish');
      feedFishButton.addEventListener('click', feedFish);

      var setFishFeederTimerButton = document.getElementById('setFishFeederTimer');
      setFishFeederTimerButton.addEventListener('click', setFishFeederTimer);
    }

    function togglePump () {

      $.get('/pump/', function(data){
          var data = JSON.parse(data);
          update(data)

        });
      }

    function setTimer(){

        var values = getTimerElementValues();
        var timer = Timer(values);
        var data = JSON.stringify(timer);

        $.ajax({
          type: "POST",
          url: "/timer/add/",
          data: data,
          success: function(data){
            update(data);
          },
          dataType: 'json',
          contentType: 'application/json'
        });

      }

    function feedFish(){
      $.get('/feedFish/', function(data){
        console.log(data);
      })
    }

    function setFishFeederTimer(){

        var values = getFishFeederTimerElementValues();
        var timer = Timer(values);
        var data = JSON.stringify(timer);

        $.ajax({
          type: "POST",
          url: "/timer/addFishFeeder/",
          data: data,
          success: function(data){
            update(data);
          },
          dataType: 'json',
          contentType: 'application/json'
        });

      }

      function getTimerElementValues(){
        var hours = document.getElementById('hours');
        var minutes = document.getElementById('minutes');
        var duration = document.getElementById('duration');
        var frequency = document.getElementById('frequency');

        var hour = hours.options[hours.selectedIndex].value;
        var minute = minutes.options[minutes.selectedIndex].value;
        var durationValue = duration.options[duration.selectedIndex].value;
        var frequencyValue = frequency.options[frequency.selectedIndex].value;

        var values = {
          hour: hour,
          minute: minute,
          duration: durationValue,
          frequency: frequencyValue
        }

        return values;
      }

      function getFishFeederTimerElementValues(){
        var hours = document.getElementById('fishhours');
        var minutes = document.getElementById('fishminutes');
        var feeds = document.getElementById('feeds');
        var frequency = document.getElementById('fishfrequency');

        var hour = hours.options[hours.selectedIndex].value;
        var minute = minutes.options[minutes.selectedIndex].value;
        var feedsValue = feeds.options[feeds.selectedIndex].value;
        var frequencyValue = frequency.options[frequency.selectedIndex].value;

        var values = {
          hour: hour,
          minute: minute,
          feeds: feedsValue,
          frequency: frequencyValue
        }

        return values;
      }

      function Timer(values){

        // create new date from user values
        var time = moment().hours(parseInt(values.hour))
                            .minutes(parseInt(values.minute));

        var now = moment();

        // Make sure timer is set for the future
        if(moment(time).isBefore(now)){
          time.add(1, 'days');
        }

        // Convert to utc time for server
        timeUTC = moment.utc(time);

        if(values.duration){
          var timer = {
            time: timeUTC.format(),
            duration: values.duration,
            repeat: values.frequency
          }
        }
        else if(values.feeds){
          var timer = {
            time: timeUTC.format(),
            feeds: values.feeds,
            repeat: values.frequency
          }
        }

        return timer;
      }

      function removeTimer(time){
        $.ajax({
          type: "POST",
          url: "/timer/remove/",
          data: JSON.stringify({time: time}),
          success:  function(data){
            update(data);
          },
          dataType: 'json',
          contentType: 'application/json'
        });

      }

      function update(data){

        var pumpStatus = data.on;
        var timers = data.timers;


        var pumpButton = document.getElementById('pump');

        // update pumpButton
        pumpButton.textContent = pumpStatus ? "Pump On" : "Pump Off";
        pumpButton.className = pumpStatus ? 'btn btn-success' : 'btn btn-danger';

        // update timerDiv
        console.log('update');
        console.log(timers)
        updateTimers(timers);

      }

        function updateTimers(timers){
          var node = document.getElementById('timerValue');
          removeAllChildNodes(node);
          addTimers(node, timers);
        }

        function removeAllChildNodes(node){
          while (node.firstChild) {
            node.removeChild(node.firstChild);
          }
        }

        function addTimers(node, timers){

          for(var i=0; i < timers.length; i++){
            node.appendChild(TimerDiv(timers[i]));

          }
        }
        function TimerDiv(timer){
          // Create new div
          var div = document.createElement('div');

          // get timer values
          var time = moment(timer.time);    // convert to moment for better formating
          var duration = timer.duration;
          var frequency = timer.frequency;
          var id = moment.utc(time).format();  // Each div's id is the timers time in utc format

          // Assign id and className
          div.id = id;
          div.className = "timer row";


          // New time element
          var t = document.createElement('p');
          t.innerHTML = time.calendar();
          t.className = "col-md-3"

          // New duration element
          var d = document.createElement('p');
          d.innerHTML = duration + ' minutes';
          d.className = "col-md-3"

          // New frequency element
          var f = document.createElement('p');
          f.innerHTML = "everyday";           // needs to be fixed
          f.className = "col-md-3"

          // Create new button element
          var button = document.createElement('button');
          button.className = 'btn btn-danger col-md-1';

          var span = document.createElement('SPAN');
          span.className = 'glyphicon glyphicon-remove'
          button.appendChild(span);
          button.addEventListener('click', function(){
            removeTimer(id);
          });

          div.appendChild(t);
          div.appendChild(d);
          div.appendChild(f);
          div.appendChild(button);

          return div;
        }
}
