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
        const reviews = await Review.find({ movieId: req.params.movieId })
            .populate('user', 'name email');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get reviews by user ID personalizado (ej. "2")
const getReviewsByUserId = async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.userId });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const reviews = await Review.find({ user: user._id })
            .populate('user', 'name email');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new review
const createReview = async (req, res) => {
    try {
        const user = await User.findOne({ id: req.body.userId });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const review = new Review({
            user: user._id,
            movieId: req.body.movieId,
            comment: req.body.comment,
            rate: req.body.rate
        });

        const newReview = await review.save();

        const populatedReview = await Review.findById(newReview._id)
            .populate('user', 'name email');

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