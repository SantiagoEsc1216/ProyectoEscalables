const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    id: {type: String},
    title: {
        type: String,
        required: true,
        trim: true
    },
    poster: {
        type: String,
        required: true
    },
    sinopsis: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    actors: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    }
}, {
    timestamps: false,
    collection: "movie"
});

module.exports = mongoose.model('Movie', movieSchema); 