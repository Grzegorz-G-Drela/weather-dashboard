
const searchButton = document.querySelector('#search-button');
const cityInput = document.querySelector('#city-input');
const errorDiv = document.querySelector('#searchbar-bottom > .error-div');
const favCities = document.querySelector('#fav-cities');
const fiveDayForecast = document.querySelector('#five-day-forecast');
const autocompleteList = document.querySelector('#autocomplete-list');

cityInput.value = 'Wellington';
fetchWeather();
fetchForecast();
cityInput.value = '';


/*###############################################
################ EVENT LISTENERS ################
###############################################*/

cityInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    fetchWeather();
    fetchForecast();
    cityInput.value = '';
  }
});

searchButton.addEventListener ('click', () => {
  fetchWeather();
  fetchForecast();
});

cityInput.addEventListener('input', () => {
  if(cityInput.value.length < 3) {
    autocompleteList.replaceChildren();
  } else {
    fetchGeocode();
  }
});

document.addEventListener('click', (e) => {
  if ((e.target !== cityInput) && (!autocompleteList.contains(e.target))) autocompleteList.replaceChildren();
});

cityInput.addEventListener('click', () => {
  if (cityInput.value.length >= 3) fetchGeocode();
});

autocompleteList.addEventListener('click', (e) => {
  console.log(e.target.dataset.lat + " " + e.target.dataset.lon);
  fetchByCoordinates(e.target.dataset.lat, e.target.dataset.lon);
});

/*###############################################
################ FETCH FUNCTIONS ################
###############################################*/

// CHECKS if city name exists in API database, than saves the entry in localStorage to later display 'most searched/fav'
function fetchWeather(){
  const input = cityInput.value.toLowerCase();

  fetch(`http://localhost:3000/weather?city=${input}`)
  .then(response => response.json())
  .then(data => {

    if (data.cod === '404') {
      console.log('are we clicking?')
      errorDiv.textContent = 'Wrong city name.';
      return;

    } else {
      const cityName = document.querySelector('#current-weather > .city-name');
      const temperature = document.querySelector('#current-weather > .temperature');
      const windSpeed = document.querySelector('#current-weather > .wind-speed');
      const icon = document.querySelector ('#current-weather > .icon');

      errorDiv.textContent = '';
      cityName.textContent = data.name;
      temperature.textContent = Math.round(data.main.temp) + '\u2103';
      windSpeed.textContent = data.wind.speed;
      icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      let searches = JSON.parse(localStorage.getItem('searches'));
      searches = searches || [];
      const cityExists = searches.find(item => item.city === input); 
      
      cityExists ? cityExists.count ++ : searches.push({city: input, count: 1});

      localStorage.setItem('searches', JSON.stringify(searches));
      renderFavourites();
    }
  });
}

// API automatically returns 40 entries for 5 days (8 per day)
// we filter to one entry per day (12:00 noon), then we transfer to display
function fetchForecast() {
  const input = cityInput.value;

  fetch(`http://localhost:3000/forecast?city=${input}`)
  .then(response => response.json())
  .then(data => {
    fiveDayForecast.replaceChildren();
    if (data.cod === '404') return; 
 
    const daily = data.list.filter((element) => element['dt_txt'].includes('12:00:00'));
    console.log(daily);
    daily.forEach((day) => displayForecast(day));
  });
}

function fetchGeocode() {
  const input = cityInput.value;
  
  fetch(`http://localhost:3000/geocode?city=${input}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    autocompleteList.replaceChildren();
    data.forEach(item => {
      const city = document.createElement('li');

      city.textContent = `${item.name}, ${item.state}, ${item.country}`;
      city.dataset.lat = item.lat;
      city.dataset.lon = item.lon;

      autocompleteList.append(city);
    })
  })
}

function fetchByCoordinates(lat, lon) {

  fetch(`http://localhost:3000/coordinates?lat=${lat}&lon=${lon}`)
  .then(response => response.json)
  .then(data => {
    fetchWeather();
  })
}


/*###############################################
################## FUNCTIONS ####################
###############################################*/



function displayForecast(day) {
  const div = document.createElement('div');
  const date = document.createElement('h3');
  const temperature = document.createElement('h1');
  const windSpeed = document.createElement('p');
  const icon = document.createElement('img');
  
  div.classList.add('weather');
  date.classList.add('city-name');
  temperature.classList.add('temperature');
  windSpeed.classList.add('wind-speed');
  icon.classList.add('icon');
  
  date.textContent = day.dt_txt.slice(0, 10);
  temperature.textContent = Math.round(day.main.temp) + '\u2103';
  windSpeed.textContent = day.wind.speed;
  icon.src = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
  icon.alt = 'the weather icon';

  div.append(date, temperature, windSpeed, icon);
  fiveDayForecast.append(div);
}

function renderFavourites () {
  let searches = JSON.parse(localStorage.getItem('searches'));
  searches = searches || [];
  const sorted = searches.sort((a, b) => b.count - a.count);
  const fiveMostSearched = sorted.slice(0, 5);
  favCities.replaceChildren();
  fiveMostSearched.forEach(item => {
    const cityButton = document.createElement('button');
    const cityName = item.city;

    splitName = cityName.split(' ');
    const capitalisedWords = splitName.map(word => {
      const capitalised = word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
      return capitalised;
    })
    cityButton.textContent = capitalisedWords.join(' ');
    
    cityButton.classList.add('city-buttons');
    favCities.appendChild(cityButton);
    cityButton.addEventListener('click', () => {
      cityInput.value = cityButton.textContent;
      fetchWeather();
      fetchForecast();
    })
  });
}