const searchButton = document.querySelector('#search-button');
const cityInput = document.querySelector('#city-input');
const errorDiv = document.querySelector('#searchbar-bottom > .error-div');

// cityInput.addEventListener('keydown', fetchWeather);

cityInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    fetchWeather();
    cityInput.value = '';
  }
});

searchButton.addEventListener ('click', () => {
  fetchWeather();
  fetchForecast();
});

cityInput.value = 'Wellington';
fetchWeather();
fetchForecast();
cityInput.value = '';


function fetchWeather(){
  const input = cityInput.value;

  fetch(`http://localhost:3000/weather?city=${input}`)
  .then(response => response.json())
  .then(data => {
    if (data.cod === '404') {
      console.log('are we clicking?')
      errorDiv.textContent = 'Wrong city name.';

      return;
    } else {
      console.log(data);
      errorDiv.textContent = '';
      const cityName = document.querySelector('#current-weather > .city-name');
      cityName.textContent = data.name;
      const temperature = document.querySelector('#current-weather > .temperature');
      temperature.textContent = Math.round(data.main.temp) + '\u2103';
      const windSpeed = document.querySelector('#current-weather > .wind-speed');
      windSpeed.textContent = data.wind.speed;
      const icon = document.querySelector ('#current-weather > .icon');
      icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      let searches = JSON.parse(localStorage.getItem('searches'));
      searches = searches || [];

      const cityExists = searches.find(item => item.city === input); 
      if(cityExists) {
        cityExists.count ++;
      } else {
        searches.push({city: input, count: 1});
      }

      console.log(searches);
      localStorage.setItem('searches', JSON.stringify(searches));
    }
  });
}



function fetchForecast() {
  const input = cityInput.value;

  fetch(`http://localhost:3000/forecast?city=${input}`)
  .then(response => response.json())
  .then(data => {
    while (fiveDayForecast.firstChild){
      fiveDayForecast.removeChild(fiveDayForecast.firstChild);
    }
    const daily = data.list.filter((element) => element['dt_txt'].includes('12:00:00'));
    console.log(daily);
    daily.forEach((day) => displayForecast(day));
  });
}

const fiveDayForecast = document.querySelector('#five-day-forecast');


function displayForecast(day) {
  // console.log(day);
  const date = document.createElement('h3');
  const div = document.createElement('div');
  const temperature = document.createElement('h1');
  const windSpeed = document.createElement('p');
  const icon = document.createElement('img');
  
  div.append(date);
  div.append(temperature);
  div.append(windSpeed);
  div.append(icon);
  fiveDayForecast.append(div);

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
}