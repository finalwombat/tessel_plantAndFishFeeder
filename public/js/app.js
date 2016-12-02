
    // Add eventlistener to buttons
    var pumpButton = document.getElementById('pump');
    pumpButton.addEventListener('click', togglePump);

    var setTimerButton = document.getElementById('setTimer');
    setTimerButton.addEventListener('click', setTimer);


    function togglePump (event) {

      var button = event.target;
      var statusNode = button.parentNode.querySelector('#pump');


      var req = new XMLHttpRequest();
      req.onreadystatechange = function(e) {
        if (req.readyState == 4 && req.status == 200) {
          if (req.status == 200) {
            var response = JSON.parse(req.responseText);
            statusNode.textContent = response.on ? 'Pump On' : 'Pump Off';
            statusNode.className = response.on ? 'btn btn-success' : 'btn btn-danger';
            console.log(response);
          } else {
            console.log('Error');
          }
        }
      }
      req.open('GET', '/pump/', true);
      req.send();
      }

      function setTimer(){

        //get the user values
        var hours = document.getElementById('hours');
        var minutes = document.getElementById('minutes');
        var duration = document.getElementById('duration');
        var frequency = document.getElementById('frequency');

        var hour = hours.options[hours.selectedIndex].value;
        var minute = minutes.options[minutes.selectedIndex].value;
        var durationValue = duration.options[duration.selectedIndex].value;
        var frequencyValue = frequency.options[frequency.selectedIndex].value;
        console.log('user values:');
        console.log(hour);
        console.log(minute);
        console.log(durationValue);
        console.log(frequencyValue);

        // create new date from user valuse
        var time = moment().hours(parseInt(hour)).minutes(parseInt(minute));
        var now = moment();

        if(moment(time).isBefore(now)){
          time.add(1, 'days');
        }

        timeUTC = moment.utc(time);

        var timer = {
          time: timeUTC.format(),
          duration: durationValue,
          repeat: frequencyValue
        };

        var data = JSON.stringify(timer);

        $.ajax({
          type: "POST",
          url: "/timer/add/",
          data: data,
          success: function(data){
            update(data.on, data.timers);
          },
          dataType: 'json',
          contentType: 'application/json'
        });

      }

      function removeTimer(time){
        $.ajax({
          type: "POST",
          url: "/timer/remove/",
          data: JSON.stringify({time: time}),
          success:  function(data){
            update(data.on, data.timers);
            console.log('recieved response: ' + data);
          },
          dataType: 'json',
          contentType: 'application/json'
        });

      }

      //on startup
      $.get('/getState/', function(data){
          var data = JSON.parse(data);
          update(data.on, data.timers)
          console.log('recieved response: ');
          console.log(data);

        });

      function update(pumpStatus, timers){
        console.log('pump' + pumpStatus + ' timers ' + timers);
        var timerDiv = document.getElementById('timerValue');
        var pumpButton = document.getElementById('pump');

        pumpButton.textContent = pumpStatus ? "Pump On" : "Pump Off";
        pumpButton.className = pumpStatus ? 'btn btn-success' : 'btn btn-danger';

        // remove all child nides
        while (timerDiv.firstChild) {
          timerDiv.removeChild(timerDiv.firstChild);
        }

        //add new nodes
        for(var i=0; i < timers.length; i++){
          var div = document.createElement('div');
          var time = moment(timers[i].time);
          var duration = timers[i].duration;
          var frequency = timers[i].frequency;
          var id = moment.utc(time).format();
          var button = document.createElement('button');

          console.log('before set id')
          console.log(id);

          div.id = id;
          div.className = "timer row";
          timerDiv.appendChild(div);
          var t = document.createElement('p');
          t.innerHTML = time.calendar();
          t.className = "col-md-3"
          var d = document.createElement('p');
          d.innerHTML = duration + ' hours';
          d.className = "col-md-3"
          var f = document.createElement('p');
          f.innerHTML = "everyday";           // needs to be fixed
          f.className = "col-md-3"

          button.className = 'btn btn-danger col-md-1';

          var span = document.createElement('SPAN');
          span.className = 'glyphicon glyphicon-remove'
          button.appendChild(span);

          div.appendChild(t);
          div.appendChild(d);
          div.appendChild(f);
          div.appendChild(button);
          button.addEventListener('click', function(){
            removeTimer(id);
            console.log('id set in button listener');
            console.log(id);
          });

        }
      }
