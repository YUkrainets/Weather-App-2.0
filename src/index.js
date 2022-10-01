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
