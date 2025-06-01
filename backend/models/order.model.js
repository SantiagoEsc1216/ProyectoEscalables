const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 1
    }
});

const orderSchema = new mongoose.Schema({
    id: {type: String, requiered: true, unique: true},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    schedule: {
        type: String,
        ref: 'Schedule',
        required: true
    },
    foods: [foodSchema],
    seats: [{
        type: String,
        required: true
    }],
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    timestamps: false,
    collection: "order"
});

module.exports = mongoose.model('Order', orderSchema); 