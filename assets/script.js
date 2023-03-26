const apiKey = "1c72dc35ac649191d3ac17d217615cbd";
var savedCities;

function getCityInfo(city) {
  // --- Gets latitude and longitude from Geocoding API ---
  if (city === "") {
    alert("Error");
  } else {
    city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    var queryURL =
      "https://api.openweathermap.org/geo/1.0/direct?q=" +
      city +
      "&appid=" +
      apiKey;
    $.ajax({
      url: queryURL,
      method: "GET",
    })
      .then(function (response) {
        // --- Saves city name to localStorage ---
        savedCities.push(response[0].name);
        localStorage.setItem("cityName", JSON.stringify(savedCities));
        const cityInfo = {
          name: city,
          lat: response[0].lat,
          lon: response[0].lon,
        };
        return cityInfo;
      })
      .then(function (cityInfo) {
        // --- Creating buttons to access search history ---
        var sDiv = $("<div class='row'>");
        var searchdCity = $("<button class='savedCity btn-secoundary btn-lg'>");
        searchdCity.text(cityInfo.name);
        sDiv.append(searchdCity);
        $("#history").append(sDiv);
        // --- Uses lat and lon elements from cityInfo to get weather info ---
        var queryURL =
          "https://api.openweathermap.org/data/2.5/forecast?" +
          "lat=" +
          cityInfo.lat +
          "&lon=" +
          cityInfo.lon +
          "&appid=" +
          apiKey +
          "&units=metric";
        $.ajax({
          url: queryURL,
          method: "GET",
        }).then(function (data) {
          const listData = data.list;
          const weatherDays = [
            moment().add(0, "d").format("YYYY MM DD"),
            moment().add(1, "d").format("YYYY MM DD"),
            moment().add(2, "d").format("YYYY MM DD"),
            moment().add(3, "d").format("YYYY MM DD"),
            moment().add(4, "d").format("YYYY MM DD"),
            moment().add(5, "d").format("YYYY MM DD"),
          ];
          for (let i = 0; i < weatherDays.length; i++) {
            if (i === 0) {
              displayCurrentWeather(
                city,
                fiveDaysWeather(listData, weatherDays[i])
              );
            } else {
              displayFiveWeather(fiveDaysWeather(listData, weatherDays[i]));
            }
          }
        });
      });
  }
}
// ---------------------------------------------------------------------

// --- filter weather data from array and return information for the specific date  
function fiveDaysWeather(array, date) {
  const weatherData = [];
  var itemData;
  for (let i = 0; i < array.length; i++) {
    if (moment(array[i].dt_txt).format("YYYY MM DD") === date) {
      itemData = {
        date: date,
        temp: array[i].main.temp,
        wind: array[i].wind.speed,
        humdty: array[i].main.humidity,
        icon: array[i].weather[0].icon,
      };
      weatherData.push(itemData);
    }
  }
  let data = weatherData[0];
  return data;
}

// --- Displays Current weather info ---
function displayCurrentWeather(city, obj) {
  var currDiv = $("<div class = 'daInfo'>");
  var e = $("<h1>");
  e.text("City of: " + city);
  var i = $("<img>");
  i.attr("src", "https://openweathermap.org/img/wn/" + obj.icon + "@2x.png");
  var a = $("<h2>");
  a.text("Weather date: " + obj.date);
  var b = $("<p>");
  b.text("Temperature: " + obj.temp + "°C");
  var c = $("<p>");
  c.text("Wind speed: " + obj.wind + "KpH");
  var d = $("<p>");
  d.text("Humidity: " + obj.humdty + "%");

  currDiv.append(e, i, a, b, c, d);
  $("#today").append(currDiv);
}
// --- Displays Forecast weather info ---
function displayFiveWeather(obj) {
  var colDiv = $("<div class = 'daInfo col-sm-2'>");
  var i = $("<img>");
  i.attr("src", "https://openweathermap.org/img/wn/" + obj.icon + "@2x.png");
  var a = $("<h5>");
  a.text("Weather date: " + obj.date);
  var b = $("<p>");
  b.text("Temperature: " + obj.temp + "°C");
  var c = $("<p>");
  c.text("Wind speed: " + obj.wind + "KpH");
  var d = $("<p>");
  d.text("Humidity: " + obj.humdty + "%");

  colDiv.append(i, a, b, c, d);
  $("#forecast").append(colDiv);
}

// click event for search button
$("#search-button").on("click", function (event) {
  event.preventDefault();
  let city = $("#search-input").val().trim();
  $("#today").empty();
  $("#forecast").empty();
  $("#search-input").empty();
  getCityInfo(city);
});

// click event for search history button
$("#history").on("click", function (event) {
  event.preventDefault();
  let city = "";
  if (event.target.matches("button")) {
    city = event.target.textContent;
  }
  console.log(city);
  $("#today").empty();
  $("#forecast").empty();
  $("#search-input").empty();
  getCityInfo(city);
});

// --- Uses local storage to load the page
function loadEvents() {
  let sCities = JSON.parse(localStorage.getItem("cityName"));
  if (sCities !== null) {
    for (let i = 0; i < sCities.length; i++) {
      var sDiv = $("<div class='row'>");
      var searchdCity = $("<button class='savedCity btn-secoundary btn-lg'>");
      searchdCity.text(sCities[i]);
      sDiv.append(searchdCity);
      $("#history").append(sDiv);
    }
  }
}


function cityLoad() {
  if (localStorage.getItem("cityName") !== null) {
    savedCities = JSON.parse(localStorage.getItem("cityName"));
  } else {
    // Otherwise define nutritionLog as an array of objects:
    savedCities = [];
  }
}
cityLoad();
$(document).ready(loadEvents);
