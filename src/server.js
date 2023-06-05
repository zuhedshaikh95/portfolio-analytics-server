require('dotenv').config();
const express = require('express');
const cors = require('cors');
const geoip = require('geoip-lite');
const { connect } = require('./configs');
const { Location } = require('./models');
const PORT = 8080;

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'https://zuhedshaikh95.github.io'],
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
                return response.send({
                    message: 'You are already visited!',
                    count: locations.length,
                });
            }
        }

        const geoAddress = geoip.lookup(ip);
        const location = new Location({
            ip,
            range: geoAddress.range,
            country: geoAddress.country,
            region: geoAddress.region,
            timezone: geoAddress.timezone,
            city: geoAddress.city,
            ll: geoAddress.ll
        });
        await location.save();

        return response.status(201).send({
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