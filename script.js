
if (localStorage.getItem('editor') != undefined) {
    localStorage.setItem('editor', ["7", "10", "13", "2"].toString())
  }
function openEditor() {
location.replace("editor.html")
}
  function loadGRid() {
    var save = localStorage.getItem('editor').split(',')
  }

  function createPopup(title, text) {
    // Create the popup div
    var popup = document.createElement('div');
    popup.id = 'popup';

    // Create the title element
    var titleElement = document.createElement('h3');
    titleElement.textContent = title;
    popup.appendChild(titleElement);

    // Create the text element
    var textElement = document.createElement('p');
    textElement.textContent = text;
    popup.appendChild(textElement);

    // Create the close button
    var closeButton = document.createElement('button');
    closeButton.textContent = 'OK';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.onclick = function () {
      document.body.removeChild(popup);
    };

    // Append the close button to the popup
    popup.appendChild(closeButton);

    // Append the popup to the body
    document.body.appendChild(popup);
  }


  var screenLock;
  function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    document.getElementById('hourly-uv-index')
    // Add leading zeros if necessary
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    var time = hours + ":" + minutes + ":<span class='seconds'>" + seconds + '</span>';

    document.getElementById('clock').innerHTML = time;
    var date = frenchGreeting()
    document.getElementById('date').innerHTML = date;

  }



  // Update the clock every second
  // Update the clock immediately to avoid delay
  updateClock();

  function frenchGreeting() {
    let date = new Date();
    let hours = date.getHours();
    let months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    let day = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();

    if (hours < 12) {
      return "Bonjour! Nous sommes en " + month + " le " + day + " " + year + ".";
    } else if (hours < 18) {
      return "Bon après-midi! Nous sommes en " + month + " le " + day + " " + year + ".";
    } else {
      return "Bonne soirée! Nous sommes en " + month + " le " + day + " " + year + ".";
    }
  }
  async function getScreenLock() {
    if (navigator.wakeLock != null || navigator.wakeLock != undefined) {
      try {
        screenLock = await navigator.wakeLock.request();
        createPopup('Keep screen alive', 'screen is keep alive by wakeLock. On most device it should take not that much batterie. Note around 8-9% per hour on a mobile for a hour')
      } catch (err) {
        console.log(err.name, err.message);
        document.getElementById('video').play()
        createPopup('Keep screen alive', 'screen is keeped alive using a video witch can use more batterie than wakeLock. Sadly wakeLock is not there on your device. Note 2h of continue operation take 20% on the batterie')
      }
      return screenLock;
    } else {
      document.getElementById('video').play()
      createPopup('Keep screen alive', 'screen is keeped alive using a video witch can use more batterie than wakeLock. Sadly wakeLock is not there on your device. Note 2h of continue operation take 20% on the batterie')
    }
  }
  function release() {
    document.getElementById('video').pause()
    if (typeof screenLock !== "undeinfed" && screenLock != null) {
      screenLock.release()
        .then(() => {
          console.log("Lock released 🎈");
          screenLock = null;
        });
    }
  }
  document.addEventListener('visibilitychange', async () => {
    if (screenLock !== null && document.visibilityState === 'visible') {
      screenLock = await navigator.wakeLock.request('screen');
    }
  });
  function toggleLock() {
    var val = document.getElementById('lock').checked
    if (val) {
      getScreenLock()
    } else {
      release()
      document.getElementById('video').pause()
    }
  }
  document.getElementById('video').pause()
  function fullscreen() {
    document.body.requestFullscreen();
  }
  const latitude = 51.5074;
  const longitude = -0.1278;
  function getLocation() {
    if ('geolocation' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
        if (permissionStatus.state === 'granted') {
          navigator.geolocation.getCurrentPosition(
            position => {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;

              // Your code here, use latitude and longitude as needed
              console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            },
            error => {
              console.error(error);
              getLocationByIP();
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            }
          );
        } else if (permissionStatus.state === 'denied') {
          getLocationByIP();
        } else {
          // permissionStatus.state will be 'prompt' if the user hasn't decided yet
          navigator.geolocation.getCurrentPosition(
            position => {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;

              // Your code here, use latitude and longitude as needed
              console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            },
            error => {
              console.error(error);
              getLocationByIP();
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            }
          );
        }
      });
    } else {
      getLocationByIP();
    }

    getWeatherData()
      .then(data => displayWeatherData(data))
      .catch(error => console.error(error));
  }

  function getLocationByIP() {
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        const latitude = data.latitude;
        const longitude = data.longitude;

        // Your code here, use latitude and longitude as needed
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      })
      .catch(error => {
        console.error(error);
      });
  }

  getLocation();

  const weatherIcons = {
    0: 'bx-sun',
    1: 'bx-sun',
    2: 'bx-cloud',
    3: 'bx-cloud',
    45: 'bx-cloud',
    48: 'bx-cloud',
    51: 'bx-rain',
    53: 'bx-rain',
    55: 'bx-rain',
    56: 'bx-rain',
    57: 'bx-rain',
    61: 'bx-rain',
    63: 'bx-rain',
    65: 'bx-rain',
    66: 'bx-rain',
    67: 'bx-rain',
    71: 'bx-cloud-snow',
    73: 'bx-cloud-snow',
    75: 'bx-cloud-snow',
    77: 'bx-cloud-snow',
    80: 'bx-cloud-rain',
    81: 'bx-cloud-rain',
    82: 'bx-cloud-rain',
    85: 'bx-cloud-rain',
    86: 'bx-cloud-rain',
    95: 'bx-cloud-lightning',
    96: 'bx-cloud-lightning',
    99: 'bx-cloud-lightning'
  };
  async function getWeatherData() {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=uv_index&daily=temperature_2m_max,uv_index_max,weathercode&current_weather=true&timezone=auto`);
    const data = await response.json();
    return data;
  }

  function displayHourlyUVIndex(data) {
    const hourlyUVIndexContainer = document.getElementById('hourly-uv-index');
    hourlyUVIndexContainer.innerHTML = '';
    var i = 0
    data.hourly.time.slice(0, 24).forEach((time, index) => {
      const uvIndex = data.hourly.uv_index[index];
      const hour = i;

      const listItem = document.createElement('p');
      listItem.innerText = `UV actuel: ${uvIndex}`;
      listItem.classList.add('hourly-uv-item')
      listItem.dataset.hour = hour
      hourlyUVIndexContainer.appendChild(listItem);
      i++
    });
    updateUVIndex()
  }

  function displayWeatherData(data) {
    displayHourlyUVIndex(data)
    const currentWeatherCode = data.current_weather.weathercode;
    const currentWeatherIcon = weatherIcons[currentWeatherCode] || 'bx-cloud';

    document.getElementById('weather-icon').className = `bx ${currentWeatherIcon}`
    document.getElementById('temperature').innerText = `Température: ${data.current_weather.temperature}°C`;
    document.getElementById('uv-index').innerText = `UV max: ${data.daily.uv_index_max[0]}`;
    document.getElementById('tomorrow-temp').innerText = `Température: ${data.daily.temperature_2m_max[1]}°C`;
    document.getElementById('tomorrow-uv').innerText = `UV max : ${data.daily.uv_index_max[1]}`;
  }

  getWeatherData()
    .then(data => displayWeatherData(data))
    .catch(error => console.error(error));

  function updateUVIndex() {
    var currentHour = new Date().getHours();
    var items = document.getElementsByClassName('hourly-uv-item');

    for (var i = 0; i < items.length; i++) {
      var itemHour = items[i].dataset.hour
      if (itemHour != currentHour) {
        items[i].style.display = 'none';
      } else {
        items[i].style.display = 'block';
      }
    }
  }
  function deselect(e) {
    var popElements = document.querySelectorAll('.pop');
    popElements.forEach(function (pop) {
      pop.style.opacity = '0';
      pop.style.height = '0';
      e.classList.remove('selected');
    });
  }

  function convertSeconds(d) {
    d = Number(d);
    var h = Math.floor((d % 86400) / 3600); // hours
    var m = Math.floor(((d % 86400) % 3600) / 60); // minutes
    var s = Math.floor(((d % 86400) % 3600) % 60); // seconds
    var j = Math.floor(d / 3600 / 24); // days

    return j + " jour " + h + " heures et " + m + " minutes";
  }
  function batteryUpdate() {
    navigator.getBattery().then((battery) => {
      batterieChargeState(".cssBatterie", (battery.charging ? true : false));
      batterieChangeValue(".cssBatterie", battery.level * 100);
    });
  }
  // timeout loop 
  function seconds() {
    updateClock()
    try {
      batteryUpdate()
    } catch { }
  }
  function hour() {
    getWeatherData()
      .then(data => displayWeatherData(data))
      .catch(error => console.error(error));
    updateUVIndex()
  }
  setInterval(hour, 1000 * 60 * 10)
  setInterval(seconds, 10000);
  // end of loops
  function batterieChangeValue(selector, value) {
    document
      .querySelector(selector)
      .style.setProperty("--middle", String(100 - Math.round(value)) + "%");
    document
      .querySelector(selector)
      .style.setProperty(
        "--middle",
        document.querySelector(selector).style.getPropertyValue("--middle")
      );
    document.querySelector(selector).dataset.charge = String(value) + "%";
  }
  function batterieChargeState(selector, value) {
    if (value) {
      document
        .querySelector(selector)
        .style.setProperty("--visbility", "visible");
    } else {
      document.querySelector(selector).style.setProperty("--visbility", "hidden");
    }
  }
  navigator.getBattery().then((battery) => {
    function updateAllBatteryInfo() {
      updateChargeInfo();
      updateLevelInfo();
      updateChargingInfo();
      updateDischargingInfo();
    }
    updateAllBatteryInfo();
    battery.addEventListener("chargingchange", () => {
      updateChargeInfo();
    });
    function updateChargeInfo() {
      batterieChargeState(".cssBatterie", (battery.charging ? true : false));
    }

    battery.addEventListener("levelchange", () => {
      updateLevelInfo();
    });
    function updateLevelInfo() {
      batterieChangeValue(".cssBatterie", battery.level * 100);
    }
    function updateChargingInfo() {
      
    }

    function updateDischargingInfo() {
      
    }
  });
