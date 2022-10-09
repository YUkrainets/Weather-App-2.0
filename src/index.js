// $(window).on("resize", function () {
//   if ($(window).width() > 600) {
//     $("#body").addClass("limit1000");
//     $("#body").removeClass("limit400");
//   } else {
//     $("#body").addClass("limit400");
//     $("#body").removeClass("limit1000");
//   }
// });

function zero_first_format(value) {
  if (value < 10) {
    value = "0" + value;
  }
  return value;
}
function date_time() {
  const current_datetime = new Date();
  const day = zero_first_format(current_datetime.getDate());
  const month = zero_first_format(current_datetime.getMonth() + 1);
  const year = current_datetime.getFullYear();
  const hours = zero_first_format(current_datetime.getHours());
  const minutes = zero_first_format(current_datetime.getMinutes());
  // const seconds = zero_first_format(current_datetime.getSeconds());

  const dayIndex = current_datetime.getDay();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const week_day = days[dayIndex];
  const time = `${day}.${month}.${year} <br>
  ${week_day}, ${hours}:${minutes}`;
  return time;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

// DO NOT WORK -- cant understand why
// switch (true) {
//   case (0 <= hours && hours < 5) || 22 <= hours:
//     document.getElementById("forecast-main").style.backgroundImage =
//       "url(../img/night.jpg)";
//     break;
//   case 5 <= hours && hours < 9:
//     document.getElementById("forecast-main").style.backgroundImage =
//       "url(../img/sunrise.jpg)";
//     break;
//   case 9 <= hours && hours < 18:
//     document.getElementById("forecast-main").style.backgroundImage =
//       "url(../img/day.jpg)";
//     break;
//   case 18 <= hours && hours < 22:
//     document.getElementById("forecast-main").style.backgroundImage =
//       "url(../img/sunset.jpg)";
//     break;
// }

document.getElementById("updating-date").innerHTML = date_time();

function weatherCondition(response) {
  document.querySelector("h1").innerHTML = response.data.name;
  document.querySelector("#curr-temp").innerHTML = Math.round(
    response.data.main.temp
  );

  // const temperatureElement = document.querySelector("#curr-temp");
  // celsiusTemperature = response.data.main.temp;
  // temperatureElement.innerHTML = Math.round(celsiusTemperature);

  document.querySelector(".weather-description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#max-temp").innerHTML = Math.round(
    response.data.main.temp_max
  );

  document.querySelector("#min-temp").innerHTML = Math.round(
    response.data.main.temp_min
  );
  document.querySelector("#cloud").innerHTML = Math.round(
    response.data.clouds.all
  );
  document.querySelector("#sunrise").innerHTML = new Date(
    response.data.sys.sunrise * 1000
  )
    .toLocaleTimeString()
    .slice(0, 5);
  document.querySelector("#sunset").innerHTML = new Date(
    response.data.sys.sunset * 1000
  )
    .toLocaleTimeString()
    .slice(0, 5);
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;

  let iconElement = document.querySelector(".icon");
  iconElement.setAttribute("src", `img/${response.data.weather[0].icon}.svg`);

  // document
  // .querySelector(".icon")
  // .setAttribute(
  //   "src",
  //   `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  // );

  getForecast(response.data.coord);
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector(".forecast-days");
  let forecastTemplate = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index >= 1 && index < 7) {
      forecastTemplate =
        forecastTemplate +
        `
        <div class="col days">
        <h2>${formatDay(forecastDay.dt)}</h2>
        <div class="row">
            <div class="col daily-temp">
                <p class="max-temp">${Math.round(forecastDay.temp.max)}&deg;</p>
                <p class="min-temp">${Math.round(forecastDay.temp.min)}&deg;</p>
            </div>  
            <div class="col weather-icon"> 
            <img 
              src="img/${forecastDay.weather[0].icon}.svg"
              class="nextdays-icon"
            />
            </div>    
          </div>
          <div class="row">
            <p class="weather-disc">${forecastDay.weather[0].description}</p>
          </div>
        </div>
      `;
    }
  });
  forecastTemplate += `</div>`;
  forecastElement.innerHTML = forecastTemplate;
}

function getForecast(coordinates) {
  let apiKey = "ed238469f9b5e9d801834270e65449bc";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = Math.round((celsiusTemperature * 9) / 5 + 32);
  let temperatureElement = document.querySelector("#curr-temp");
  temperatureElement.innerHTML = fahrenheitTemperature;
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  let temperatureElement = document.querySelector("#curr-temp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}
let celsiusTemperature = null;

function searchCity(city) {
  const apiKey = "8e5b59b809f8bc53074ae3c184eef489";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(weatherCondition);
}

function searchLocation(position) {
  const apiKey = "8e5b59b809f8bc53074ae3c184eef489";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(weatherCondition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function handleSubmit(event) {
  event.preventDefault();
  const city = document.querySelector(".form").value;
  searchCity(city);
  document.querySelector(".form").value = "";
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let currentButton = document.querySelector(".location");
currentButton.addEventListener("click", getCurrentLocation);

searchCity("Kyiv");
