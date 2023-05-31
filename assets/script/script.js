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

// This function inserts the city into the apiURL then fetches the latitude and longitude of the city.  It checks the cities in the storage array and if the current searched city is not in the array, it adds it to the array.  If it's already in there it doesn't re-add the city to the array.  Then it runs the getWeather and getFiveDay functions.

var getLatLonCity = function (city) {

    var apiURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=44be570f60fd1ef1f012456a39e5a0ff";

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

                    console.log(latitude, longitude, cityName)

                    getForecast(latitude, longitude);
                }
            })
        }
    })
};

getLatLonCity("Avilla");

var displayDay = dayjs("6-14-2023").format("M-D-YYYY");
var inputDay = dayjs("6-14-2023");

// console.log(inputDay);
// console.log(displayDay);

// Get the current day and format it the way I want.

// dayjs.extend(customParseFormat);
var today = dayjs().format("M-D-YYYY");

// console.log(today);


var determineArrayPosition = function () {
    if (inputDay.diff(today,"day")>30) {
        alert("We can't see that far into the future.  Please select a day no more than 30 days into the future.");
        return;
    } else if (inputDay.diff(today,"day")<=30) {
        var arrayPosition = inputDay.diff(today,"day");
        return arrayPosition;

        // console.log("Made it to where i should display");
        // console.log(i);
    }
}

// determineArrayPosition();


var getForecast = function (latitude, longitude) {
    var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=44be570f60fd1ef1f012456a39e5a0ff";


    fetch(fiveDayURL).then(function (response) {
        response.json().then(function (forecastData) {

            console.log(forecastData);

            var dayChosen = determineArrayPosition();

            // i is the arrayPosition calculated from inputDay-today

            // rowDivEl.innerHTML = "";

            console.log(dayChosen);
           
                var foreDay = dayjs().add([dayChosen], "day").format("M/D/YYYY");
                var foreIcon = forecastData.list[dayChosen].weather[0].icon;
                var foreTemp = ((((forecastData.list[dayChosen].main.temp) - 273.15) * 1.8) + 32).toFixed(2) + " F";
                var foreFeels = ((((forecastData.list[dayChosen].main.feels_like) - 273.15) * 1.8) + 32).toFixed(2) + " F";
                var foreWind = forecastData.list[dayChosen].wind.speed;
                var foreHumidity = forecastData.list[dayChosen].main.humidity;
                var foreClouds =forecastData.list[dayChosen].clouds.all;
                var foreRain =forecastData.list[dayChosen].pop;
                var foreCountry = forecastData.city.country;
                var foreTimezone = forecastData.city.timezone;
                var foreSunrise = forecastData.city.sunrise;
                var foreSunset = forecastData.city.sunset;

                var sunriseArray= dayjs.unix(foreSunrise);

                console.log(sunriseArray);

                console.log(sunriseArray.$H);

                rainProbability = foreRain*100;

                console.log("Day: " + foreDay + ", Icon: " +foreIcon+ ", Temp: " + foreTemp + ", Feels like: "+ foreFeels +", Wind: " +foreWind+ ", Humidity: " + foreHumidity + ", Cloudiness:" + foreClouds + "%, Rain probability: "+ rainProbability +"%"  + ", Country: "+ foreCountry + ", Timezone: "+ foreTimezone + ", Sunrise: "+ foreSunrise + ", Sunset: "+ foreSunset)

                var foreList = document.createElement("div");
                foreList.setAttribute("class", "col-12 col-xl");
                var cardEl = document.createElement("div");
                cardEl.setAttribute("class", "card p-3 my-2 fs-6");
                var titleEl = document.createElement("h4");
                var tempEl = document.createElement("p");
                var windEl = document.createElement("p");
                var humidityEl = document.createElement("p");
                titleEl.textContent = foreDay;
                tempEl.textContent = "TEMP: " + foreTemp;
                windEl.textContent = "WIND: " + foreWind + " MPH";
                humidityEl.textContent = "HUMIDITY: " + foreHumidity + "%";

                var weatherPicture = "https://openweathermap.org/img/w/" + foreIcon + ".png";


                // var pic = document.createElement("img");
                // pic.setAttribute("alt", "weather icon");
                // pic.src = weatherPicture;
                // pic.setAttribute("height", "50");
                // pic.setAttribute("width", "50");

                // cardEl.appendChild(titleEl);
                // cardEl.appendChild(pic);

                // cardEl.appendChild(tempEl);
                // cardEl.appendChild(humidityEl);
                // cardEl.appendChild(windEl);
                // foreList.appendChild(cardEl);
                // rowDivEl.appendChild(foreList);
           
        })
    });
}

// This adds event listeners on my buttons so that they do something.

// submitEl.addEventListener("submit", formSubmitHandler);
// cityList.addEventListener("click", buttonClickHandler);
