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
var inputDay;
var inputDate;
var parsedInputDay;
var resultsDiv = document.getElementById("results-div");


function map(latitude, longitude) {
    console.log(latitude, longitude);
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

    var handleResults = function (result) {
        console.log(result);
        if (result.results) {
            moveMap(result.results[0].position)
        }
    }
    
submitButton.addEventListener("click", search);

    function search () {
        tt.services.fuzzySearch({
            key: API_KEY,
            query: document.getElementById("query").value,
            }).go().then(handleResults)
    }
}


// This function inserts the city into the apiURL then fetches the latitude and longitude of the city.  It checks the cities in the storage array and if the current searched city is not in the array, it adds it to the array.  If it's already in there it doesn't re-add the city to the array.  Then it runs the getWeather and getFiveDay functions.


var getLatLonCity = function (city) {

    var apiURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=44be570f60fd1ef1f012456a39e5a0ff";

    fetch(apiURL).then(function (response) {

        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);

                for (var i = 0; i < data.length; i++) {
                    latitude = data[i].lat;
                    longitude = data[i].lon;
                    cityName = data[i].name;

                    getForecast(latitude, longitude);
                    map(latitude, longitude);
                    getNearbyResults(requestURL, latitude, longitude);
                }
            })
        }
    })
};

// Puts values into local storage
var loadLocalStorage = function (loadCity, loadDate) {
    var citiesInStorage = JSON.parse(localStorage.getItem("citySearch")) || []
    citiesInStorage.push({ searchedName: loadCity, searchedDate: loadDate });
    localStorage.setItem("citySearch", JSON.stringify(citiesInStorage));
    var cityArray = JSON.parse(localStorage.getItem("citySearch"));
    
    var recallSearch = function () {
      
        for (let i = 0; i < citiesInStorage.length; i++) {
            var cityDateButton = document.createElement("button");
    
            var counter = cityArray[i];
    
            cityDateButton.textContent = counter.searchedName + " | " + counter.searchedDate;
            document.getElementById("cities").appendChild(cityDateButton);
            cityDateButton.setAttribute("class", "bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded text-base");
    
            cityDateButton.addEventListener("click", buttonClickHandler)
            var buttonClickHandler = function (event) {
                forecast_Data.innerHTML="";
                var cityDateParse = (event.target.textContent)
                var cityDateParseArray = cityDateParse.split(" | ");
                let cityParse = cityDateParseArray[0];
                let dateParse = cityDateParseArray[1];
                console.log("City: " + cityParse);
                console.log("Date: " + dateParse);
                inputDay=dayjs(dateParse)
                console.log(inputDay);
                getLatLonCity(cityParse);
            }
        }
   
    }
    recallSearch();
}


function getInputDate() {
    var inputDate = document.getElementById("date-input");
    inputDay = dayjs(inputDate.value);
    var parsedInputDay = dayjs(inputDay).format("MM-DD-YYYY");

    return parsedInputDay;
}


function getInputCity() {
    cityName = document.getElementById("location-search").value;
    return cityName; 
}


function handleSubmitBtn (e){
    e.preventDefault();
    console.log(getInputDate());
    var dateData = getInputDate();
    var cityNameData = getInputCity();

    getLatLonCity(cityNameData);

    loadLocalStorage(cityNameData, dateData);
}

var submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", handleSubmitBtn);

var displayDay = dayjs("6-14-2023").format("M-D-YYYY");
var today = dayjs().format("M-D-YYYY");

function determineArrayPosition() {
    if (inputDay.diff(today, "day") > 30) {
        alert("We can't see that far into the future.  Please select a day no more than 30 days into the future.");
        return;
    } else {
        var arrayPosition = inputDay.diff(today, "day");
        return arrayPosition;
    }
};

var getForecast = function (latitude, longitude) {
    var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=44be570f60fd1ef1f012456a39e5a0ff";


    fetch(fiveDayURL).then(function (response) {
        return response.json()})
        .then(function (forecastData) {

            var dayChosen = determineArrayPosition();

            var foreDay = dayjs().add([dayChosen], "day").format("M/D/YYYY");
            var foreIcon = forecastData.list[dayChosen].weather[0].icon;
            var foreTemp = ((((forecastData.list[dayChosen].main.temp) - 273.15) * 1.8) + 32).toFixed(2) + " F";
            var foreFeels = ((((forecastData.list[dayChosen].main.feels_like) - 273.15) * 1.8) + 32).toFixed(2) + " F";
            var foreWind = forecastData.list[dayChosen].wind.speed;
            var foreHumidity = forecastData.list[dayChosen].main.humidity;
            var foreClouds = forecastData.list[dayChosen].clouds.all;
            var foreRain = forecastData.list[dayChosen].pop;
            var foreCity = forecastData.city.name;
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

            var rowDivEl = document.createElement("div");

            var foreList = document.createElement("div");
            foreList.setAttribute("class", "col-12 m-3 col-xl");

            var cardEl = document.createElement("div");
            cardEl.setAttribute("class", "card p-3 m-3 my-2 fs-6");

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
            forecast_Data.appendChild(rowDivEl);
        })
}


var requestURL = "https://api.tomtom.com/search/2/nearbySearch/.json?lat=41.8781136&lon=-87.6297982&radius=10000&key=lQzhlUqG4GkQgblg5j1RGpsNRkCl2PrN";

var baseURL = "https://api.tomtom.com/search/2/nearbySearch/.json?"
var categoryID = "";
var radius = "&radius=10000";
var limit = "&limit=10";
var appid = "&key=lQzhlUqG4GkQgblg5j1RGpsNRkCl2PrN";

function getNearbyResults(requestURL, latitude, longitude) {

    var tomLatitude = latitude;
    var tomLongitude = longitude;
    //setting default to chicago for funcitonality testing
    // if (latitude == "" && longitude == "" && countryCode == "") {
    // tomLatitude = 41.8781136;
    // tomLongitude = -87.6297982;
    // countryCode = "US";
    // alert for empty parameters
    // alert("You must enter a city and country!");
    // }

    var lat = "lat=" + tomLatitude;
    var lon = "&lon=" + tomLongitude;
    var categorySet = "&categoryset=" + categoryID;

    requestURL = baseURL + lat + lon + radius + limit + appid;
    console.log(requestURL);

    if (categoryID !== "") {
        requestURL + categorySet;
    }

    fetch(requestURL)
        .then(function (response) {
            console.log(response);

            if (response.status === 200) {
                console.log("working");
            } else {
                console.log("try again loser");
            }
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            let resultsList = data.results;
            console.log(resultsList);
            //logging entire data object, then isolating results

            for (let index = 0; index < resultsList.length; index++) {
                let resultCard = document.createElement("div");
                resultCard.setAttribute("class", "result-card");
                resultCard.setAttribute("id", "result-info" + [index]);
                
                //going through result by index and retrieving relevant data and saving to object
                let result = {
                    Name: resultsList[index].poi.name,
                    Address: resultsList[index].address.freeformAddress,
                    Categories: resultsList[index].poi.categories.join(),
                    Phone: resultsList[index].poi.phone,
                    Link: resultsList[index].poi.url,
                };
                //if no entry in fetch data, entry for result obj is deleted
                if (result.Phone == undefined) {
                    delete result.Phone;
                }
                if (result.Link == undefined) {
                    delete result.Link;
                }
                console.log(result);
                //preparing result obj to display entries as a readable text
                for (const [key, value] of Object.entries(result)) {
                    console.log(`${key}: ${value}`);
                    let resultText = document.createElement("p");
                    resultText.textContent = `${key}: ${value}`;
                    
                    resultCard.appendChild(resultText);
                }
                console.log(resultCard.textContent);
                resultsDiv.appendChild(resultCard);
            }
        })
}