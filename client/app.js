fetch('http://localhost:3000/weather?city=London')
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
  })
