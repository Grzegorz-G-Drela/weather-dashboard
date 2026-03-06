## Weather Dashboard
A weather app built with Node.js/Express backend and Vanilla JS frontend.

## Features
- Search any city by name to get current weather and a 5-day forecast
- Autocomplete dropdown appears after 3 characters
- Your 5 most searched cities appear as quick-access buttons
- Weather data fetched via OpenWeatherMap API through a backend proxy
- To reset your search history paste that into the browser console and hit Enter - localStorage.removeItem('searches') - then refresh with F5

## Tech Stack
- Backend: Node.js, Express
- Frontend: Vanilla JS, HTML, CSS
- API: OpenWeatherMap

## Running locally
1. Clone the repo
2. npm install
3. Add your OpenWeatherMap API key to a .env file as API_KEY=your_key_here
4. node server.js
5. Open index.html in your browser