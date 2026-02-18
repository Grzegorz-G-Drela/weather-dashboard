import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = 3000;

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));