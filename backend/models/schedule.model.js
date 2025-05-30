const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    row: {
        type: String,
        required: true
    },
    column: {
        type: Number,
        required: true
    },
    free: {
        type: Boolean,
        required: true,
        default: true
    }
});

const scheduleSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    movieId: {type: String},
    date: {
        type: Date,
        required: true
    },
    hour: {
        type: Date,
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