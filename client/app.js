
const searchButton = document.querySelector('#search-button');
const cityInput = document.querySelector('#city-input');
const errorDiv = document.querySelector('#input-wrapper > .error-div');
const favCities = document.querySelector('#fav-cities');
const currentWeather = document.querySelector('#current-weather');
const fiveDayForecast = document.querySelector('#five-day-forecast');
const autocompleteList = document.querySelector('#autocomplete-list');

renderFavourites();

cityInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    fetchWeather();
    fetchForecast();
    cityInput.value = '';
  }
});

searchButton.addEventListener('click', () => {
  fetchWeather();
  fetchForecast();
});

cityInput.addEventListener('input', () => {
  if (cityInput.value.length < 3) {
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
  fetchByCoordinates(e.target.dataset.lat, e.target.dataset.lon, e.target.dataset.name);
});
