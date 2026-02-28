function fetchWeather() {
  const input = cityInput.value.toLowerCase();

  fetch(`http://localhost:3000/weather?city=${input}`)
    .then(response => response.json())
    .then(data => {

      if (data.cod === '404') {
        console.log('are we clicking?')
        errorDiv.textContent = 'Wrong city name.';
        return;

      } else {
        renderWeather(data);

        let searches = JSON.parse(localStorage.getItem('searches'));
        searches = searches || [];
        const cityExists = searches.find(item => item.city === input);

        // checks if city exists in API base, and if was searched before, creates 5 most searched list
        cityExists ? cityExists.count++ : searches.push({ city: input, count: 1 });

        localStorage.setItem('searches', JSON.stringify(searches));
        renderFavourites();
      }
    });
}

// API returns 40 entries for 5 days - we filter to 5 - 1 per day, 12:00 mid-day
function fetchForecast() {
  const input = cityInput.value;

  fetch(`http://localhost:3000/forecast?city=${input}`)
    .then(response => response.json())
    .then(data => {
      if (data.cod === '404') return;

      const daily = data.list.filter((element) => element['dt_txt'].includes('12:00:00'));
      console.log(daily);
      renderForecast(daily);
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
        city.dataset.name = item.name;

        autocompleteList.append(city);
      })
    })
}

function fetchByCoordinates(lat, lon, name) {

  fetch(`http://localhost:3000/coordinates?lat=${lat}&lon=${lon}`)
    .then(response => response.json())
    .then(data => {
      renderWeather(data, name);

      let searches = JSON.parse(localStorage.getItem('searches'));
      searches = searches || [];
      const cityExists = searches.find(item => item.city === name);

      cityExists ? cityExists.count++ : searches.push({ city: input, count: 1 });

      localStorage.setItem('searches', JSON.stringify(searches));
      renderFavourites();
    })
}





