// Create the variables I plan to use.

var submitEl = document.querySelector("#submit-form");
var cityInput = document.querySelector("#search-input");
var cityTitle = document.querySelector("#city");
var currentTemp = document.querySelector("#current-temp");
var currentWind = document.querySelector("#current-wind");
var currentHumidity = document.querySelector("#current-humidity");
var fiveDay = document.querySelector("#five-day");
var weatherPicture = document.querySelector("#weather-icon");
var forePicture = document.querySelector("#fore-icon")
var cityList = document.querySelector("#cities");
var cardContainer = document.querySelector("#card-container");
var searchedCities = document.querySelector("#searched-cities");
var forecast_Data = document.querySelector("#forecast-data");



// More variable declarations so that they can be called outside of the function in which they are gathered.

// var latitude = "string";
// var longitude = "string";
// var cityName = "string";

// Create a function to get the city name and iterate through the cities in storage and display them on a button on the page.

// var formSubmitHandler = function (event) {
//     event.preventDefault();

//     var cityName = cityInput.value.trim();

//     if (cityName) {

//         getLatLonCity(cityName);
//         document.getElementById("cities").innerHTML = "";

//         searchedCities.setAttribute("class", "border-top border-secondary border-3 m-3 p-2 searched-cities text-center");

//         for (let i = 0; i < citiesInStorage.length; i++) {
//             var cityButton = document.createElement("button");
//             cityButton.setAttribute("class", "btn m-1 btn-secondary align-items-center");
//             cityButton.textContent = citiesInStorage[i];
//             document.getElementById("cities").appendChild(cityButton);
//         }

//     } else {
//         alert("Please enter a city name.");
//     }
// };

// Create a function to get the city name and iterate through the cities in storage and display them on a button on the page.

// var formSubmitHandler = function (event) {
//     event.preventDefault();

//     var cityName = cityInput.value.trim();

//     if (cityName) {

//         getLatLonCity(cityName);
//         document.getElementById("cities").innerHTML = "";

//         searchedCities.setAttribute("class", "border-top border-secondary border-3 m-3 p-2 searched-cities text-center");

//         for (let i = 0; i < citiesInStorage.length; i++) {
//             var cityButton = document.createElement("button");
//             cityButton.setAttribute("class", "btn m-1 btn-secondary align-items-center");
//             cityButton.textContent = citiesInStorage[i];
//             document.getElementById("cities").appendChild(cityButton);
//         }

//     } else {
//         alert("Please enter a city name.");
//     }
// };


function map(latitude, longitude){
    var API_KEY = "7ZuASDGIDYaSxAwpTaBAcI5E3Eqe7pq4";
    // var MADRID = [-3.703790, 40.416775];
    // var LISBON = [-9.1319, 38.7222];
    var coordinates = [longitude, latitude];
    console.log(coordinates);
    var map = tt.map({
        key: API_KEY,
        //center: MADRID,
        center: coordinates,
        zoom: 10,
        container: 'mymap',
    });
    

    // var moveMap = function(lnglat) {
    // 	map.flyTo({
    // 		center: lnglat,
    // 		zoom: 14
    // 	})
    // }


    var handleResults = function(result) {
        console.log(result);
        if (result.results) {
            moveMap(result.results[0].position)
        }
    }


    var search = function() {
            tt.services.fuzzySearch({
            key: API_KEY,
            query: document.getElementById("query").value,

            }).go().then(handleResults)
    }

    
}


// This function inserts the city into the apiURL then fetches the latitude and longitude of the city.  It checks the cities in the storage array and if the current searched city is not in the array, it adds it to the array.  If it's already in there it doesn't re-add the city to the array.  Then it runs the getWeather and getFiveDay functions.


var getLatLonCity = function (city) {

    var apiURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + country + "&limit=1&appid=44be570f60fd1ef1f012456a39e5a0ff";

    fetch(apiURL).then(function (response) {

        if (response.ok) {
            response.json().then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    latitude = data[i].lat;
                    longitude = data[i].lon;
                    cityName = data[i].name;

                    // if (!citiesInStorage.includes(cityName)) {
                    //     citiesInStorage.push(cityName);
                    //     localStorage.setItem("citySearch", JSON.stringify(citiesInStorage));
                    // }

                    // console.log(latitude, longitude, cityName)

                    getForecast(latitude, longitude);
                    map(latitude,longitude);
                }
            })
        }
    })
};

function getInput() {
    var cityName = document.getElementById("dropdown-search-city");
    // = prompt("Enter a city name");

    // var countryName = prompt("Enter a country name");

    getLatLonCity(cityName);
}

getInput();

var displayDay = dayjs("6-14-2023").format("M-D-YYYY");

var today = dayjs().format("M-D-YYYY");

var getForecast = function (latitude, longitude) {
    var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=44be570f60fd1ef1f012456a39e5a0ff";


    fetch(fiveDayURL).then(function (response) {
        response.json().then(function (forecastData) {

            var promptDay = prompt("Enter a day MM-DD-YYYY");

            var inputDay = dayjs(promptDay);

            var determineArrayPosition = function () {
                if (inputDay.diff(today, "day") > 30) {
                    alert("We can't see that far into the future.  Please select a day no more than 30 days into the future.");
                    return;
                } else if (inputDay.diff(today, "day") <= 30) {
                    var arrayPosition = inputDay.diff(today, "day");
                    return arrayPosition;
                }
            }

            var dayChosen = determineArrayPosition();

            // console.log(dayChosen);

            // rowDivEl.innerHTML = "";

            var foreCity = forecastData.city.name;
            var foreDay = dayjs().add([dayChosen], "day").format("M/D/YYYY");
            var foreIcon = forecastData.list[dayChosen].weather[0].icon;
            var foreTemp = ((((forecastData.list[dayChosen].main.temp) - 273.15) * 1.8) + 32).toFixed(2) + " F";
            var foreFeels = ((((forecastData.list[dayChosen].main.feels_like) - 273.15) * 1.8) + 32).toFixed(2) + " F";
            var foreWind = forecastData.list[dayChosen].wind.speed;
            var foreHumidity = forecastData.list[dayChosen].main.humidity;
            var foreClouds = forecastData.list[dayChosen].clouds.all;
            var foreRain = forecastData.list[dayChosen].pop;
            var foreCountry = forecastData.city.country;
            var foreTimezone = forecastData.city.timezone;
            var foreSunrise = forecastData.city.sunrise;
            var foreSunset = forecastData.city.sunset;

            var sunriseArray = dayjs.unix(foreSunrise);
            var sunsetArray = dayjs.unix(foreSunset);

            var timezoneFormatted = " (UTC " + foreTimezone / 3600 + " hours)";

            if (sunriseArray.$H < 12) {
                var riseAmpm = "a.m."
            } else {
                var riseAmpm = "p.m."
            }

            if (sunsetArray.$H < 12) {
                var twelveHour = sunsetArray.$H;
                var setAmpm = "a.m.";
            } else {
                var twelveHour = sunsetArray.$H - 12;
                var setAmpm = "p.m.";
            }

            if (sunriseArray.$m.toString().length == 1) {
                var fullSunriseMinutes = sunriseArray.$m + "0";
            } else (fullSunriseMinutes = sunriseArray.$m);

            if (sunsetArray.$m.toString().length == 1) {
                var fullSunsetMinutes = sunsetArray.$m + "0";
            } else (fullSunsetMinutes = sunsetArray.$m);

            var sunrise12Format = sunriseArray.$H + ":" + fullSunriseMinutes + " " + riseAmpm
            var sunset12Format = twelveHour + ":" + fullSunsetMinutes + " " + setAmpm

            rainProbability = foreRain * 100;

            var weatherList = "Day: " + foreDay + "\n" + "City: " + foreCity + "\n" + "Country: " + foreCountry + "\n" + "Timezone: " + timezoneFormatted + "\n" + "Weather icon:  " + foreIcon + "\n" + "Temp: " + foreTemp + "\n" + "Feels like: " + foreFeels + "\n" + "Wind: " + foreWind + "\n" + "Humidity: " + foreHumidity + "\n" + "Cloudiness:" + foreClouds + "%, " + "\n" + "Rain probability: " + rainProbability + "%" + "\n" + "Sunrise: " + sunrise12Format + "\n" + "Sunset: " + sunset12Format;

            console.log(weatherList);

            var rowDivEl = document.createElement("div");

            var foreList = document.createElement("div");
            foreList.setAttribute("class", "col-12 col-xl");

            var cardEl = document.createElement("div");
            cardEl.setAttribute("class", "card p-3 my-2 fs-6");

            var titleEl = document.createElement("h4");
            titleEl.textContent = foreDay;

            var cityCountryEl = document.createElement("p");
            cityCountryEl.textContent = foreCity + " (" + foreCountry + ")";

            var timezoneEl = document.createElement("p");
            timezoneEl.textContent = "Timezone: " + timezoneFormatted;

            var tempEl = document.createElement("p");
            tempEl.textContent = "Temp: " + foreTemp;

            var feelsLikeEl = document.createElement("p");
            feelsLikeEl.textContent = "Feels like: " + foreFeels;

            var windEl = document.createElement("p");
            windEl.textContent = "Wind: " + foreWind + " MPH";

            var humidityEl = document.createElement("p");
            humidityEl.textContent = "Humidity: " + foreHumidity + "%";

            var cloudsEl = document.createElement("p");
            cloudsEl.textContent = "Cloudiness: " + foreClouds;

            var rainEl = document.createElement("p");
            rainEl.textContent = "Rain probability: " + foreRain;

            var sunriseEl = document.createElement("p");
            sunriseEl.textContent = "Sunrise: " + sunrise12Format;

            var sunsetEl = document.createElement("p");
            sunsetEl.textContent = "Sunset: " + sunset12Format;

            var weatherPicture = "https://openweathermap.org/img/w/" + foreIcon + ".png";

            var pic = document.createElement("img");
            pic.setAttribute("alt", "weather icon");
            pic.src = weatherPicture;
            pic.setAttribute("height", "50");
            pic.setAttribute("width", "50");

            cardEl.appendChild(titleEl);
            cardEl.appendChild(pic);
            cardEl.appendChild(cityCountryEl);
            cardEl.appendChild(timezoneEl);
            cardEl.appendChild(tempEl);
            cardEl.appendChild(feelsLikeEl);
            cardEl.appendChild(windEl);
            cardEl.appendChild(humidityEl);
            cardEl.appendChild(cloudsEl);
            cardEl.appendChild(rainEl);
            cardEl.appendChild(sunriseEl);
            cardEl.appendChild(sunsetEl);
            foreList.appendChild(cardEl);
            rowDivEl.appendChild(foreList);
            forecast_Data.append(rowDivEl);
        })
    });
}

// This adds event listeners on my buttons so that they do something.

// submitEl.addEventListener("submit", formSubmitHandler);
// cityList.addEventListener("click", buttonClickHandler);
