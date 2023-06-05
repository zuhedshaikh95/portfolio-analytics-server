const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    ip: {
        type: String,
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
    eu: {
        type: String
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
    metro: {
        type: Number
    },
    area: {
        type: Number
    }
}, { versionKey: false, timestamps: true });

module.exports = mongoose.models.Location || mongoose.model('Location', locationSchema);