import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));
const PORT = 3000;

// TODO (later): try retry idea when API call fails (response.ok = false) - advanced pattern

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`;

    const response = await fetch(url);
    if (!response.ok) {
        res.status(response.status).json({message: 'API request failed'});
        return;
    }
    const data = await response.json();

    res.json(data);
});

app.get('/forecast', async (req, res) => {
    const city = req.query.city;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.API_KEY}&units=metric`;

    const response = await fetch(url);
    if (!response.ok) {
        res.status(response.status).json({message: 'API request failed'});
        return;
    }
    const data = await response.json();

    res.json(data);
});

app.get('/geocode', async (req, res) => {
    const city = req.query.city;
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${process.env.API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
        res.status(response.status).json({message: 'API request failed'});
        return;
    }
    const data = await response.json();

    res.json(data);
});

app.get('/weather/coordinates', async (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=metric`;

    const response = await fetch(url);
    if (!response.ok) {
        res.status(response.status).json({message: 'API request failed'});
        return;
    }
    const data = await response.json();

    res.json(data);
});

app.get('/forecast/coordinates', async (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=metric`;

    const response = await fetch(url);
    if (!response.ok) {
        res.status(response.status).json({message: 'API request failed'});
        return;
    }
    const data = await response.json();

    res.json(data);
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));