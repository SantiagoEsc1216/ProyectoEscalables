const Review = require('../models/review.model');

// Get all reviews
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get reviews by movie ID
const getReviewsByMovieId = async (req, res) => {
    try {
        const reviews = await Review.find({ movieId: req.params.movieId }).populate('user', 'name email');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get reviews by user ID
const getReviewsByUserId = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.params.userId }).populate('user', 'name email');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new review
const createReview = async (req, res) => {
    const review = new Review({
        user: req.body.userId,
        movieId: req.body.movieId,
        comment: req.body.comment,
        rate: req.body.rate
    });

    try {
        const newReview = await review.save();
        const populatedReview = await Review.findById(newReview._id).populate('user', 'name email');
        res.status(201).json(populatedReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getAllReviews,
    getReviewsByMovieId,
    getReviewsByUserId,
    createReview
}; 