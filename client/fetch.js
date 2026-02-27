
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
  .then(response => response.json())
  .then(data => {
    console.log(data);
    
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
  })
}
