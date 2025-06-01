const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    id: { type: String, require: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movieId: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false,
    collection: "review"
});

module.exports = mongoose.model('Review', reviewSchema); 