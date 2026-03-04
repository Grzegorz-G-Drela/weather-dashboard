function fetchWeather() {
  const input = cityInput.value.toLowerCase();
  renderLoading();

  fetch(`http://localhost:3000/weather?city=${input}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Request failed');
      }
      return response.json();
    })
    .then(data => {
      renderWeather(data);

      let searches = JSON.parse(localStorage.getItem('searches'));
      searches = searches || [];
      const cityExists = searches.find(item => item.city === input);

      cityExists ? cityExists.count++ : searches.push({ city: input, count: 1 });
      localStorage.setItem('searches', JSON.stringify(searches));
      renderFavourites();
    })
    .catch(error => {
      renderError(error.message);
    })
}

// API returns 40 entries for 5 days - we filter to 5 - 1 per day, 12:00 mid-day
function fetchForecast() {
  const input = cityInput.value;
  renderLoading();

  fetch(`http://localhost:3000/forecast?city=${input}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Request failed');
      }
      return response.json();
    })
    .then(data => {
      const daily = data.list.filter((element) => element['dt_txt'].includes('12:00:00'));
      renderForecast(daily);
    })
    .catch(error =>{
      renderError(error.message);
    })
}

// TODO: obscure place names return no results via text search — only resolvable via coordinates
function fetchGeocode() {
  const input = cityInput.value;

  fetch(`http://localhost:3000/geocode?city=${input}`)
    .then(response => {
      if (!response.ok) {
        throw new Error ('Request failed');
      }
      return response.json();
    })
    .then(data => {
      autocompleteList.replaceChildren();
      data.forEach(item => {
        const city = document.createElement('li');

        city.textContent = `${item.name}, ${item.state}, ${item.country}`;
        city.dataset.lat = item.lat;
        city.dataset.lon = item.lon;
        city.dataset.name = item.name;

        autocompleteList.append(city);
      })
    })
    .catch(error => {
      renderError(error.message);
    })
}

async function fetchByCoordinates(lat, lon, name) {
  renderLoading();

  try{
    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(`http://localhost:3000/weather/coordinates?lat=${lat}&lon=${lon}`),
      fetch(`http://localhost:3000/forecast/coordinates?lat=${lat}&lon=${lon}`)
    ]);
    if (!weatherResponse.ok) throw new Error ('Request failed');
    if (!forecastResponse.ok) throw new Error ('Request failed');
    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();

    renderWeather(weatherData, name);

    const daily = forecastData.list.filter((element) => element['dt_txt'].includes('12:00:00'));
    renderForecast(daily);
    
    let searches = JSON.parse(localStorage.getItem('searches'));
    searches = searches || [];
    const cityExists = searches.find(item => item.city === name);
    
    cityExists ? cityExists.count++ : searches.push({ city: name, count: 1 });
    
    localStorage.setItem('searches', JSON.stringify(searches));
    renderFavourites();
  } catch (error) {
    renderError(error.message);
  }
}





