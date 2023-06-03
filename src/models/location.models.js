const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    ip: {
        type: String,
    },
    continent_code: {
        type: String,
    },
    continent: {
        type: String,
    },
    country_code: {
        type: String,
    },
    country: {
        type: String
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number
    },
    timezone: {
        type: String
    }
}, { versionKey: false });

module.exports = mongoose.models.Location || mongoose.model('Location', locationSchema);