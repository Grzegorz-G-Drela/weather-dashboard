fetch(`http://localhost:3000/weather?city=${citySearch}`)
.then(response => response.json())
.then(data => {
  console.log(data);
  const cityName = document.querySelector('.city-name');
  cityName.textContent = data.name;
  const temperature = document.querySelector('.temperature');
  temperature.textContent = data.main.temp;
  const windSpeed = document.querySelector('.wind-speed');
  windSpeed.textContent = data.wind.speed;
  const icon = document.querySelector ('.icon');
  icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
});

const searchButton = document.querySelector('#search-button');
const cityInput = document.querySelector('#city-input');

searchButton.addEventListener ('click', citySearch);

function citySearch(){
  input = cityInput.value;

  return input;
}

