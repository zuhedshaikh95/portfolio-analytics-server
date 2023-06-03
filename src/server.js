require('dotenv').config();
const express = require('express');
const cors = require('cors');
const satelize = require('satelize');
const { connect } = require('./configs');
const { Location } = require('./models');
const PORT = 8080;

const app = express();

app.use(cors({
    origin: ['https://fiverr-clone-zuhed.netlify.app'],
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/', (request, response) => {
    return response.send('Hello, Topper!');
});

app.get('/visit', async (request, response) => {
    const ips = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    const ip = ips.split(',')[0];

    try {
        const locations = await Location.find({});
        for(let location of locations) {
            if(location.ip === ip) {
                return response.status(200).send({
                    message: 'You are already visited!',
                    count: locations.length,
                })
            }
        }

        const details = satelize.satelize({ ip }, (error, payload) => payload);
        const newLocation = new Location({
            ip,
            continent_code: details.continent_code,
            continent: details.continent.en,
            country_code: details.country_code,
            country: details.country.en,
            latitude: details.latitude,
            longitude: details.longitude,
            timezone: details.timezone,
        });

        await newLocation.save();
        return response.status(200).send({
            message: 'Welcome!',
            count: locations.length + 1,
        })
    }
    catch({ message }) {
        return response.status(500).send({
            message
        })
    }

});

app.listen(PORT, async () => {
    try {
        await connect();
        console.log(`Listening at http://localhost:${PORT}`);
    }
    catch({ message }) {
        console.log(message);
    }
});