const currentTime = new Date().getHours();
if (document.body) {
  if (7 <= currentTime && currentTime < 20) {
    document.body.background = "./img/day.jpg";
  } else {
    document.body.background = "./img/night.jpg";
  }
}

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
  let days = [
    "Sunday",
    "Monaday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[day];
}

document.getElementById("date").innerHTML = date_time();

function weatherCondition(response) {
  document.querySelector("h1").innerHTML = response.data.name;
  document.querySelector("#current-temperature").innerHTML = Math.round(
    response.data.main.temp
  );

  // const temperatureElement = document.querySelector("#current-temperature");
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
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 3) {
      forecastHTML =
        forecastHTML +
        `
        <div class="row">
        <h2>${formatDay(forecastDay.dt)}</h2>
        <div class="row"
        <div>
            <div class="weather-forecast-temperatures col-3">
                <p class="forecast-max-temp">${Math.round(
                  forecastDay.temp.max
                )}° </p>
                <p class="forecasr-min-temp">${Math.round(
                  forecastDay.temp.min
                )}° </p>
            </div>  
            <div class="forecast-icon col-5"> 
            <img 
              src="img/${forecastDay.weather[0].icon}.svg"
              alt=""
          width="50"
            />
            </div>    
          </div>
          <div>
            <p class="weather-decsription">${
              forecastDay.weather[0].description
            }</p>
          </div>
          </div>
        </div>
      `;
    }
  });
  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "ed238469f9b5e9d801834270e65449bc";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

// function displayFahrenheitTemperature(event) {
//   event.preventDefault();
//   celsiusLink.classList.remove("active");
//   fahrenheitLink.classList.add("active");
//   let fahrenheitTemperature = Math.round((celsiusTemperature * 9) / 5 + 32);
//   let temperatureElement = document.querySelector("#current-temperature");
//   temperatureElement.innerHTML = fahrenheitTemperature;
// }

// function displayCelsiusTemperature(event) {
//   event.preventDefault();
//   fahrenheitLink.classList.remove("active");
//   celsiusLink.classList.add("active");
//   let temperatureElement = document.querySelector("#current-temperature");
//   temperatureElement.innerHTML = Math.round(celsiusTemperature);
// }
// let celsiusTemperature = null;

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
