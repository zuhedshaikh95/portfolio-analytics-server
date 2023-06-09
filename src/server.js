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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (request, response) => {
    return response.send('Hello, Topper!');
});

app.get('/visit', async (request, response) => {
    const ips = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    const ip = ips.split(',')[0];

    try {
        const data = await Location.aggregate([
            {
                $group: {
                    _id: 'null',
                    count: { $sum: 1 },
                    exists: {
                        $sum: {
                            $cond: [{ $eq: ['$ip', ip] }, 1, 0],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    count: 1,
                    exists: {
                        $cond: [{ $gt: ['$exists', 0] }, true, false],
                    },
                },
            },
        ]);

        if(data[0].exists) {
            return response.status(201).send({
                message: 'You have already been visited!',
                count: data[0].count,
            });
        }

        const geoAddress = geoip.lookup(ip);
        const newLocation = new Location({
            ip,
            range: geoAddress.range,
            country: geoAddress.country,
            region: geoAddress.region,
            timezone: geoAddress.timezone,
            city: geoAddress.city,
            ll: geoAddress.ll
        });
        await newLocation.save();
        
        return response.send({
            message: 'Welcome!',
            count: data[0].count + 1,
        })

    }
    catch ({ message }) {
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
    catch ({ message }) {
        console.log(message);
    }
});