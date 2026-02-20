

const searchButton = document.querySelector('#search-button');
const cityInput = document.querySelector('#city-input');
const errorDiv = document.querySelector('#searchbar-bottom > .error-div');

searchButton.addEventListener ('click', citySearch);

cityInput.value = 'Wellington';
citySearch();
cityInput.value = '';


function citySearch(){
  input = cityInput.value;

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
      const cityName = document.querySelector('.city-name');
      cityName.textContent = data.name;
      const temperature = document.querySelector('.temperature');
      temperature.textContent = Math.round(data.main.temp);
      const windSpeed = document.querySelector('.wind-speed');
      windSpeed.textContent = data.wind.speed;
      const icon = document.querySelector ('.icon');
      icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    }
  });
}

