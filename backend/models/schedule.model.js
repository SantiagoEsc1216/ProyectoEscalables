const mongoose = require('mongoose');
const seatSchema = require('./seats.model');

const scheduleSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    movieId: {type: String},
    date: {
        type: String,
        required: true
    },
    hour: {
        type: String,
        required: true
    },
    room: {
        type: Number,
        required: true
    },
    seats: [seatSchema]
}, {
    timestamps: false,
    collection: "schedule"
});

module.exports = mongoose.model('Schedule', scheduleSchema); 