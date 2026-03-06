
const searchButton = document.querySelector('#search-button');
const cityInput = document.querySelector('#city-input');
const errorDiv = document.querySelector('#input-wrapper > .error-div');
const favCities = document.querySelector('#fav-cities');
const currentWeather = document.querySelector('#current-weather');
const fiveDayForecast = document.querySelector('#five-day-forecast');
const autocompleteList = document.querySelector('#autocomplete-list');

renderFavourites();

let activeIndex = -1;

cityInput.addEventListener('keydown', function (event) {
  const liAll = document.querySelectorAll('#autocomplete-list>li');
  switch (event.key) {
    case 'Enter':
      if (activeIndex > -1) {
        const activeLi = liAll[activeIndex];
        fetchByCoordinates(activeLi.dataset.lat, activeLi.dataset.lon, activeLi.dataset.name);
        autocompleteList.replaceChildren();
        cityInput.value = '';
        break;
      } else {
        fetchWeather();
        fetchForecast();
        cityInput.value = '';
      } break;
    case 'ArrowDown':
      event.preventDefault();
      if (liAll.length === 0 && cityInput.value) {
        fetchGeocode();
        break;
      } else {
        if (activeIndex < liAll.length - 1) activeIndex++;
        liAll.forEach(li => li.classList.remove('active'));
        liAll[activeIndex].classList.add('active');
      }
      break;
    case 'ArrowUp':
      event.preventDefault();
      if (activeIndex > 0) activeIndex--;
      liAll.forEach(li => li.classList.remove('active'));
      liAll[activeIndex].classList.add('active');
      break;
    case 'Escape':
      autocompleteList.replaceChildren();
      activeIndex = -1;
    default:
      break;
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
