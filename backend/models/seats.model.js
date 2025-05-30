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
