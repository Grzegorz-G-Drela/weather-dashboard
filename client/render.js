function renderWeather(city, name) {
  currentWeather.replaceChildren();

  const cityName = document.createElement('h3');
  const temperature = document.createElement('h1');
  const windSpeed = document.createElement('p');
  const icon = document.createElement('img');

  cityName.classList.add('city-name');
  temperature.classList.add('temperature');
  windSpeed.classList.add('wind-speed');
  icon.classList.add('icon');
  icon.alt = 'icon of the weather showing sun for sunny day, clouds for cloudy, etc';

  errorDiv.textContent = '';
  cityName.textContent = name ? name : city.name;
  temperature.textContent = Math.round(city.main.temp) + '\u2103';
  windSpeed.textContent = city.wind.speed;
  icon.src = `https://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`;

  currentWeather.append(cityName, temperature, windSpeed, icon);
}

function renderForecast(daily) {
  fiveDayForecast.replaceChildren(); 

  daily.forEach(day => {
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
  });
}

function renderFavourites() {
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

function renderError(message) {
  currentWeather.replaceChildren();
  fiveDayForecast.replaceChildren();
  const para = document.createElement('p');
  para.textContent = message;
  currentWeather.append(para);
}

function renderLoading() {
  currentWeather.replaceChildren();
  fiveDayForecast.replaceChildren();
  const para = document.createElement('p');
  para.textContent = 'Loading...';
  currentWeather.append(para);
}
