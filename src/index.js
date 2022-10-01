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
document.getElementById("updating-date").innerHTML = date_time();

function weatherCondition(response) {
  document.querySelector("h1").innerHTML = response.data.name;
  document.querySelector("#curr-temp").innerHTML = Math.round(
    response.data.main.temp
  );
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

function searchCity(city) {
  const apiKey = "8e5b59b809f8bc53074ae3c184eef489";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(weatherCondition);
}

searchCity("Kyiv");

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

let currentButton = document.querySelector(".location");
currentButton.addEventListener("click", getCurrentLocation);

let changeButton = document.querySelector(".search-button");
changeButton.addEventListener("click", handleSubmit);
