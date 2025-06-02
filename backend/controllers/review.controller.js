const Review = require('../models/review.model');
const User = require('../models/user.model');

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
        console.log(req.body.userId);
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

// Update a review
const updateReview = async (req, res) => {
    try {
        const user = await User.findOne({ id: req.body.userId });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        console.log(req.params.id)
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Reseña no encontrada' });
        }

        // Verificar que el usuario sea el propietario de la reseña
        if (review.user.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'No tienes permiso para actualizar esta reseña' });
        }

        review.comment = req.body.comment;
        review.rate = req.body.rate;

        const updatedReview = await review.save();
        const populatedReview = await Review.findById(updatedReview._id)
            .populate('user', 'name email');

        res.json(populatedReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getAllReviews,
    getReviewsByMovieId,
    getReviewsByUserId,
    createReview,
    updateReview
}; 