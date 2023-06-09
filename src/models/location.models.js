const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    ip: {
        type: String,
    },
    count: {
        type: Number
    },
    range: {
        type: [Number],
    },
    country: {
        type: String,
    },
    region: {
        type: String,
    },
    timezone: {
        type: String,
    },
    city: {
        type: String,
    },
    ll: {
        type: [Number]
    },
}, { versionKey: false });

module.exports = mongoose.models.Location || mongoose.model('Location', locationSchema);